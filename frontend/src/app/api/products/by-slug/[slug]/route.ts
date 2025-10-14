import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/mocks/db';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const p = products.find(pr => pr.slug === params.slug);
  if (!p) return NextResponse.json({ message: 'غير موجود' }, { status: 404 });
  return NextResponse.json(p, { status: 200 });
}
