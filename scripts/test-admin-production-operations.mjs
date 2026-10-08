#!/usr/bin/env node
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

// These execute the actual operator scripts with explicitly synthetic command
// adapters. No provider command, credential, network call or live data is used.
const root = process.cwd();
const sha = 'a'.repeat(40);
const rollbackSha = 'b'.repeat(40);
const site = 'synthetic-owned-admin-site';
const base = 'https://synthetic-admin.example.invalid';
const functions = 'https://us-central1-urai-4dc1d.cloudfunctions.net';

function fixture() {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'urai-admin-operations-'));
  const checkout = path.join(dir, 'checkout');
  const bin = path.join(dir, 'bin');
  mkdirSync(path.join(checkout, 'scripts'), {recursive: true});
  mkdirSync(bin);
  for (const file of ['rollback-production.sh', 'verify-production-live.sh', 'validate-admin-hosting-target.mjs']) {
    copyFileSync(path.join(root, 'scripts', file), path.join(checkout, 'scripts', file));
  }
  const config = JSON.parse(readFileSync(path.join(root, 'firebase.json'), 'utf8'));
  const rc = JSON.parse(readFileSync(path.join(root, '.firebaserc'), 'utf8'));
  rc.targets = {'urai-4dc1d': {hosting: {'urai-admin-production': [site]}}};
  writeFileSync(path.join(checkout, 'firebase.json'), JSON.stringify(config));
  writeFileSync(path.join(checkout, '.firebaserc'), JSON.stringify(rc));
  const credentials = path.join(dir, 'synthetic-only.json');
  writeFileSync(credentials, '{}');
  const observed = path.join(dir, 'provider-invocations.jsonl');
  const requests = path.join(dir, 'public-requests.jsonl');
  const responses = path.join(dir, 'public-responses.json');
  const node = process.execPath;
  writeFileSync(path.join(bin, 'firebase'), `#!${node}\nimport fs from 'node:fs';\nfs.appendFileSync(process.env.URAI_SYNTHETIC_OBSERVATION, JSON.stringify(process.argv.slice(2))+'\\n');\n`);
  writeFileSync(path.join(bin, 'git'), '#!/bin/sh\nif [ "$1" = "rev-parse" ]; then printf "%s\\n" "$URAI_SYNTHETIC_SHA"; fi\nexit 0\n');
  writeFileSync(path.join(bin, 'curl'), `#!${node}\nimport fs from 'node:fs';\nconst args=process.argv.slice(2); const url=args.find(x=>/^https?:/.test(x)); const key=new URL(url).pathname;\nfs.appendFileSync(process.env.URAI_SYNTHETIC_REQUESTS, JSON.stringify({url,args})+'\\n');\nconst response=JSON.parse(fs.readFileSync(process.env.URAI_SYNTHETIC_RESPONSES,'utf8'))[key]??{status:404,body:'not found'};\nif(response.transportFailure)process.exit(7);\nconst out=args.indexOf('-o')>=0?args[args.indexOf('-o')+1]:args[args.indexOf('--output')+1];\nif(out)fs.writeFileSync(out, typeof response.body==='string'?response.body:JSON.stringify(response.body));\nconst headerIndex=args.indexOf('-D')>=0?args.indexOf('-D'):args.indexOf('--dump-header');\nif(headerIndex>=0)fs.writeFileSync(args[headerIndex+1], 'HTTP/2 '+response.status+'\\r\\n'+Object.entries(response.headers??{}).map(([k,v])=>k+': '+v+'\\r\\n').join('')+'\\r\\n');\nif(args.includes('-w')||args.includes('--write-out'))process.stdout.write(String(response.status));\n`);
  for (const file of ['firebase', 'git', 'curl']) chmodSync(path.join(bin, file), 0o755);
  const env = {
    ...process.env, PATH: bin + path.delimiter + process.env.PATH,
    GITHUB_ACTIONS: 'true', GITHUB_REF: 'refs/heads/main',
    GOOGLE_APPLICATION_CREDENTIALS: credentials,
    URAI_ADMIN_TARGET_SHA: sha, URAI_ADMIN_ROLLBACK_COMMIT: rollbackSha,
    URAI_ADMIN_ROLLBACK_RELEASE: 'synthetic-known-good-version',
    URAI_ADMIN_HOSTING_SITE: site, URAI_ADMIN_FIREBASE_PROJECT: 'urai-4dc1d',
    URAI_ADMIN_BASE_URL: base, URAI_ADMIN_FUNCTIONS_BASE_URL: functions,
    URAI_ADMIN_EXPECTED_LIVE_SHA: sha,
    URAI_SYNTHETIC_SHA: sha, URAI_SYNTHETIC_OBSERVATION: observed,
    URAI_SYNTHETIC_REQUESTS: requests, URAI_SYNTHETIC_RESPONSES: responses,
  };
  return {dir, checkout, bin, env, rc, config, observed, requests, responses,
    run(script, overrides={}) {return spawnSync('bash', [path.join(checkout, 'scripts', script)], {cwd: checkout, encoding: 'utf8', env: {...env, ...overrides}});},
    close() {rmSync(dir, {recursive: true, force: true});}};
}

