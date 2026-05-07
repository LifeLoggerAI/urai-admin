#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

###############################################################################
# URAI-ADMIN ULTRA-POLISH + REGRESSION QA DEPLOY
# Adam Clamp — Full deploy + UX + animations + hover/focus + link check
# + regression comparison vs previous deploy + PDF report
###############################################################################

PROJECT_NAME="urai-admin"
TAG="v1.0.0-urai-admin-regression"
LOG_DIR="$HOME/deploy_logs"
SCREENSHOT_DIR="$HOME/deploy_screenshots/${PROJECT_NAME}_$TAG"
PREV_SCREENSHOT_DIR="$HOME/deploy_screenshots/${PROJECT_NAME}_$(cat $LOG_DIR/urai-admin_last_tag.txt 2>/dev/null || echo 'v1.0.0-urai-admin-regression')"
REPORT_DIR="$HOME/deploy_reports"
PREV_SNAPSHOT="$LOG_DIR/urai-admin_last_snapshot.json"
CURR_SNAPSHOT="$LOG_DIR/urai-admin_curr_snapshot_${TAG}.json"
PDF_REPORT="$REPORT_DIR/${PROJECT_NAME}_QA_${TAG}.pdf"
TIMESTAMP=$(date -u +%Y%m%d_%H%M%S)

mkdir -p "$LOG_DIR" "$SCREENSHOT_DIR" "$REPORT_DIR"
LOG_FILE="$LOG_DIR/${PROJECT_NAME}_deploy_${TIMESTAMP}.log"

echo "Starting URAI-ADMIN ULTRA-REGRESSION deploy at $TIMESTAMP" | tee -a "$LOG_FILE"

# -----------------------------
# Step 0: Pull latest code
# -----------------------------
git fetch --all --prune
git checkout main
git pull origin main | tee -a "$LOG_FILE"

# -----------------------------
# Step 1: Install Dependencies
# -----------------------------
pnpm install | tee -a "$LOG_FILE"
pnpm install pdfkit pixelmatch pngjs | tee -a "$LOG_FILE"


# -----------------------------
# Step 2: Lint & Typecheck
# -----------------------------
pnpm -r run lint | tee -a "$LOG_FILE"
pnpm -r run typecheck | tee -a "$LOG_FILE"

# -----------------------------
# Step 3: Run all tests
# -----------------------------
pnpm -r run test | tee -a "$LOG_FILE"
pnpm -r run e2e | tee -a "$LOG_FILE"

# -----------------------------
# Step 4: Build project
# -----------------------------
pnpm -r run build | tee -a "$LOG_FILE"

# -----------------------------
# Step 5: Firebase deploy
# -----------------------------
firebase deploy --project "$PROJECT_NAME" --only hosting | tee -a "$LOG_FILE"

# -----------------------------
# Step 6: Tag final version
# -----------------------------
echo "Step 6: Tagging final polished version..." | tee -a "$LOG_FILE"
git tag -f "$TAG"
git push origin "$TAG" --force | tee -a "$LOG_FILE"
echo "$TAG" > "$LOG_DIR/urai-admin_last_tag.txt"


# -----------------------------
# Step 7: Playwright UX audit + regression
# -----------------------------
pnpm exec playwright install --with-deps | tee -a "$LOG_FILE"

pnpm exec node <<'EOF'
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');
const PDFDocument = require('pdfkit');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const PROJECT_NAME = "urai-admin";
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR;
const PREV_SCREENSHOT_DIR = process.env.PREV_SCREENSHOT_DIR;
const DIFF_DIR = `${process.env.HOME}/deploy_diffs/${PROJECT_NAME}_${process.env.TAG}`;
const LOG_FILE = process.env.LOG_FILE;
const PDF_REPORT = process.env.PDF_REPORT;
const PREV_SNAPSHOT_FILE = process.env.PREV_SNAPSHOT;
const CURR_SNAPSHOT_FILE = process.env.CURR_SNAPSHOT;
const BASE_URL = `https://${PROJECT_NAME}.web.app`;

function log(msg){ console.log(msg); fs.appendFileSync(LOG_FILE, msg+"\n"); }

