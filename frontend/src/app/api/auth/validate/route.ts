import { NextResponse } from 'next/server';
import { users } from '@/mocks/db';

export async function GET() {
  return NextResponse.json({ user: users[1] }, { status: 200 });
}