function validResponses() {
  return {
    '/': {status:200,body:'<html>URAI Admin</html>'},
    '/login': {status:200,body:'<html>Sign in</html>'},
    '/api/health': {status:200,body:{ok:true,service:'urai-admin',environment:'production',version:sha}},
    '/__/firebase/init.json': {status:200,body:{projectId:'urai-4dc1d',authDomain:'urai-4dc1d.firebaseapp.com'}},
    '/admin': {status:307,body:'',headers:{Location:base+'/login?next=%2Fadmin'}},
    '/api/admin/collection': {status:401,body:{error:'Unauthorized'}},
    '/api/admin/users': {status:401,body:{error:'Unauthorized'}},
    '/api/auth/admin-session': {status:401,body:{error:'Unauthorized'}},
    '/health': {status:200,body:{service:'urai-admin',status:'ok',projectIdentityPresent:true,revisionPresent:true}},
    '/readiness': {status:200,body:{service:'urai-admin',status:'ready',checks:{projectIdentity:true,runtimeRevision:true,productionOriginHttps:true,allowedOriginsPresent:true,allowedOriginsHttps:true,productionOriginAllowed:true,packagedAdminApp:true}}},
  };
}

test('rollback helper invokes only the matching reviewed dedicated site in protected main context', () => {
  const f=fixture();
  try {
    const restored = validResponses();
    restored['/api/health'].body.version = rollbackSha;
    writeFileSync(f.responses, JSON.stringify(restored));
    const r=f.run('rollback-production.sh');
    assert.equal(r.status,0,r.stderr);
    const calls=readFileSync(f.observed,'utf8').trim().split('\n').map(JSON.parse);
    assert.deepEqual(calls, [['hosting:clone', site+':synthetic-known-good-version', site+':live', '--project','urai-4dc1d']]);
  } finally {f.close();}
});