function hashFile(filePath){
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

(async()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      log(`CONSOLE ERROR: ${msg.text()}`);
      consoleErrors.push(msg.text());
    }
  });

  const startPages = ["/", "/dashboard", "/settings", "/logs", "/users"];
  const visited = new Set();
  const brokenLinks = [];
  const screenshots = {};

  // Load previous snapshot if exists
  let prevSnapshot = { links:{}, console:[], screenshots:{} };
  if(fs.existsSync(PREV_SNAPSHOT_FILE)){
    prevSnapshot = JSON.parse(fs.readFileSync(PREV_SNAPSHOT_FILE,'utf-8'));
  }

  async function visit(urlPath){
    const fullUrl = BASE_URL + urlPath;
    if(visited.has(fullUrl)) return;
    visited.add(fullUrl);

    let resp;
    try { resp = await page.goto(fullUrl,{waitUntil:'networkidle'}); } 
    catch(e){ log(`NAVIGATION ERROR: ${fullUrl} - ${e.message}`); brokenLinks.push({url:fullUrl,status:'NAV_ERR'}); return; }

    if(!resp.ok()){
      log(`HTTP ERROR: ${resp.status()} ${fullUrl}`);
      brokenLinks.push({url:fullUrl,status:resp.status()});
    } else {
      log(`Visited: ${fullUrl}`);
    }

    // Normal screenshot
    const safeUrlPath = urlPath.replace(/\//g, '_');
    const normalPath = path.join(SCREENSHOT_DIR,`${safeUrlPath}_normal.png`);
    await page.screenshot({ path: normalPath, fullPage:true });
    screenshots[`${urlPath}_normal`] = hashFile(normalPath);

    // Hover/focus snapshots
    const interactables = await page.$$('button,a,[role="button"]');
    for(let i=0;i<interactables.length;i++){
      const boundingBox = await interactables[i].boundingBox();
      if (!boundingBox) continue;
      
      try{
        await interactables[i].hover(); await page.waitForTimeout(200);
        const hoverPath = path.join(SCREENSHOT_DIR,`${safeUrlPath}_hover_${i}.png`);
        await page.screenshot({path:hoverPath, clip: boundingBox});
        screenshots[`${urlPath}_hover_${i}`] = hashFile(hoverPath);

        await interactables[i].focus(); await page.waitForTimeout(100);
        const focusPath = path.join(SCREENSHOT_DIR,`${safeUrlPath}_focus_${i}.png`);
        await page.screenshot({path:focusPath, clip: boundingBox});
        screenshots[`${urlPath}_focus_${i}`] = hashFile(focusPath);
      } catch(e){ log(`Hover/focus error ${i} on ${fullUrl}: ${e.message}`); }
    }

    // Rive/Lottie animations
    const animElements = await page.$$('[data-rive],[data-lottie]');
    for(let j=0;j<animElements.length;j++){
      const boundingBox = await animElements[j].boundingBox();
      if (!boundingBox) continue;

      try{
        await animElements[j].scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const animPath = path.join(SCREENSHOT_DIR,`${safeUrlPath}_anim_${j}.png`);
        await page.screenshot({path:animPath, clip: boundingBox});
        screenshots[`${urlPath}_anim_${j}`] = hashFile(animPath);
      } catch(e){ log(`Animation error ${j} on ${fullUrl}: ${e.message}`); }
    }

    // Internal link crawl
    const links = await page.$$eval('a[href]', as => as.map(a=>a.getAttribute('href')).filter(h=>h&&h.startsWith('/')));
    for(const link of links) await visit(link);
  }

  for(const pagePath of startPages) await visit(pagePath);
  await browser.close();

  // Save current snapshot
  const currSnapshot = { links: {}, console: consoleErrors, screenshots };
  visited.forEach(url => {
    if (!brokenLinks.some(l => l.url === url)) {
      currSnapshot.links[url] = 200;
    }
  });
  brokenLinks.forEach(b=>currSnapshot.links[b.url]=b.status);
  fs.writeFileSync(CURR_SNAPSHOT_FILE, JSON.stringify(currSnapshot,null,2));

  // Compare with previous snapshot
  const regressedLinks = [];
  const fixedLinks = [];
  const newBrokenLinks = [];

  for(const url in currSnapshot.links){
    const status = currSnapshot.links[url];
    const prevStatus = prevSnapshot.links[url];

    if(status !== 200 && prevStatus === 200) {
        regressedLinks.push({url, status});
    } else if (status === 200 && prevStatus && prevStatus !== 200) {
        fixedLinks.push({url, status});
    } else if (status !== 200 && !prevStatus) {
        newBrokenLinks.push({url, status});
    }
  }

  // Visual diff of screenshots
  fs.mkdirSync(DIFF_DIR, { recursive: true });
  const regressedScreenshots = [];

  for(const key in screenshots){
    if(prevSnapshot.screenshots[key] && prevSnapshot.screenshots[key]!==screenshots[key]){
      const safeKey = key.replace(/\//g, '_');
      const prevPath = path.join(PREV_SCREENSHOT_DIR, `${safeKey}.png`);
      const currPath = path.join(SCREENSHOT_DIR, `${safeKey}.png`);
      
      if(fs.existsSync(prevPath) && fs.existsSync(currPath)){
        const img1 = PNG.sync.read(fs.readFileSync(prevPath));
        const img2 = PNG.sync.read(fs.readFileSync(currPath));
        const {width,height} = img1;
        const diff = new PNG({width,height});

        const diffPixels = pixelmatch(img1.data,img2.data,diff.data,width,height,{threshold:0.1});
        if(diffPixels>0){
          const diffPath = path.join(DIFF_DIR,`${safeKey}_diff.png`);
          fs.writeFileSync(diffPath, PNG.sync.write(diff));
          regressedScreenshots.push({key, diffPath, prevPath, currPath});
        }
      }
    }
  }

  // -----------------------------
  // Generate PDF report
  // -----------------------------
  const doc = new PDFDocument({autoFirstPage:false, layout: 'portrait', size: 'A4'});
  doc.pipe(fs.createWriteStream(PDF_REPORT));

  doc.addPage();
  doc.fontSize(20).text('URAI-ADMIN QA REPORT',{align:'center'});
  doc.moveDown();
  doc.fontSize(12).text(`Tag: ${process.env.TAG || 'N/A'}`);
  doc.text(`Date: ${new Date().toUTCString()}`);
  doc.moveDown();

  // Links
  doc.addPage().fontSize(16).text('Broken/Internal Link Regression',{underline:true}).moveDown();
  if(regressedLinks.length) {
    doc.fontSize(12).fillColor('red').text('Regressed Links:').moveDown();
    regressedLinks.forEach(l=>doc.text(`${l.status} → ${l.url}`).moveDown());
  }
  if(fixedLinks.length) {
    doc.fillColor('green').text('Fixed Links:').moveDown();
    fixedLinks.forEach(l=>doc.text(`${l.status} → ${l.url}`).moveDown());
  }
  if(newBrokenLinks.length) {
    doc.fillColor('orange').text('New Broken Links:').moveDown();
    newBrokenLinks.forEach(l=>doc.text(`${l.status} → ${l.url}`).moveDown());
  }

  // Console Errors
  if (consoleErrors.length > 0) {
    doc.addPage().fontSize(16).text('Console Errors',{underline:true}).moveDown();
    consoleErrors.forEach(error => {
        doc.fontSize(10).fillColor('black').text(error).moveDown();
    });
  }


  // Visual diff
  for(const r of regressedScreenshots){
    doc.addPage();
    doc.fontSize(12).text(`Regression: ${r.key}`, {align:'center'}).moveDown();
    
    doc.image(r.prevPath, {width: 250, align:'left'});
    doc.image(r.currPath, {width: 250, align: 'right'});
    doc.moveDown();
    doc.image(r.diffPath, {fit:[500, 400], align:'center'});
  }

  doc.end();
  log(`PDF QA report with visual diffs generated: ${PDF_REPORT}`);

  // Update previous snapshot
  fs.copyFileSync(CURR_SNAPSHOT_FILE, PREV_SNAPSHOT_FILE);

})();
EOF

echo "------------------------------------------" | tee -a "$LOG_FILE"
echo "ULTRA-REGRESSION + VISUAL DIFF URAI-ADMIN deploy COMPLETE!" | tee -a "$LOG_FILE"
echo "Screenshots: $SCREENSHOT_DIR" | tee -a "$LOG_FILE"
echo "Diffs: $HOME/deploy_diffs/${PROJECT_NAME}_$TAG" | tee -a "$LOG_FILE"
echo "PDF QA report: $PDF_REPORT" | tee -a "$LOG_FILE"
echo "Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "Access app: https://${PROJECT_NAME}.web.app/" | tee -a "$LOG_FILE"
echo "------------------------------------------" | tee -a "$LOG_FILE"
