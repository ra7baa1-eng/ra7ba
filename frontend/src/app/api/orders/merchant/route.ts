import { NextResponse } from 'next/server';
import { listMerchantOrders } from '@/mocks/db';

export async function GET() {
  return NextResponse.json(listMerchantOrders(), { status: 200 });
}
