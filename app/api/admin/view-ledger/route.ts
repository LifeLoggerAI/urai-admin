
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import crypto from 'crypto';

// In a real-world scenario, this endpoint would be protected by robust administrative authentication.

function verifyHashChain(events: any[]) {
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const previousHash = i === 0 ? "GENESIS" : events[i - 1].hash;
    
    const expectedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(event.data) + previousHash)
      .digest('hex');

    if (event.hash !== expectedHash) {
      return { isValid: false, errorAtIndex: i };
    }
  }
  return { isValid: true };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ledgerName = searchParams.get('name');

  const ALLOWED_LEDGERS = new Set(['admin_log', 'incident_ledger', 'federation_events']);

  if (!ledgerName || !ALLOWED_LEDGERS.has(ledgerName)) {
    return NextResponse.json({ error: `Invalid or missing 'name' parameter. Allowed values: ${[...ALLOWED_LEDGERS].join(', ')}` }, { status: 400 });
  }

  try {
    // Retrieve all events from the specified ledger, ordered by timestamp
    const ledgerSnapshot = await db.collection(ledgerName).orderBy("timestamp", "asc").get();
    const events = ledgerSnapshot.docs.map(doc => doc.data());

    // Verify the integrity of the hash chain
    const { isValid, errorAtIndex } = verifyHashChain(events);

    return NextResponse.json({
      ledger: ledgerName,
      count: events.length,
      isChainValid: isValid,
      ...(errorAtIndex !== undefined && { errorAtIndex }), // Only include if chain is invalid
      events: events,
    });

  } catch (err: any) {
    console.error(`Error reading ledger '${ledgerName}':`, err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
