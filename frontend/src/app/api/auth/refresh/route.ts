import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ accessToken: 'mock_access2', refreshToken: 'mock_refresh2' }, { status: 200 });
}
