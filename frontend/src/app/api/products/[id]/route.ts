import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct } from '@/mocks/db';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  deleteProduct(params.id);
  return NextResponse.json({ success: true }, { status: 200 });
}
