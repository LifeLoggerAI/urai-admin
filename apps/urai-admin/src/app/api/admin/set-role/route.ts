import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Deprecated endpoint disabled. Use /api/admin/update-user-role instead.',
    },
    { status: 410 },
  );
}
