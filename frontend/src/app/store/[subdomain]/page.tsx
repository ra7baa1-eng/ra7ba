'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Star,
  MapPin,
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  Filter,
  Search,
} from 'lucide-react';
import { storefrontApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';

// Animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    } 
  }
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  const [offersEnabled, setOffersEnabled] = useState(true);

  useEffect(() => {
    loadProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    // استرجاع بيانات المتجر من التخزين المحلي
    try {
      const g = localStorage.getItem('ra7ba:settings:general');
      if (g) {
        const gj = JSON.parse(g);
        if (gj.storeDescription) setStoreDescription(gj.storeDescription);
        if (gj.storeAddress) setStoreAddress(gj.storeAddress);
        if (gj.supportEmail) setSupportEmail(gj.supportEmail);
        if (gj.supportPhone) setSupportPhone(gj.supportPhone);
      }
      const features = localStorage.getItem('ra7ba:settings:features');
      if (features) {
        const fj = JSON.parse(features);
        if (typeof fj.showReviews === 'boolean') setReviewsEnabled(fj.showReviews);
        if (typeof fj.showOffers === 'boolean') setOffersEnabled(fj.showOffers);
      }
    } catch {}
  }, []);

  const loadProducts = async () => {
    try {
      const subdomain = params.subdomain as string;
      const { data } = await storefrontApi.getProducts(subdomain);
      setProducts(data.data || []);
      setStoreInfo({ name: subdomain, subdomain });
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setStoreInfo({ name: params.subdomain as string, subdomain: params.subdomain as string });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      if (product.category) {
        unique.add(product.category);
      }
    });
    return ['all', ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const heroProduct = useMemo(() => filteredProducts[0], [filteredProducts]);
  const spotlightProducts = useMemo(
    () => filteredProducts.slice(0, 6),
    [filteredProducts]
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-sky-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]">
                  <ShoppingBag size={24} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {storeInfo?.name || 'متجر رحبة'}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> توصيل سريع في 24 ساعة
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" /> ضمان الجودة
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="relative h-11 rounded-xl border border-slate-200"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                عربة التسوق
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          {/* تنقّل صفحات المتجر */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <a href="#top" className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-primary-600 hover:border-primary-200">الرئيسية</a>
            <a href="#categories" className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-primary-600 hover:border-primary-200">التصنيفات</a>
            <a href={`/store/${params.subdomain}/privacy`} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-primary-600 hover:border-primary-200">سياسة الخصوصية</a>
            <a href={`/store/${params.subdomain}/support`} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-primary-600 hover:border-primary-200">الدعم</a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-12">
        {/* وصف المتجر والعنوان */}
        {(storeDescription || storeAddress) && (
          <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-lg">
            <div className="grid gap-4 md:grid-cols-2">
              {storeDescription && (
                <div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">وصف المتجر</h3>
                  <p className="text-slate-600 leading-relaxed">{storeDescription}</p>
                </div>
              )}
              {storeAddress && (
                <div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">العنوان</h3>
                  <p className="text-slate-600">{storeAddress}</p>
                </div>
              )}
            </div>
          </section>
        )}
        {heroProduct ? (
          <motion.section
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="grid gap-6 lg:grid-cols-[1.4fr,1fr]"
          >
            <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 p-0 text-white shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
              <div className="relative flex h-full flex-col justify-between p-10">
                <div className="space-y-6">
                  <Badge variant="outline" className="bg-white/90 text-primary-700">
                    عرض حصري
                  </Badge>
                  <h2 className="text-4xl font-black leading-tight">
                    اكتشف أفضل المنتجات المختارة خصيصاً لك
                  </h2>
                  <p className="max-w-xl text-lg text-white/80">
                    منتجات أصلية، شحن سريع، وخدمة عملاء مميزة. استمتع بتجربة تسوق فاخرة وادفع عند الاستلام بكل أمان.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-300" /> سلع مميزة ذات تقييمات عالية
                    </span>
                    <span className="flex items-center gap-2">
                      <Truck size={16} /> توصيل مجاني للطلبات فوق 10,000 دج
                    </span>
                    <span className="flex items-center gap-2">
                      <Heart size={16} /> منتجات مختارة بعناية
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button className="h-11 rounded-xl bg-white/95 px-6 text-primary-700 hover:bg-white">
                    تصفح التشكيلة الكاملة
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-11 rounded-xl border border-white/30 bg-white/20 px-6 text-white backdrop-blur hover:bg-white/30"
                    onClick={() => setSelectedCategory('all')}
                  >
                    أحدث الإصدارات
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-slate-100 bg-white/80 shadow-lg backdrop-blur">
              <CardHeader className="items-start gap-2">
                <Badge variant="outline" className="bg-primary-50 text-primary-600">
                  المنتج المميز
                </Badge>
                <CardTitle className="text-2xl text-slate-900">
                  {heroProduct?.name}
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {heroProduct?.description || 'منتج فاخر من مجموعتنا المختارة بعناية'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-100">
                  {heroProduct?.images?.[0] ? (
                    <Image
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <ShoppingBag size={48} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">السعر الحالي</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(heroProduct?.price || 0)}
                    </p>
                  </div>
                  <Button
                    className="h-11 rounded-xl px-6"
                    onClick={() => addToCart(heroProduct)}
                  >
                    أضف للسلة الآن
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4 text-sm text-slate-500">
                <div className="flex w-full flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Star className="h-4 w-4 text-amber-400" />
                    {heroProduct?.rating?.toFixed?.(1) || '4.9'} تقييم العملاء
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> ضمان استرجاع لمدة 7 أيام
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Sparkles className="h-4 w-4" /> جاهز للشحن من مخازن رحبة
                </div>
              </CardFooter>
            </Card>
          </motion.section>
        ) : (
          <Card className="rounded-3xl border-none bg-white/70 py-20 text-center shadow-lg">
            <CardContent className="space-y-4">
              <ShoppingBag size={64} className="mx-auto text-slate-200" />
              <CardTitle className="text-2xl text-slate-800">
                لا توجد منتجات متاحة حالياً
              </CardTitle>
              <CardDescription className="text-slate-500">
                سيتم تحديث المتجر بأحدث المنتجات قريباً. عد لاحقاً للاطلاع على الجديد.
              </CardDescription>
            </CardContent>
          </Card>
        )}

        <section className="grid gap-4 rounded-3xl bg-white/70 p-6 shadow-lg md:grid-cols-3">
          <Card className="h-full rounded-2xl border border-slate-100 bg-white/80 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Sparkles />
              </div>
              <div>
                <p className="text-sm text-slate-500">منتجات مختارة بعناية</p>
                <p className="text-lg font-semibold text-slate-800">{products.length}+ منتج حصري</p>
              </div>
            </CardContent>
          </Card>
          <Card className="h-full rounded-2xl border border-slate-100 bg-white/80 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck />
              </div>
              <div>
                <p className="text-sm text-slate-500">استبدال مجاني</p>
                <p className="text-lg font-semibold text-slate-800">ضمان لمدة 7 أيام</p>
              </div>
            </CardContent>
          </Card>
          <Card className="h-full rounded-2xl border border-slate-100 bg-white/80 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Truck />
              </div>
              <div>
                <p className="text-sm text-slate-500">توصيل سريع وآمن</p>
                <p className="text-lg font-semibold text-slate-800">+100 مدينة مغطاة</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="categories" className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900">استكشف تشكيلتنا</h3>
              <p className="text-slate-500">اختر الفئة المناسبة لك أو استخدم البحث للعثور على منتجك بسرعة</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="h-11 w-64 rounded-xl border border-slate-200 bg-white pl-10"
                  placeholder="ابحث عن منتجك المفضل..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <Badge variant="outline" className="flex items-center gap-1 rounded-full border-slate-200 bg-white px-4 py-2 text-slate-600">
                <Filter className="h-4 w-4 text-primary-600" />
                فئات مخصصة
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className={`h-10 rounded-full border px-5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? 'border-transparent bg-primary-600 text-white shadow'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'كل المنتجات' : category}
              </Button>
            ))}
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          >
            {spotlightProducts.map((product) => (
              <motion.div key={product.id} variants={fadeIn}>
                <Card className="group h-full rounded-2xl border border-slate-100 bg-white/80 shadow-lg transition-all hover:-translate-y-2 hover:border-primary-100">
                  <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <ShoppingBag size={36} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Badge className="rounded-full bg-white/90 text-primary-600 shadow">
                        {product.category || 'مختار'}
                      </Badge>
                      <Badge variant="outline" className="rounded-full bg-white/70 text-slate-600">
                        الأكثر طلباً
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="space-y-3 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg text-slate-900">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                          {product.description || 'منتج عالي الجودة، مضمون ومصمم ليناسب احتياجاتك اليومية.'}
                        </CardDescription>
                      </div>
                      <button className="text-slate-300 transition hover:text-rose-500">
                        <Heart size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-500">
                      <Star className="h-4 w-4" />
                      <span>{product.rating?.toFixed?.(1) || '4.8'}</span>
                      <span className="text-slate-400">تقييم</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">السعر</p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <Button
                      className="h-11 rounded-xl px-5"
                      onClick={() => addToCart(product)}
                    >
                      أضف للسلة
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {spotlightProducts.length === 0 && (
              <motion.div variants={fadeIn} className="col-span-full">
                <Card className="rounded-3xl border-none bg-white/70 py-16 text-center shadow">
                  <CardContent className="space-y-4">
                    <ShoppingBag size={56} className="mx-auto text-slate-200" />
                    <CardTitle className="text-xl text-slate-800">
                      لا توجد منتجات مطابقة لبحثك
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      حاول تغيير الفئة أو استخدام كلمات أخرى في البحث.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </section>

        {(reviewsEnabled || offersEnabled) && (
          <section className="grid gap-6 rounded-3xl bg-white/70 p-8 shadow-lg lg:grid-cols-3">
            {reviewsEnabled && (
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">آراء عملائنا</h3>
                  <Badge className="bg-emerald-50 text-emerald-600">رضا 98%</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {['مريم', 'أمين', 'خولة', 'سامي'].map((customer) => (
                    <Card key={customer} className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm">
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">{customer}</p>
                            <p className="text-xs text-slate-400">عميل رحبة</p>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, index) => (
                              <Star key={index} size={16} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500">
                          تجربة مميزة جداً! المنتجات وصلت بسرعة وبجودة ممتازة. خدمة العملاء كانت متجاوبة وودودة.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {offersEnabled && (
              <Card className="h-full rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-white p-6 shadow-md">
                <CardHeader>
                  <Badge className="bg-primary-600 text-white">عروض الموسم</Badge>
                  <CardTitle className="text-2xl text-slate-900">عروض حصرية</CardTitle>
                  <CardDescription className="text-slate-500">
                    استفد من خصومات تصل إلى 35% على باقات المنتجات المختارة لمدة محدودة.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary-500" />
                    منتجات أصلية مع ضمان شامل
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary-500" />
                    توصيل مجاني للطلبات فوق 10,000 دج
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary-500" />
                    خدمة ما بعد البيع ممتازة
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="h-11 w-full rounded-xl">اكتشف الخصومات الآن</Button>
                </CardFooter>
              </Card>
            )}
          </section>
        )}
      </main>

      <AnimatePresence>
        {showCart && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed inset-y-0 left-0 w-full max-w-md bg-white/95 z-50 shadow-2xl backdrop-blur"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">سلة التسوق</h2>
                  <p className="text-sm text-slate-500">{cartCount} منتجات في انتظار الإتمام</p>
                </div>
                <Button variant="ghost" onClick={() => setShowCart(false)} className="h-10 px-3 text-slate-500">
                  <X size={18} />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                    <ShoppingCart size={36} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">سلة التسوق فارغة</h3>
                  <p className="text-sm text-slate-500">ابدأ التسوق الآن وأضف منتجاتك المفضلة بسهولة.</p>
                  <Button className="h-11 rounded-xl px-6" onClick={() => setShowCart(false)}>
                    العودة للمتجر
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                    {cart.map((item) => (
                      <Card key={item.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
                            {item.images?.[0] ? (
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <ShoppingBag size={28} />
                            </div>
                          )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="truncate text-base font-semibold text-slate-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {formatCurrency(item.price)}
                            </p>
                            <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-xs text-slate-500">
                              الكمية المتوفرة: {item.stock ?? 'غير محدد'}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition hover:bg-primary-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm text-rose-500 hover:text-rose-600"
                            >
                              إزالة المنتج
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-5 border-t border-slate-200 px-6 py-5">
                    <div className="flex items-center justify-between text-base text-slate-600">
                      <span>عدد المنتجات</span>
                      <span>{cartCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
                      <span>إجمالي الطلب</span>
                      <span className="text-primary-600">{formatCurrency(cartTotal)}</span>
                    </div>
                    <Button
                      className="h-12 w-full rounded-xl text-base"
                      onClick={() => {
                        setShowCart(false);
                        setShowCheckout(true);
                      }}
                    >
                      إتمام الطلب بأمان
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
