'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { storefrontApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { ArrowRight, ShoppingBag, ShoppingCart, Star, X } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any | null>(null);
  const [store, setStore] = useState<any | null>(null);
  const [enableCart, setEnableCart] = useState(true);

  // Checkout overlay (Buy Now)
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pRes, sRes] = await Promise.all([
          storefrontApi.getProduct(subdomain, slug),
          storefrontApi.getStore(subdomain),
        ]);
        setProduct(pRes.data);
        setStore(sRes.data);
        const features = sRes.data?.storeFeatures || {};
        setEnableCart(typeof features.enableCart === 'boolean' ? features.enableCart : true);
      } catch (e) {
        console.error('Failed to load product', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [subdomain, slug]);

  const addToCart = (prod: any) => {
    try {
      const saved = localStorage.getItem('cart');
      let cart = saved ? JSON.parse(saved) : [];
      const idx = cart.findIndex((it: any) => it.id === prod.id);
      if (idx >= 0) cart[idx].quantity += 1; else cart.push({ ...prod, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      router.push(`/store/${subdomain}`);
    } catch (e) {
      console.error('Failed to add to cart', e);
    }
  };

  const handleSubmitOrder = async () => {
    if (!product) return;
    try {
      setCheckoutSubmitting(true);
      const payload = {
        customerName,
        customerPhone,
        wilaya,
        commune,
        address,
        items: [{ productId: product.id, quantity: 1 }],
        notes,
      };
      await storefrontApi.createOrder(subdomain, payload);
      setShowCheckout(false);
      setCustomerName('');
      setCustomerPhone('');
      setWilaya('');
      setCommune('');
      setAddress('');
      setNotes('');
      router.push(`/store/${subdomain}`);
    } catch (e) {
      console.error('Failed to create order', e);
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  const mainImage = useMemo(() => product?.images?.[0] || '', [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto text-slate-300" size={48} />
          <p className="mt-3 text-slate-600">هذا المنتج غير متاح</p>
          <Button className="mt-4" onClick={() => router.push(`/store/${subdomain}`)}>عودة للمتجر</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-sky-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">{store?.name || subdomain}</h1>
          <Button variant="secondary" onClick={() => router.push(`/store/${subdomain}`)}>
            العودة للمتجر
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-slate-100">
            {mainImage ? (
              <Image src={mainImage} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <ShoppingBag size={48} />
              </div>
            )}
          </div>

          <Card className="rounded-2xl border border-slate-100 bg-white/80 shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">{product.name}</CardTitle>
              <CardDescription className="text-slate-600">{product.description || 'منتج مميز من تشكيلتنا'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Star className="h-4 w-4" />
                <span>{product.rating?.toFixed?.(1) || '4.8'}</span>
                <span className="text-slate-400">تقييم</span>
              </div>

              <div>
                <p className="text-sm text-slate-500">السعر</p>
                <p className="text-3xl font-extrabold text-primary-600">{formatCurrency(product.price)}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {enableCart ? (
                  <Button className="h-11 rounded-xl px-6" onClick={() => addToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> أضف للسلة
                  </Button>
                ) : (
                  <Button className="h-11 rounded-xl px-6" onClick={() => setShowCheckout(true)}>
                    <ArrowRight className="mr-2 h-4 w-4" /> اطلب الآن
                  </Button>
                )}
                <Badge className="rounded-full bg-white text-primary-600 border border-primary-200">
                  {product.category?.nameAr || product.category?.name || 'منتج' }
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-xl font-bold text-slate-900">إتمام الطلب</h3>
              <Button variant="ghost" onClick={() => setShowCheckout(false)} className="h-10 px-3 text-slate-500">
                <X size={18} />
              </Button>
            </div>

            <div className="px-6 py-5 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="الاسم الكامل" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <Input placeholder="رقم الهاتف" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="الولاية" value={wilaya} onChange={(e) => setWilaya(e.target.value)} />
                <Input placeholder="البلدية" value={commune} onChange={(e) => setCommune(e.target.value)} />
              </div>
              <Input placeholder="العنوان الكامل" value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input placeholder="ملاحظات إضافية (اختياري)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex items-center gap-3 border-t px-6 py-4">
              <Button
                className="h-11 rounded-xl px-6"
                onClick={handleSubmitOrder}
                disabled={checkoutSubmitting || !customerName || !customerPhone || !wilaya || !commune || !address}
              >
                {checkoutSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </Button>
              <Button variant="secondary" className="h-11 rounded-xl px-6" onClick={() => setShowCheckout(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
