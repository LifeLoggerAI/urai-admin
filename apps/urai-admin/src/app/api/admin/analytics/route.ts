
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  if (!process.env.FIREBASE_ADMIN_SDK_JSON) {
    throw new Error('The FIREBASE_ADMIN_SDK_JSON environment variable is not set.');
  }
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON))
  });
}

const db = getFirestore();

// Basic YYYY-MM-DD date string validation
function isValidDateString(dateStr: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    let dateStr;
    if (dateParam && isValidDateString(dateParam)) {
        dateStr = dateParam;
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        dateStr = yesterday.toISOString().split('T')[0];
    }

    const dauRef = db.collection("analytics_aggregates").doc(`dau_${dateStr}`);
    const dauDoc = await dauRef.get();
    const dauData = dauDoc.exists ? dauDoc.data() : { count: 0, date: dateStr };

    const eventsRef = db.collection("analytics_aggregates").doc(`events_${dateStr}`);
    const eventsDoc = await eventsRef.get();
    const eventsData = eventsDoc.exists ? eventsDoc.data() : { counts: {}, date: dateStr };

    return NextResponse.json({
      dau: dauData,
      events: eventsData,
    });
  } catch (error) {
    console.error("ANALYTICS_API_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
