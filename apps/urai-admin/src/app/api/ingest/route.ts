import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// URAI Analytics owns event ingestion. This legacy Admin endpoint previously
// accepted unauthenticated writes into a parallel local schema. Keep the route
// only as an explicit fail-closed compatibility tombstone so old callers cannot
// silently create analytics authority outside LifeLoggerAI/urai-analytics.
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      status: 'gone',
      authority: 'urai-analytics',
      error: 'Legacy URAI Admin analytics ingestion is disabled.',
      migrationTarget: 'URAI Analytics signed /api/v1/signals:ingest contract',
    },
    {
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
        Deprecation: 'true',
      },
    },
  );
}