const rollbackDenials = [
  ['foreign project',{URAI_ADMIN_FIREBASE_PROJECT:'foreign-project'}],
  ['primary Hosting site',{URAI_ADMIN_HOSTING_SITE:'urai-4dc1d'}],
  ['sibling Hosting site',{URAI_ADMIN_HOSTING_SITE:'urai-analytics'}],
  ['foreign Hosting site',{URAI_ADMIN_HOSTING_SITE:'foreign-owned-site'}],
  ['missing protected Hosting site',{URAI_ADMIN_HOSTING_SITE:''}],
  ['local production execution',{GITHUB_ACTIONS:'false'}],
  ['non-main workflow context',{GITHUB_REF:'refs/heads/repair'}],
  ['missing temporary WIF ADC',{GOOGLE_APPLICATION_CREDENTIALS:''}],
  ['invalid approved current SHA',{URAI_ADMIN_TARGET_SHA:'unknown'}],
  ['invalid known-good rollback SHA',{URAI_ADMIN_ROLLBACK_COMMIT:'unknown'}],
  ['unbound source',{},'unbound'],
  ['multiple source sites',{},'multiple'],
];
for (const [name,overrides,mutation] of rollbackDenials) {
  test('rollback helper rejects '+name+' before provider execution', () => {
    const f=fixture();
    try {
      if(mutation) {
        f.rc.targets=mutation==='unbound'?{}:{'urai-4dc1d':{hosting:{'urai-admin-production':[site,'second-site']}}};
        writeFileSync(path.join(f.checkout,'.firebaserc'),JSON.stringify(f.rc));
      }
      const r=f.run('rollback-production.sh',overrides);
      assert.notEqual(r.status,0,r.stdout);
      assert.equal(existsSync(f.observed),false,'no provider invocation on denied rollback');
    } finally {f.close();}
  });
}

test('public verifier accepts current endpoint schemas, exact SHA, readiness and anonymous denials', () => {
  const f=fixture();
  try {
    writeFileSync(f.responses,JSON.stringify(validResponses()));
    const r=f.run('verify-production-live.sh');
    assert.equal(r.status,0,r.stderr);
    const requested=readFileSync(f.requests,'utf8').trim().split('\n').map(JSON.parse);
    assert.ok(requested.some(x=>x.url===functions+'/health'));
    assert.ok(requested.some(x=>x.url===functions+'/readiness'));
    assert.equal(requested.some(x=>/api_health|admin_whoami/.test(x.url)),false);
    assert.match(r.stdout,/authenticated.*separate/i);
  } finally {f.close();}
});

const verificationDenials=[
  ['unknown source version',x=>{x['/api/health'].body.version='unknown';}],
  ['different source version',x=>{x['/api/health'].body.version=rollbackSha;}],
  ['false app health',x=>{x['/api/health'].body.ok=false;}],
  ['wrong service',x=>{x['/api/health'].body.service='legacy-demo';}],
  ['foreign Firebase runtime project',x=>{x['/__/firebase/init.json'].body.projectId='foreign-project';}],
  ['wrong Functions service',x=>{x['/health'].body.service='legacy-api';}],
  ['missing Functions revision identity',x=>{x['/health'].body.revisionPresent=false;}],
  ['unready runtime',x=>{x['/readiness'].status=503;x['/readiness'].body.status='not_ready';}],
  ['false readiness check',x=>{x['/readiness'].body.checks.packagedAdminApp=false;}],
  ['anonymous admin page HTTP 200',x=>{x['/admin'].status=200;}],
  ['external login redirect',x=>{x['/admin'].headers.Location='https://foreign.example.invalid/login';}],
  ['anonymous admin collection HTTP 200',x=>{x['/api/admin/collection'].status=200;}],
  ['anonymous admin users HTTP 200',x=>{x['/api/admin/users'].status=200;}],
  ['anonymous session HTTP 200',x=>{x['/api/auth/admin-session'].status=200;}],
  ['HTML with a forged health substring',x=>{x['/api/health'].body='<html>"status":"ok"</html>';}],
  ['transport failure',x=>{x['/api/health'].transportFailure=true;}],
];
for(const [name,mutate] of verificationDenials) {
  test('public verifier rejects '+name, () => {
    const f=fixture();
    try {
      const responses=validResponses();mutate(responses);writeFileSync(f.responses,JSON.stringify(responses));
      const r=f.run('verify-production-live.sh');
      assert.notEqual(r.status,0,r.stdout);
      assert.equal(existsSync(f.observed),false);
    } finally {f.close();}
  });
}
for(const [name,overrides] of [
  ['missing approved SHA',{URAI_ADMIN_TARGET_SHA:'',URAI_ADMIN_EXPECTED_LIVE_SHA:''}],
  ['plaintext hosting URL',{URAI_ADMIN_BASE_URL:'http://synthetic-admin.example.invalid'}],
  ['foreign Functions project',{URAI_ADMIN_FUNCTIONS_BASE_URL:'https://us-central1-foreign-project.cloudfunctions.net'}],
]) {
  test('public verifier rejects '+name+' before network execution', () => {
    const f=fixture();
    try {
      writeFileSync(f.responses,JSON.stringify(validResponses()));
      const r=f.run('verify-production-live.sh',overrides);
      assert.notEqual(r.status,0,r.stdout);
      assert.equal(existsSync(f.requests),false);
    } finally {f.close();}
  });
}

