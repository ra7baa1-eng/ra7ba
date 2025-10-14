'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const subdomain = params.subdomain as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [showLightbox, setShowLightbox] = useState<string | null>(null);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    loadProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadProduct = async () => {
    try {
      const res = await fetch(`/api/products/by-slug/${slug}`);
      if (!res.ok) throw new Error('NOT_FOUND');
      const data = await res.json();
      setProduct(data);
      // fetch related from same store
      try {
        const rel = await fetch(`/api/products/store?subdomain=${encodeURIComponent(subdomain)}`);
        const relJson = await rel.json();
        const relList = Array.isArray(relJson.products) ? relJson.products : [];
        setRelated(relList.filter((p: any) => p.slug !== slug).slice(0, 4));
      } catch (_) {}
    } catch (e: any) {
      setError('المنتج غير موجود');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    try {
      const stored = localStorage.getItem('cart');
      const cart = stored ? JSON.parse(stored) : [];
      const existing = cart.find((it: any) => it.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({ ...product, quantity: qty });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('تمت الإضافة للسلة');
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خطأ</h1>
          <p className="text-gray-600">{error || 'حدث خطأ'}</p>
          <div className="mt-6">
            <Link href={`/store/${subdomain}`} className="btn-primary">عودة للمتجر</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/store/${subdomain}`} className="text-gray-600 hover:text-primary-600">
                ← المتجر
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">🛍️ {product.nameAr}</h1>
            </div>
            <button
              onClick={() => router.push(`/store/${subdomain}`)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              تصفح المزيد
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/3] bg-white rounded-xl shadow overflow-hidden flex items-center justify-center">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.nameAr}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setShowLightbox(product.images[0])}
                />
              ) : (
                <div className="text-7xl">📦</div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-3">
                {product.images.slice(0, 5).map((src: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${product.nameAr}-${i}`}
                    className="h-20 w-full object-cover rounded-lg border cursor-pointer hover:opacity-90"
                    onClick={() => setShowLightbox(src)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{product.nameAr}</h2>
                <div className="text-sm text-gray-600">SKU: {product.sku || '—'}</div>
              </div>
              <div className="text-3xl font-extrabold text-primary-600">
                {formatCurrency(product.price)}
              </div>
            </div>

            <div className="mt-3">
              {product.stock > 0 ? (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">متوفر</span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">نفذ</span>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2">الكمية</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    −
                  </button>
                  <div className="w-12 text-center font-semibold">{qty}</div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? 'أضف للسلة' : 'نفذ من المخزون'}
              </button>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">الوصف</div>
                <p className="text-gray-800 leading-8">{product.descriptionAr || 'لا يوجد وصف للمنتج.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">منتجات قد تعجبك</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {related.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                  <Link href={`/store/${subdomain}/product/${p.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.nameAr} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-6xl">📦</div>
                    )}
                  </Link>
                  <div className="p-4">
                    <Link href={`/store/${subdomain}/product/${p.slug}`} className="block">
                      <div className="font-bold line-clamp-2">{p.nameAr}</div>
                    </Link>
                    <div className="mt-2 text-primary-600 font-bold">{formatCurrency(p.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={showLightbox} alt="product" className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}
