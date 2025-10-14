import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/mocks/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, shippingAddress, wilaya, commune, items, subdomain } = body || {};
    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'بيانات غير كافية' }, { status: 400 });
    }
    const storeSlug = subdomain || 'demo';
    const order = createOrder({ storeSlug, customerName, customerPhone, wilaya, commune, shippingAddress, items });
    return NextResponse.json({ success: true, orderNumber: order.orderNumber, order }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'خطأ في إنشاء الطلب' }, { status: 500 });
  }
}