test('actual protected workflow rebuilds and verifies the approved rollback SHA rather than the failed target', () => {
  const f=fixture();
  try {
    // Use a real isolated synthetic Git ancestry for the workflow worktree;
    // corepack/curl remain adapters and cannot deploy or reach the network.
    rmSync(path.join(f.bin,'git'));
    mkdirSync(path.join(f.checkout,'functions'));
    writeFileSync(path.join(f.checkout,'functions/.keep'),'');
    execFileSync('git',['init','-q'],{cwd:f.checkout});
    execFileSync('git',['add','.'],{cwd:f.checkout});
    execFileSync('git',['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-qm','synthetic reviewed rollback source'],{cwd:f.checkout});
    const knownGood=execFileSync('git',['rev-parse','HEAD'],{cwd:f.checkout,encoding:'utf8'}).trim();
    const responses=validResponses();responses['/api/health'].body.version=knownGood;
    writeFileSync(f.responses,JSON.stringify(responses));
    const corepackObserved=path.join(f.dir,'corepack.jsonl');
    writeFileSync(path.join(f.bin,'corepack'),`#!${process.execPath}\nimport fs from 'node:fs';\nfs.appendFileSync(process.env.URAI_SYNTHETIC_COREPACK,JSON.stringify({args:process.argv.slice(2),buildSha:process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA})+'\\n');\n`);
    chmodSync(path.join(f.bin,'corepack'),0o755);
    const marker=path.join(f.dir,'deployed.json');writeFileSync(marker,'{}');
    const workflow=readFileSync(path.join(root,'.github/workflows/deploy.yml'),'utf8');
    const section=workflow.split('      - name: Restore approved rollback release after failed target verification\n')[1].split('      - name: Write deployment receipt\n')[0];
    const shell=section.split('        run: |\n')[1].split('\n').map(line=>line.startsWith('          ')?line.slice(10):line).join('\n');
    const output=path.join(f.dir,'github-output.txt');
    const result=spawnSync('bash',['-c',shell],{cwd:f.checkout,encoding:'utf8',env:{...f.env,RUNNER_TEMP:f.dir,GITHUB_WORKSPACE:root,GITHUB_OUTPUT:output,URAI_ADMIN_DEPLOY_MARKER:marker,URAI_ADMIN_ROLLBACK_SHA:knownGood,URAI_ADMIN_PRODUCTION_URL:base,URAI_ADMIN_ALLOWED_ORIGINS:base,URAI_SYNTHETIC_COREPACK:corepackObserved,NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:sha}});
    assert.equal(result.status,0,result.stderr+'\n'+result.stdout);
    const calls=readFileSync(corepackObserved,'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(calls.find(x=>x.args.join(' ')==='pnpm build')?.buildSha,knownGood);
    assert.ok(calls.some(x=>x.args.join(' ')==='pnpm exec firebase deploy --only hosting:urai-admin-production,functions,firestore,storage -P urai-4dc1d'));
    assert.match(readFileSync(output,'utf8'),/result=success/);
    assert.equal(existsSync(f.observed),false,'only the explicit corepack adapter was invoked');
  } finally {f.close();}
});
