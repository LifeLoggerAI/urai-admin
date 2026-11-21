/**
 * R1658: offline authorized video-admission step.
 * No polling, provider download, cloud uploads, IAM, Firestore or notifications.
 */
import { createHash } from 'node:crypto';
import { promises as fs, constants } from 'node:fs';
import { summarizeFounderCustody } from './founder-custody-manifest.mjs';
const VID=/^[0-9a-f]{32}$/;
const FILE=/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,170}\.mp4$/;
const WORKER=/^[a-zA-Z0-9_-]{4,95}$/;
const MAX=2*1024*1024*1024;
const fail=m=>{throw new Error('DENY: '+m)};
function archiveUrl(u) {
 if(typeof u!=='string'||u.length>2000||/%2e|%2f|%5c|%00/i.test(u)||u.includes('\\')||/\/\.\.?(\/|$)/.test(u))return false;
 try{const v=new URL(u);return v.protocol==='https:'&&v.host==='app.notion.com'&&!v.username&&!v.password&&!v.search&&!v.hash&&/^\/p\/[0-9a-f]{32}$/.test(v.pathname)}catch{return false}
}
async function openFile(path) {
 if(typeof path!=='string'||!path.startsWith('/')||path.includes('\0'))fail('absolute regular file required');
 const handle=await fs.open(path,constants.O_RDONLY|(constants.O_NOFOLLOW??0));
 try{const stat=await handle.stat();if(!stat.isFile()||stat.size<1||stat.size>MAX)fail('size/type');return {handle,stat};}
 catch(e){await handle.close();throw e;}
}
async function digest(file) {
 const h=createHash('sha256');let n=0;
 for await(const b of file.handle.createReadStream({autoClose:false,highWaterMark:262144})){
   n+=b.length;if(n>MAX)fail('too large');h.update(b);
 }
 return {bytes:n,sha256:h.digest('hex')};
}
export async function admitCompletedVideo({manifest,provider,originalPath,archivePath,archivePageUrl,filename,worker}) {
 summarizeFounderCustody(manifest);
 if(!provider||typeof provider!=='object'||Array.isArray(provider)||provider.status!=='completed'||
   !VID.test(provider.videoId||'')||provider.videoPageUrl!=='https://app.heygen.com/videos/'+provider.videoId||
   !Number.isSafeInteger(provider.completedAt)||provider.completedAt<1||
   typeof provider.title!=='string'||provider.title.trim().length<2||provider.title.length>180)fail('provider completion receipt');
 if(!archiveUrl(archivePageUrl)||!FILE.test(filename||'')||!WORKER.test(worker||''))fail('archive metadata');
 if(manifest.items.some(x=>x.kind==='video'&&x.archiveUrl!==archivePageUrl))fail('different archive owner');
 let original,archived;
 try {
  original=await openFile(originalPath);archived=await openFile(archivePath);
  if(original.stat.dev===archived.stat.dev&&original.stat.ino===archived.stat.ino)fail('same original and archive file');
  const [a,b]=await Promise.all([digest(original),digest(archived)]);
  if(a.bytes!==original.stat.size||b.bytes!==archived.stat.size)fail('changed while streaming');
  if(a.bytes!==b.bytes||a.sha256!==b.sha256)fail('source and archive bytes differ');
  const id='heygen:'+provider.videoId;
  const entry={id,kind:'video',name:provider.title.trim(),filename,bytes:a.bytes,sha256:a.sha256,
    originalRecordUrl:provider.videoPageUrl,archiveUrl:archivePageUrl,
    verificationState:'SOURCE_AND_ARCHIVE_SHA_MATCH',
    verificationMethod:'offline-two-file-stream-sha256',verificationWorker:worker,
    humanReview:'PENDING',founderAcknowledged:false};
  const old=manifest.items.find(x=>x.id===id);
  if(old){
   if(old.kind!=='video'||old.sha256!==entry.sha256||old.bytes!==entry.bytes||
     old.originalRecordUrl!==entry.originalRecordUrl||old.archiveUrl!==entry.archiveUrl)fail('ID collision');
   return {manifest,receipt:{id,status:'RECHECKED_UNCHANGED',sha256:a.sha256,bytes:a.bytes,
     contentVerifiedByThisRun:true,founderAcknowledged:false,newRecord:false}};
  }
  const updated={...manifest,items:[...manifest.items,entry]};
  summarizeFounderCustody(updated);
  return {manifest:updated,receipt:{id,status:'ARCHIVED_BYTES_VERIFIED',sha256:a.sha256,bytes:a.bytes,
    contentVerifiedByThisRun:true,founderAcknowledged:false,newRecord:true}};
 }finally{
  await Promise.allSettled([original?.handle.close(),archived?.handle.close()].filter(Boolean));
 }
}
