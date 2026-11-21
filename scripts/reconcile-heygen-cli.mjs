#!/usr/bin/env node
/**
 * R1659 read-only offline reconciliation command.
 * Expects an authorized sanitized, complete provider export and private
 * original-file custody manifest. No network, uploads, provider login,
 * notifications, worker spawning, release state updates or archive writes.
 */
import {readFile,stat} from 'node:fs/promises';
import {reconcileHeyGenCompletionFeed} from './reconcile-heygen-completions.mjs';
async function input(path,max) {
 if(typeof path!=='string'||!path.startsWith('/'))throw Error('DENY: absolute input path');
 const s=await stat(path);
 if(!s.isFile()||s.size<1||s.size>max)throw Error('DENY: bounded file required');
 return JSON.parse(await readFile(path,'utf8'));
}
async function main() {
 if(process.argv.length!==4)throw Error('usage: node scripts/reconcile-heygen-cli.mjs SANITIZED_PROVIDER.json PRIVATE_MANIFEST.json');
 const [feed,manifest]=await Promise.all([
  input(process.argv[2],1024*1024),input(process.argv[3],1024*1024)]);
 const report=reconcileHeyGenCompletionFeed(feed,manifest);
 const reduced={schema:report.schema,reviewOnly:report.reviewOnly,automaticallyDispatches:false,
  releaseGate:report.releaseGate,privateMemoryWrites:report.privateMemoryWrites,
  providerJobs:report.providerJobs,archivedVideoReceipts:report.archivedVideoReceipts,
  existingArchiveReceipts:report.existingArchiveReceipts,
  pendingOriginalArchive:report.pendingOriginalArchive,failedProviderJobs:report.failedProviderJobs,
  counts:report.counts,summarySha256:report.summarySha256};
 process.stdout.write(JSON.stringify(reduced,null,2)+'\n');
}
main().catch(e=>{process.stderr.write('Completion reconciliation DENIED: '+String(e.message)+'\n');process.exitCode=2;});
