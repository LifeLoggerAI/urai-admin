import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const read = relative => readFileSync(new URL('../src/'+relative, import.meta.url),'utf8');
const compile = source => ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/^import[\s\S]*?from ['"][^'"]+['"];\n/gm,'').replace(/^export /gm,'');
const library = ts.transpileModule(read('lib/firebase/admin.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const helpers = compile(read('lib/admin/safe-audit-data.ts'));
const postSource=compile(read('app/api/audit/route.ts'));
const getSource=compile(read('app/api/admin/audit/route.ts'));
const collectionSource=compile(read('app/api/admin/collection/route.ts'));

function fixture({deniedStatus,crossOrigin=false,failAudit=false,failQuery=false,datastoreStatus}={}) {
  const writes=[],queries=[],guards=[],errors=[];
  class AdminAuthError extends Error {constructor(status){super('denied');this.status=status;}}
  const record={actorUid:'verified-actor',actorEmail:'staff@example.invalid',action:'proof.audit',createdAt:new Date('2026-10-08T00:00:00Z'),target:{id:'synthetic',type:'job',apiKey:'synthetic-private'},metadata:{role:'admin',requestId:'proof-request',apiKey:'synthetic-private',transcript:'synthetic-private',unreviewed:'synthetic-private',before:{role:'viewer',isActive:true,accessToken:'synthetic-private'}},rawPayload:'synthetic-private',debug:'synthetic-private'};
  const firestore={collection:name=>({
    add:async value=>{if(failAudit)throw Object.assign(new Error('synthetic-private'),datastoreStatus?{status:datastoreStatus}:{});writes.push({name,value});},
    orderBy(){queries.push(name);return this;},limit(){return this;},startAfter(){return this;},
    get:async()=>{if(failQuery)throw Object.assign(new Error('synthetic-private'),datastoreStatus?{status:datastoreStatus}:{});return {docs:[{id:'real-document-id',data:()=>({...record,id:'forged-document-id'})}]};},
    doc:()=>({get:async()=>({exists:true})}),
  })};
  const fakeAdmin={apps:[{}],auth:()=>({}),initializeApp:()=>{}};
  const sdkContext=vm.createContext({exports:{},process:{env:{}},console:{error:(...args)=>errors.push(args)},Date,require:name=>{
    if(name==='firebase-admin')return fakeAdmin;
    if(name==='firebase-admin/firestore')return {getFirestore:()=>firestore};
    throw new Error('Unexpected SDK import '+name);
  }});
  vm.runInContext(library,sdkContext);
  const session=async(_req,roles)=>{guards.push(Array.from(roles));if(deniedStatus)throw new AdminAuthError(deniedStatus);return{uid:'verified-actor',email:'staff@example.invalid',role:'admin'};};
  const context=vm.createContext({Date,Error,SyntaxError,URL,AdminAuthError,console:{error:(...args)=>errors.push(args)},firestore,
    ...sdkContext.exports,
    NextResponse:{json:(body,options)=>({body,status:options?.status??200,headers:options?.headers??{}})},
    requireAdminSession:session,
    requireAdminMutationSession:async(req,roles)=>{if(crossOrigin)throw new AdminAuthError(403);return session(req,roles);},
    adminAuthErrorResponse:error=>({status:error.status??401,body:{error:'denied'},headers:{'Cache-Control':'no-store'}}),
  });
  const safe=vm.runInContext(`(()=>{${helpers};return{sanitizeAuditMetadata,sanitizeAuditRecord};})()`,context);
  Object.assign(context,safe);
  const post=vm.runInContext(`(()=>{${postSource};return POST;})()`,context);
  const get=vm.runInContext(`(()=>{${getSource};return GET;})()`,context);
  const collection=vm.runInContext(`(()=>{${collectionSource};return GET;})()`,context);
  return{post,get,collection,writes,queries,guards,record,errors};
}
const payload=()=>({action:'proof.audit',target:{id:'synthetic',type:'job',apiKey:'synthetic-private'},actorUid:'forged-actor',metadata:{requestId:'proof-request',role:'admin',apiKey:'synthetic-private',transcript:'synthetic-private',unreviewed:'synthetic-private',before:{role:'viewer',isActive:true,accessToken:'synthetic-private'}}});
const request=(body=payload())=>({url:'https://synthetic.example.invalid/api/audit',json:async()=>body});

test('audit POST fails closed when actual required SDK persistence fails',async()=>{const f=fixture({failAudit:true});const r=await f.post(request());assert.equal(r.status,500);assert.equal(f.writes.length,0);});
test('a datastore status field cannot masquerade as an audit POST authorization error',async()=>{const f=fixture({failAudit:true,datastoreStatus:400});const r=await f.post(request());assert.equal(r.status,500);assert.equal(JSON.stringify({response:r,errors:f.errors}).includes('synthetic-private'),false);});
test('audit POST rejects cross-origin mutation before a write',async()=>{const f=fixture({crossOrigin:true});const r=await f.post(request());assert.equal(r.status,403);assert.equal(f.writes.length,0);});
for(const status of [401,403])test('audit POST rejects session/role denial '+status,async()=>{const f=fixture({deniedStatus:status});const r=await f.post(request());assert.equal(r.status,status);assert.equal(f.writes.length,0);});
test('audit POST persists verified actor and minimized evidence before reporting success',async()=>{const f=fixture();const r=await f.post(request());assert.equal(r.status,200);assert.equal(r.headers['Cache-Control'],'no-store');assert.equal(f.writes.length,1);assert.equal(f.writes[0].value.actorUid,'verified-actor');assert.equal(f.writes[0].value.actorEmail,'staff@example.invalid');assert.equal(JSON.stringify(f.writes[0]).includes('synthetic-private'),false);assert.equal(f.writes[0].value.metadata.before.role,'viewer');assert.equal(f.writes[0].value.target.apiKey,undefined);});
test('audit POST rejects malformed JSON before a write',async()=>{const f=fixture();const r=await f.post({...request(),json:async()=>{throw new SyntaxError('synthetic-private');}});assert.equal(r.status,400);assert.equal(f.writes.length,0);assert.equal(JSON.stringify(r).includes('synthetic-private'),false);});
for(const body of [null,[],{...payload(),metadata:[]},{...payload(),action:''},{...payload(),target:{id:'',type:'job'}}])test('audit POST rejects invalid evidence shape '+JSON.stringify(body),async()=>{const f=fixture();const r=await f.post(request(body));assert.equal(r.status,400);assert.equal(f.writes.length,0);});
test('audit GET returns only safe evidence with actual document identity and no-store',async()=>{const f=fixture();const r=await f.get(request());assert.equal(r.status,200);assert.equal(r.headers['Cache-Control'],'no-store');assert.equal(r.body.logs[0].id,'real-document-id');assert.equal(JSON.stringify(r.body).includes('synthetic-private'),false);assert.equal(r.body.logs[0].metadata.role,'admin');assert.equal(r.body.logs[0].metadata.before.isActive,true);assert.equal(f.record.rawPayload,'synthetic-private');});
test('audit GET fails closed without disclosing a datastore error',async()=>{const f=fixture({failQuery:true});const r=await f.get(request());assert.equal(r.status,500);assert.equal(r.headers['Cache-Control'],'no-store');assert.equal(JSON.stringify({response:r,errors:f.errors}).includes('synthetic-private'),false);});
test('a datastore status field cannot masquerade as an audit GET authorization error',async()=>{const f=fixture({failQuery:true,datastoreStatus:400});const r=await f.get(request());assert.equal(r.status,500);assert.equal(JSON.stringify({response:r,errors:f.errors}).includes('synthetic-private'),false);});
for(const status of [401,403])test('audit GET rejects session/role denial '+status+' before query',async()=>{const f=fixture({deniedStatus:status});const r=await f.get(request());assert.equal(r.status,status);assert.equal(f.queries.length,0);});
const collectionRequest=()=>({...request(),url:'https://synthetic.example.invalid/api/admin/collection?collection=auditLogs'});
test('alternate audit collection read uses the same minimized evidence boundary',async()=>{const f=fixture();const r=await f.collection(collectionRequest());assert.equal(r.status,200);assert.equal(r.headers['Cache-Control'],'no-store');assert.equal(r.body.records[0].id,'real-document-id');assert.equal(JSON.stringify(r.body).includes('synthetic-private'),false);assert.equal(r.body.records[0].metadata.role,'admin');});
test('alternate audit collection fails closed without raw datastore error logs',async()=>{const f=fixture({failQuery:true});const r=await f.collection(collectionRequest());assert.equal(r.status,500);assert.equal(r.headers['Cache-Control'],'no-store');assert.equal(JSON.stringify({response:r,errors:f.errors}).includes('synthetic-private'),false);});
test('a datastore status field cannot masquerade as an alternate audit authorization error',async()=>{const f=fixture({failQuery:true,datastoreStatus:400});const r=await f.collection(collectionRequest());assert.equal(r.status,500);assert.equal(JSON.stringify({response:r,errors:f.errors}).includes('synthetic-private'),false);});
for(const status of [401,403])test('alternate audit collection rejects session/role denial '+status+' before query',async()=>{const f=fixture({deniedStatus:status});const r=await f.collection(collectionRequest());assert.equal(r.status,status);assert.equal(f.queries.length,0);});
