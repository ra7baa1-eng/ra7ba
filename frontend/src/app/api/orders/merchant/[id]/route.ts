import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/mocks/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const o = getOrderById(params.id);
  if (!o) return NextResponse.json({ message: 'غير موجود' }, { status: 404 });
  return NextResponse.json(o, { status: 200 });
}
