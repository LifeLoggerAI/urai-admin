
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Define the structure of the constitution for type safety
interface RoleDefinition {
  [capability: string]: boolean;
}

interface Constitution {
  governanceVersion: string;
  roles: {
    [roleName: string]: RoleDefinition;
  };
}

let constitution: Constitution | null = null;

/**
 * Loads the governance constitution from the root of the monorepo.
 * It caches the constitution in memory to avoid repeated file reads.
 * @returns The parsed governance constitution.
 */
function getConstitution(): Constitution {
  if (constitution) {
    return constitution;
  }
  const constitutionPath = path.resolve(process.cwd(), 'governance_constitution.json');
  if (!fs.existsSync(constitutionPath)) {
    throw new Error('[Governance] Constitution file not found at root.');
  }
  const fileContent = fs.readFileSync(constitutionPath, 'utf-8');
  constitution = JSON.parse(fileContent) as Constitution;
  return constitution;
}

/**
 * Verifies the integrity of the constitution file at boot time.
 * It compares the hash of the current file against a committed hash,
 * preventing unauthorized changes to the governance model.
 */
export function verifyConstitution(): void {
  const constitutionPath = path.resolve(process.cwd(), 'governance_constitution.json');
  const expectedHashPath = path.resolve(process.cwd(), 'GOVERNANCE_HASH.txt');

  if (!fs.existsSync(expectedHashPath)) {
    throw new Error('[Governance] GOVERNANCE_HASH.txt not found. The constitution is not sealed.');
  }

  const expectedHash = fs.readFileSync(expectedHashPath, 'utf-8').trim();
  const fileContent = fs.readFileSync(constitutionPath, 'utf-8');
  const currentHash = crypto.createHash('sha256').update(fileContent).digest('hex');

  if (currentHash !== expectedHash) {
    throw new Error(
      '[Governance] Tampering detected! The governance constitution does not match the sealed hash. Halting system.'
    );
  }
  console.log('[Governance] Constitution integrity verified.');
}

/**
 * Asserts that a given role has a specific capability.
 * This is the core runtime check for all permissioned actions.
 * It throws an error if the capability is not granted.
 * @param role The role of the actor.
 * @param capability The capability being asserted (e.g., "canModifySystemConfig").
 */
export function assertCapability(role: string, capability: string): void {
  const constDef = getConstitution();
  const roleDef = constDef.roles[role];

  if (!roleDef || !roleDef[capability]) {
    throw new Error(`[Governance] Role '${role}' lacks required capability '${capability}'. Access denied.`);
  }
}
