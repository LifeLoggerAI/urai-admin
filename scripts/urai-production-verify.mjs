import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const hasPackageJson = existsSync('package.json');
const usesPnpm = existsSync('pnpm-lock.yaml');
const usesNpm = existsSync('package-lock.json');

function commandFor(script) {
  if (usesPnpm) {
    return ['pnpm', [script]];
  }

  if (usesNpm) {
    return ['npm', ['run', script, '--if-present']];
  }

  return ['npm', ['run', script, '--if-present']];
}

const commands = [];

if (hasPackageJson) {
  commands.push(commandFor('typecheck'));
  commands.push(commandFor('test'));
  commands.push(commandFor('build'));

  if (!usesPnpm) {
    commands.push(commandFor('urai:qa'));
  }
}

let failed = false;
for (const [cmd, args] of commands) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) failed = true;
}

if (!commands.length) console.log('No package.json found; nothing to verify.');
process.exit(failed ? 1 : 0);
