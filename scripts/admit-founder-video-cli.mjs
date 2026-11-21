#!/usr/bin/env node
/**
 * R1658 offline private-only intake CLI. This CLI never invokes providers or
 * uploads files; input files must already be locally acquired/authorized.
 * Writes a NEW private manifest with O_EXCL, mode 0600. Existing manifests
 * cannot be silently overwritten. stdout contains receipt metadata only.
 *
 * Usage:
 * node scripts/admit-founder-video-cli.mjs \
 *     private-existing-manifest.json completed-provider-receipt.json \
 *     original.mp4 archived-copy.mp4 archive-page-url safe-name.mp4 \
 *     worker_id new-private-manifest.json
 */
import { readFile,open,stat } from 'node:fs/promises';
import { admitCompletedVideo } from './admit-founder-video-offline.mjs';
import { summarizeFounderCustody } from './founder-custody-manifest.mjs';

async function parseSmall(path,max) {
 if(typeof path!=='string'||!path.startsWith('/'))throw Error('DENY: absolute path required');
 const s=await stat(path);
 if(!s.isFile()||s.size===0||s.size>max)throw Error('DENY: input size/type');
 return JSON.parse(await readFile(path,'utf8'));
}
async function run() {
 if(process.argv.length!==10)throw Error('usage: eight arguments required');
 const [, ,manifestPath,receiptPath,originalPath,archivePath,archivePageUrl,filename,worker,outputPath]=process.argv;
 if(!outputPath.startsWith('/')||outputPath===manifestPath||outputPath.includes('\0'))
   throw Error('DENY: fresh distinct absolute output required');
 const [manifest,provider]=await Promise.all([parseSmall(manifestPath,1024*1024),parseSmall(receiptPath,4096)]);
 const result=await admitCompletedVideo({manifest,provider,originalPath,archivePath,archivePageUrl,filename,worker});
 summarizeFounderCustody(result.manifest);
 // No-op rechecks require no new output; never rewrite existing manifests.
 if(result.receipt.newRecord) {
   const fd=await open(outputPath,'wx',0o600);
   try {await fd.writeFile(JSON.stringify(result.manifest,null,2)+'\n','utf8');}
   finally {await fd.close();}
 }
 process.stdout.write(JSON.stringify({receipt:result.receipt,recordCount:result.manifest.items.length,
   manifestWritten:result.receipt.newRecord,automatic:false,founderAcknowledged:false})+'\n');
}
run().catch(error=>{process.stderr.write('Founder admission DENIED: '+String(error.message)+'\n');process.exitCode=2;});
