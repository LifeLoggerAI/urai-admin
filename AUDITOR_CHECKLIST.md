URAI Admin — Auditor Verification Checklist
Export name / ID: ____________________________
Verification date (UTC): _____________________
Verifier operator (name): ____________________
Machine / environment: _______________________

0) Files present (export-level sanity)
 I can open the archive without errors.

 index/index.csv exists.

 index/index.json exists.

 top/top.manifest.json exists.

 chains/itemChain.json exists.

Optional (may not exist):

 top/top.manifest.sig exists (signature enabled).

1) Export-level manifest integrity (structure + omission detection)
Open: top/top.manifest.json

 version is present and expected (e.g., dataroom-v1).

 exportId, env, createdAt are present.

 items[] is non-empty.

Hash chain checks (manual)
For items in order:

 Item[0] has prevItemHash empty/null or a documented genesis value.

 For each Item[i>0], prevItemHash equals Item[i-1].itemHash.

 No duplicate bundleId values.

 Item ordering is consistent with index (createdAt then bundleId).

Result:

 Export chain appears internally consistent (no obvious omissions based on prevItemHash linking).

Optional (signature enabled):

 If top/top.manifest.sig exists, I verified the signature using the provided public key tooling.

Method used: ______________________

Signature result: PASS / FAIL

2) Index cross-check (export inventory)
Open: index/index.csv

 Columns include at least:

bundleId, env, createdAt, bundleSha256, bundleManifestSha256

 Number of rows matches items.length in top.manifest.json (or is explainably different per documented selection rules).

 For at least 3 random rows, I confirmed the bundleId folder exists in items/<bundleId>/.

Sampling method (e.g., every Nth row): ______________________

3) Per-item verification (cryptographic checks)
Pick a sample size:

Recommended: 10% of items or min(10, total items), plus any “high/critical” labeled items.

Sampled bundle IDs:

For each sampled bundleId, locate: items/<bundleId>/

3A) Determine package type
 Verifier Pack present (preferred), OR

 Compliance Bundle present (bundle.zip + bundle.json + optional sig + public key)

Record:

Type: Verifier Pack / Compliance Bundle

Paths: ___________________________________________

4) Offline verification execution (authoritative)
If Verifier Pack
Inside the pack, follow RUN_ME.txt.

For each sampled bundle:

 I ran the verifier command.

 Exit code indicates PASS (0).

Record verifier output summary:

Bundle ID: __________________________

manifestOk: PASS / FAIL

zipHashOk: PASS / FAIL

signatureOk: PASS / FAIL / N/A

perFileOk: PASS / FAIL / N/A

overallOk: PASS / FAIL

Reported:

bundleSha256: ____________________________________

bundleManifestSha256: _____________________________

Repeat for each sampled bundle.

If Compliance Bundle (no verifier included)
 I used the standalone verifier CLI (provided separately) against:

bundle.json

bundle.zip

bundle.sig (if present)

bundle.publicKey.pem

 overallOk = PASS

5) Receipt cross-check (optional but recommended)
If receipt artifacts exist (receipt.json / QR receipt):

 receipt.json exists.

 receipt.bundleSha256 == bundle.json.bundleSha256

 receipt.bundleManifestSha256 == bundle.json.bundleManifestSha256

Record receiptSha256 (if present): ______________________

6) Paper Trail PDF and Proof Card checks (informational)
If included:

 attestation.pdf exists (Paper Trail)

 proofcard.png exists (Proof Summary Card)

Important:

 I understand these are summaries and do not replace offline verification.

Optional:

 Hash of attestation.pdf matches value recorded in bundle manifests (if listed).

7) Exceptions and failures
If any FAIL:

Bundle ID: __________________________

Failing check: manifestOk / zipHashOk / signatureOk / perFileOk

Error message excerpt: ____________________________________________

Action taken:

 Stopped verification and escalated

 Requested re-export

 Requested missing public key/signature material

8) Final conclusion
 Export-level structure appears consistent.

 Sampled bundles verified offline with PASS.

 No unexplained mismatches between index and top manifest.

 Any exceptions are documented above.

Final result: PASS / FAIL / PASS WITH EXCEPTIONS

Auditor signature: __________________________
Date (UTC): _________________________________
