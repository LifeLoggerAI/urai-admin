import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type HealthPayload = {
  ok: true;
  service: 'urai-admin';
  environment: string;
  version: string;
  timestamp: string;
  checks: {
    runtime: 'ok';
    firebaseHostingRuntimeConfigPath: '/__/firebase/init.json';
    authSessionCookie: '__session';
  };
};

export async function GET() {
  const payload: HealthPayload = {
    ok: true,
    service: 'urai-admin',
    environment: process.env.NODE_ENV ?? 'unknown',
    version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'unknown',
    timestamp: new Date().toISOString(),
    checks: {
      runtime: 'ok',
      firebaseHostingRuntimeConfigPath: '/__/firebase/init.json',
      authSessionCookie: '__session',
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
