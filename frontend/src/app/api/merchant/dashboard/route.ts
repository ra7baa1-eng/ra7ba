import { NextResponse } from 'next/server';
import { stores } from '@/mocks/db';

export async function GET() {
  const s = stores[0];
  return NextResponse.json({
    tenant: {
      name: s.name,
      nameAr: s.name,
      description: 'متجر تجريبي على رحبة',
      logo: s.logoUrl,
      banner: s.bannerUrl,
      phone: s.phone,
      address: `${s.baladiya || ''}, ${s.wilaya || ''}`,
      customDomain: `${s.slug}.rahba.dz`,
    },
  }, { status: 200 });
}
