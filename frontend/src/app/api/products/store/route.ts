import { NextRequest, NextResponse } from 'next/server';
import { findStoreBySlug, getStoreProducts, stores } from '@/mocks/db';

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get('subdomain') || 'demo';
  const store = findStoreBySlug(subdomain) || stores[0];
  if (!store) {
    return NextResponse.json({ products: [], store: null }, { status: 200 });
  }
  const products = getStoreProducts(store.id);
  return NextResponse.json(
    {
      store: {
        id: store.id,
        name: store.name,
        subdomain: store.slug,
        bannerUrl: store.bannerUrl,
        logoUrl: store.logoUrl,
        colors: store.colors,
      },
      products,
    },
    { status: 200 }
  );
}
