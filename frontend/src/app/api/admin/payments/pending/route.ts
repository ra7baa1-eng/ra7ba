import { NextResponse } from 'next/server';
import { payments } from '@/mocks/db';

export async function GET() {
  return NextResponse.json(payments, { status: 200 });
}
