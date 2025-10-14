import { NextResponse } from 'next/server';
import { getTenantsList } from '@/mocks/db';

export async function GET() {
  return NextResponse.json({ data: getTenantsList() }, { status: 200 });
}
