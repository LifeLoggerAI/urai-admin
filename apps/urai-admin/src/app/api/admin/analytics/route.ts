import { NextRequest, NextResponse } from 'next/server';

import { adminAuthErrorResponse, requireAdminSession } from '@/lib/admin/require-admin-session';
import { firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

function isValidDateString(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function getAnalyticsDate(dateParam: string | null) {
  if (dateParam && isValidDateString(dateParam)) {
    return dateParam;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req, ['owner', 'admin', 'viewer']);

    const { searchParams } = new URL(req.url);
    const dateStr = getAnalyticsDate(searchParams.get('date'));

    const dauDoc = await firestore.collection('analytics_aggregates').doc(`dau_${dateStr}`).get();
    const eventsDoc = await firestore.collection('analytics_aggregates').doc(`events_${dateStr}`).get();

    const available = dauDoc.exists || eventsDoc.exists;

    return NextResponse.json({
      authority: 'urai-admin-legacy-aggregate-compatibility',
      canonicalAnalyticsIntegrated: false,
      available,
      date: dateStr,
      dau: dauDoc.exists ? dauDoc.data() : null,
      events: eventsDoc.exists ? eventsDoc.data() : null,
      migrationTarget: 'aggregateUraiAnalyticsV1 / analyticsDailyWorkspaceMetrics',
      note: available
        ? 'Legacy Admin aggregate compatibility data. Do not treat this response as canonical urai-analytics authority.'
        : 'No legacy Admin aggregate exists for this date. Zero activity must not be inferred from missing documents.',
    });
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      return adminAuthErrorResponse(error);
    }

    console.error('ANALYTICS_API_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
