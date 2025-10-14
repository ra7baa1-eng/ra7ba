import { NextResponse } from 'next/server';
import { getAdminStats } from '@/mocks/db';

export async function GET() {
  return NextResponse.json(getAdminStats(), { status: 200 });
}
