import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/mocks/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    if (!status) return NextResponse.json({ message: 'الحالة مطلوبة' }, { status: 400 });
    const updated = updateOrderStatus(params.id, status);
    if (!updated) return NextResponse.json({ message: 'غير موجود' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 });
  }
}
