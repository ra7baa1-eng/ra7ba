import { NextResponse } from 'next/server';
import { listMerchantProducts } from '@/mocks/db';

export async function GET() {
  return NextResponse.json(listMerchantProducts(), { status: 200 });
}
