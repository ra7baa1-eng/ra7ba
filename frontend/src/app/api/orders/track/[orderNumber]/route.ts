import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/mocks/db';

export async function GET(_req: NextRequest, { params }: { params: { orderNumber: string } }) {
  const order = orders.find(o => o.orderNumber === params.orderNumber);
  if (!order) return NextResponse.json({ message: 'الطلب غير موجود' }, { status: 404 });
  return NextResponse.json(order, { status: 200 });
}
