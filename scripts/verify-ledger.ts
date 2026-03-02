'''
import { verifyLedgerIntegrity } from "@/lib/federation/hashChain";

async function runVerification() {
  console.log("Running ledger integrity verification...");
  try {
    await verifyLedgerIntegrity("federation_events");
    console.log("✅ LEDGER INTEGRITY VERIFIED. This is a failure of the audit test.");
  } catch (error: any) {
    if (error.message === "LEDGER_TAMPER_DETECTED") {
      console.log("🔥 SUCCESS: LEDGER_TAMPER_DETECTED. The system correctly identified the unauthorized modification.");
    } else {
      console.error("❌ VERIFICATION FAILED WITH UNEXPECTED ERROR:", error.message);
    }
  }
}

runVerification();
'''