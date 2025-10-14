import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/mocks/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const p = products.find(pr => pr.id === params.id);
  if (!p) return NextResponse.json({ message: 'غير موجود' }, { status: 404 });
  return NextResponse.json(p, { status: 200 });
}
