import { NextRequest, NextResponse } from 'next/server';
import { addProduct } from '@/mocks/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prod = addProduct(body || {});
    return NextResponse.json(prod, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'فشل إنشاء المنتج' }, { status: 500 });
  }
}
