import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Deprecated endpoint disabled. Implement an access-review endpoint with requireAdminSession before re-enabling.',
    },
    { status: 410 },
  );
}
