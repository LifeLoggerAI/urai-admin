#!/usr/bin/env node
/**
 * R1657: static founder-facing HTML snapshot from an authorized private custody
 * export. NOT a live inbox, downloader, approval system, or hosted service.
 */
import {readFileSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {summarizeFounderCustody} from './founder-custody-manifest.mjs';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function bytesText(n) {
  return n >= 1e6 ? (n/1e6).toFixed(2)+' MB' : (n/1000).toFixed(1)+' KB';
}
const statusNames = {
  SOURCE_AND_ARCHIVE_SHA_MATCH: 'Source + archive hash matched',
  CHECKED_FINITE_PROOF: 'Finite proof checked locally',
  PRESERVED_SOURCE_WITH_SHA256: 'Source preserved with hash'
};
const kindNames = {video:'Video', 'math-proof':'Math', screenshot:'Visual'};
export function renderFounderInbox(manifest) {
  const report = summarizeFounderCustody(manifest);
  const items = [...manifest.items].sort((a,b)=>a.id.localeCompare(b.id));
  const cards = items.map((item) => {
    const kind = kindNames[item.kind];
    const state = statusNames[item.verificationState];
    const tags = escapeHtml((item.name+' '+item.filename+' '+item.id+' '+kind).toLowerCase());
    const kindClass = item.kind==='video'?'video':item.kind==='math-proof'?'math':'visual';
    return [
      '<article class="artifact" data-kind="',kindClass,'" data-search="',tags,'">',
        '<div class="card-header"><span class="type">',escapeHtml(kind),'</span>',
        '<span class="pending">Review pending</span></div>',
        '<h3>',escapeHtml(item.name),'</h3>',
        '<p class="filename">',escapeHtml(item.filename),'</p>',
        '<div class="mini"><span>',bytesText(item.bytes),'</span><span>',escapeHtml(state),'</span></div>',
        '<div class="digest"><span>SHA-256</span><code>',escapeHtml(item.sha256),'</code></div>',
        '<div class="actions">',
          '<a class="button primary" target="_blank" rel="noopener noreferrer" href="',escapeHtml(item.archiveUrl),'">Open archived original</a>',
          '<a class="button secondary" target="_blank" rel="noopener noreferrer" href="',escapeHtml(item.originalRecordUrl),'">Source record</a>',
        '</div>',
      '</article>'
    ].join('');
  }).join('');
  const css = [
    ':root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#edf3fa;background:#07101d;color-scheme:dark}',
    '*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 20% -10%,#1e3b56 0%,transparent 45%),linear-gradient(150deg,#081322,#0b1825 60%,#07101d);}',
    '.shell{max-width:1120px;margin:auto;padding:30px 24px 70px}.eyebrow{text-transform:uppercase;font-size:11px;letter-spacing:2px;color:#deb978;font-weight:800}',
    'h1{font-size:clamp(32px,5.5vw,62px);letter-spacing:-.05em;line-height:1.03;margin:16px 0 13px}h1 span{color:#dfc396}',
    '.intro{color:#afc0d3;line-height:1.65;max-width:680px;font-size:15px;margin-bottom:20px}',
    '.banner{border:1px solid #49617b;border-radius:14px;background:#142a3c;padding:14px 18px;color:#e6eef6;font-size:13px;line-height:1.6}',
    '.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px;margin:27px 0}',
    '.metric{background:#132336;border:1px solid #27415d;border-radius:16px;padding:19px 20px}.num{font-weight:800;font-size:27px;letter-spacing:-.05em;color:#f8f2e7}.metric p{margin:4px 0 0;font-size:12px;color:#b3c1cf}',
    '.controls{display:flex;flex-wrap:wrap;gap:13px;align-items:center;justify-content:space-between;margin:24px 0 17px}',
    '.filters{display:flex;gap:7px;flex-wrap:wrap}.filter{background:#132439;color:#c6d7e6;border:1px solid #2b4462;border-radius:8px;padding:11px 15px;font-size:13px;cursor:pointer;min-height:44px}',
    '.filter[aria-pressed="true"]{border-color:#dfc396;background:#384031;color:#fff}.search{border:1px solid #37506e;background:#101f30;border-radius:10px;color:#fff;padding:12px 13px;min-width:min(100%,270px);min-height:44px}',
    '.search::placeholder{color:#96a9bd}.count{font-size:12px;color:#94abc0;margin:12px 0 15px}',
    '.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.artifact{background:#102033;border:1px solid #2b4159;border-radius:16px;padding:20px;min-width:0}',
    '.artifact[hidden]{display:none}.card-header{display:flex;justify-content:space-between;align-items:center;gap:8px}.type{font-size:11px;color:#dfc396;font-weight:800;letter-spacing:.09em;text-transform:uppercase}',
    '.pending{font-size:11px;color:#c9d3dc;border:1px solid #506074;border-radius:16px;padding:5px 8px}.artifact h3{margin:17px 0 7px;font-size:19px;line-height:1.35;letter-spacing:-.02em}',
    '.filename{font-size:12px;color:#90a7bd;word-break:break-word;min-height:18px;margin:0 0 17px}.mini{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;font-size:12px;color:#a4dccb}',
    '.mini span:first-child{color:#c6d8e9}.digest{margin:17px 0 19px;padding:11px 12px;border-radius:8px;border:1px solid #263d56;background:#0b1727}',
    '.digest span{display:block;color:#91a9bf;font-size:10px;letter-spacing:.04em;margin-bottom:7px}.digest code{font:10px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;color:#c7dce9;overflow-wrap:anywhere}',
    '.actions{display:flex;gap:9px;flex-wrap:wrap}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;font-size:12px;font-weight:700;text-decoration:none;border-radius:9px;flex:1 1 150px}',
    '.primary{color:#101c2b;background:#e6ca9a}.secondary{color:#deebf9;border:1px solid #3d5874;background:#172b42}',
    'a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #f8d496;outline-offset:3px}',
    '.foot{margin:30px 0 0;color:#8da6bc;font-size:12px;line-height:1.75;border-top:1px solid #2c4056;padding-top:18px}',
    '@media(max-width:760px){.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.cards{grid-template-columns:1fr}.shell{padding:22px 16px 55px}.controls{align-items:stretch;flex-direction:column}.search{width:100%}}',
    '@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition:none!important}}'
  ].join('');
  const script = [
    '(function(){',
    'const buttons=Array.from(document.querySelectorAll(".filter"));',
    'const cards=Array.from(document.querySelectorAll(".artifact"));',
    'const search=document.getElementById("search");',
    'const count=document.getElementById("count");',
    'let active="all";',
    'function update(){const q=search.value.toLowerCase().trim();let shown=0;',
    'cards.forEach(card=>{const match=(active==="all"||card.dataset.kind===active)&&(!q||card.dataset.search.includes(q));card.hidden=!match;if(match)shown++;});',
    'count.textContent=shown+" of "+cards.length+" original artifacts shown";}',
    'buttons.forEach(button=>button.addEventListener("click",()=>{active=button.dataset.filter;buttons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));update();}));',
    'search.addEventListener("input",update);update();',
    '})();'
  ].join('');
  const summary = [
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="referrer" content="no-referrer"><title>ONE URAI — Founder Deliverables</title>',
    '<style>',css,'</style></head><body><main class="shell">',
    '<p class="eyebrow">ONE URAI GENESIS · ARCHIVED EVIDENCE</p><h1>Founder <span>Deliverables</span></h1>',
    '<p class="intro">Real files from our workers, with the original source, recorded SHA-256 and a direct archive link. This view is a read-only snapshot—not a live worker dispatch system.</p>',
    '<div class="banner" role="status"><strong>11 original artifacts preserved.</strong> Eight video originals were compared byte-for-byte with their private archive copies. One finite math certificate was checked locally; two screenshots were preserved with source hashes. <strong>Founder approval and independent reviews remain pending.</strong> No automatic ingestion or release authorization.</div>',
    '<section class="metrics" aria-label="Artifact totals">',
      '<div class="metric"><div class="num">',String(report.itemCount),'</div><p>Original files</p></div>',
      '<div class="metric"><div class="num">',String(report.videoCount),'</div><p>Verified video files</p></div>',
      '<div class="metric"><div class="num">',String(items.filter(x=>x.kind==='math-proof').length),'</div><p>Math certificate</p></div>',
      '<div class="metric"><div class="num">',String(items.filter(x=>x.kind==='screenshot').length),'</div><p>Visual screenshots</p></div>',
    '</section>',
    '<div class="controls"><div class="filters" role="group" aria-label="Filter artifact types">',
      '<button class="filter" data-filter="all" aria-pressed="true">All</button>',
      '<button class="filter" data-filter="video" aria-pressed="false">Videos</button>',
      '<button class="filter" data-filter="math" aria-pressed="false">Math</button>',
      '<button class="filter" data-filter="visual" aria-pressed="false">Visuals</button>',
      '</div><input id="search" class="search" type="search" aria-label="Search artifacts" placeholder="Search worker files…"></div>',
    '<p id="count" class="count" aria-live="polite">',String(items.length),' of ',String(items.length),' original artifacts shown</p>',
    '<section class="cards" aria-label="Archived artifact list">',cards,'</section>',
    '<footer class="foot">Source: private R1656 custody manifest, Labs draft PR #487. This saved view does not query providers, download new files, remember approvals, change access or notify automatically. File links require access to their respective private accounts. Product launch HOLD / NO-GO; private-memory writes OFF. Last reconciled November 21, 2026 UTC.</footer>',
    '</main><script>',script,'</script></body></html>'
  ];
  return summary.join('');
}
if(process.argv[1] && fileURLToPath(import.meta.url)===process.argv[1]) {
  try {
    if(process.argv.length!==3) throw Error('usage: node scripts/render-founder-inbox-html.mjs AUTHORIZED_MANIFEST.json');
    const stat=statSync(process.argv[2]);
    if(!stat.isFile()||stat.size===0||stat.size>1048576) throw Error('DENY: invalid manifest file size');
    const manifest=JSON.parse(readFileSync(process.argv[2],'utf8'));
    process.stdout.write(renderFounderInbox(manifest));
  } catch(error) {
    process.stderr.write('Founder HTML render DENIED: '+String(error.message)+'\n');
    process.exitCode=2;
  }
}
