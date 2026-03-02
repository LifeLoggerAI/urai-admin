
import { getCentralFirestore } from '../core/config';

// A cached representation of the global system state
let systemState: { mode: string } | null = null;

/**
 * Fetches the current global system state from the central authority.
 * Caches the state to reduce reads for subsequent checks within the same runtime instance.
 * @returns The global system state document.
 */
async function getSystemState(): Promise<{ mode: string }> {
  if (systemState) {
    return systemState;
  }

  const firestore = getCentralFirestore();
  const snapshot = await firestore.collection('system_state').doc('global').get();

  if (!snapshot.exists) {
    // If the state doc doesn't exist, it's a critical configuration error.
    throw new Error('[Governance] Global system state document not found in central authority.');
  }

  systemState = snapshot.data() as { mode: string };
  return systemState;
}

/**
 * Asserts that the system is in a writable state.
 * It checks for global locks like NUCLEAR_LOCK.
 * This function must be called before any mutation is performed.
 * It will throw an error if the system is not writable, halting the operation.
 */
export async function assertSystemWritable(): Promise<void> {
  const state = await getSystemState();

  if (state.mode === 'NUCLEAR_LOCK') {
    throw new Error(
      '[Governance] Operation halted. The system is currently in a founder-initiated NUCLEAR_LOCK state.'
    );
  }

  // Add other state checks here, e.g., for a general 'FROZEN' state.
}

/**
 * Checks if the system is currently in a nuclear lock state.
 * @returns True if the system is in nuclear lock, false otherwise.
 */
export async function isNuclearLockActive(): Promise<boolean> {
  const state = await getSystemState();
  return state.mode === 'NUCLEAR_LOCK';
}
