
import { db } from "@/lib/firebaseAdmin";

// Defines the structure for the system's core governance state.
export interface GovernanceState {
  governanceVersion: string;
  governanceHash: string;
  freezeState: boolean;
  federationProtocolVersion: string;
}

/**
 * Retrieves the definitive governance state of the sovereign authority.
 * This includes the current constitution version, its hash, and the operational
 * freeze state of the system.
 * 
 * @returns {Promise<GovernanceState>} A promise that resolves to the governance state.
 */
export async function getGovernanceState(): Promise<GovernanceState> {
  // Fetch the operational state (e.g., is the system frozen?)
  const stateDoc = await db.collection("sovereign").doc("state").get();
  const stateData = stateDoc.data() || { frozen: false };

  // Fetch the current constitution details
  const constitutionDoc = await db.collection("sovereign").doc("constitution").get();
  const constitutionData = constitutionDoc.data() || { version: "1.0.0", hash: "GENESIS" };

  return {
    freezeState: stateData.frozen,
    governanceVersion: constitutionData.version,
    governanceHash: constitutionData.hash,
    federationProtocolVersion: "1.0.0", // The version of the federation API protocol itself
  };
}
