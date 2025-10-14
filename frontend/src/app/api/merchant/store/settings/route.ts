import { NextRequest, NextResponse } from 'next/server';
import { stores } from '@/mocks/db';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const s = stores[0];
    if (!s) return NextResponse.json({ message: 'not found' }, { status: 404 });
    if (typeof body.name === 'string') s.name = body.name;
    if (typeof body.nameAr === 'string') s.name = body.nameAr || s.name;
    if (typeof body.phone === 'string') s.phone = body.phone;
    if (typeof body.address === 'string') s.baladiya = body.address;
    if (typeof body.logo === 'string') s.logoUrl = body.logo;
    if (typeof body.banner === 'string') s.bannerUrl = body.banner;
    s.updatedAt = new Date().toISOString();
    return NextResponse.json({ success: true, tenant: { name: s.name, nameAr: s.name, logo: s.logoUrl, banner: s.bannerUrl } }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'failed' }, { status: 500 });
  }
}
