
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

function generateHash() {
  console.log('🔐 Generating governance constitution hash...');

  const constitutionPath = path.resolve(process.cwd(), 'governance_constitution.json');
  const hashPath = path.resolve(process.cwd(), 'GOVERNANCE_HASH.txt');

  if (!fs.existsSync(constitutionPath)) {
    console.error('🚨 Error: governance_constitution.json not found!');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(constitutionPath, 'utf-8');
  const hash = crypto.createHash('sha256').update(fileContent).digest('hex');

  fs.writeFileSync(hashPath, hash);

  console.log(`✅ Governance hash created: ${hash}`);
  console.log(`✅ Saved to ${hashPath}`);
}

generateHash();
