'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi, ordersApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import LocationSelector from '@/components/LocationSelector';

export default function StorePage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [storeInfo, setStoreInfo] = useState<any>(null);

  useEffect(() => {
    loadProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const loadProducts = async () => {
    try {
      // Get subdomain from params
      const subdomain = params.subdomain as string;
      
      // Call API with subdomain parameter
      const { data } = await productsApi.getStoreProducts({ subdomain });
      setProducts(data.products || []);
      setStoreInfo(data.store || { name: subdomain, subdomain });
    } catch (error) {
      console.error('Error loading products:', error);
      // Show user-friendly error message
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
    setShowCart(true);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-600">
                🛍️ {storeInfo?.name || 'متجري'}
              </h1>
              <p className="text-sm text-gray-600">تسوق الآن واستلم في منزلك</p>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              🛒 السلة
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="h-40 md:h-56 bg-gradient-to-r from-primary-100 to-primary-200">
          {storeInfo?.bannerUrl && (
            <img src={storeInfo.bannerUrl} alt="banner" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="container mx-auto px-4">
          <div className="-mt-10 md:-mt-14 flex items-end gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden ring-4 ring-white bg-white flex items-center justify-center">
              {storeInfo?.logoUrl ? (
                <img src={storeInfo.logoUrl} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🛍️</span>
              )}
            </div>
            <div className="pb-2">
              <div className="text-2xl md:text-3xl font-bold">{storeInfo?.name || 'متجري'}</div>
              <div className="text-gray-600 text-sm">مرحبا بك في متجرنا</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                <Link href={`/store/${params.subdomain as string}/product/${product.slug}`}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.nameAr}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-6xl">
                      📦
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/store/${params.subdomain as string}/product/${product.slug}`} className="block">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.nameAr}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.descriptionAr}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatCurrency(product.price)}
                    </div>
                    {product.stock > 0 ? (
                      <span className="text-green-600 text-sm">✓ متوفر</span>
                    ) : (
                      <span className="text-red-600 text-sm">✗ نفذ</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock > 0 ? 'أضف للسلة' : 'نفذ من المخزون'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)}>
          <div
            className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">🛒 سلة التسوق</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-600">السلة فارغة</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex gap-3">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">
                            📦
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.nameAr}</h3>
                            <div className="text-purple-600 font-bold mb-2">
                              {formatCurrency(item.price)}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="mr-auto text-red-500 hover:text-red-700"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>الإجمالي:</span>
                    <span className="text-primary-600">{formatCurrency(cartTotal)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">+ رسوم التوصيل عند الطلب</p>
                </div>

                <button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="w-full py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold text-lg animate-pulse"
                >
                  إتمام الطلب 🚀
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          subdomain={(params.subdomain as string) || 'demo'}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setCart([]);
            localStorage.removeItem('cart');
            setShowCheckout(false);
            alert('تم إرسال طلبك بنجاح! 🎉');
          }}
        />
      )}
    </div>
  );
}

function CheckoutModal({ cart, subdomain, onClose, onSuccess }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    wilaya: '',
    commune: '',
    wilayaId: 0,
    communeId: 0,
    postalCode: '',
    shippingAddress: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        wilaya: formData.wilaya,
        commune: formData.commune,
        items: cart.map((it: any) => ({ id: it.id, quantity: it.quantity })),
        subdomain,
      };
      const { data } = await ordersApi.checkout(payload);
      onSuccess();
      if (data?.orderNumber) {
        router.push(`/track/${data.orderNumber}`);
      }
    } catch (err) {
      alert('حدث خطأ أثناء إرسال الطلب');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">إتمام الطلب 🎯</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl">
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💰</span>
              <h3 className="font-bold">الدفع عند الاستلام (COD)</h3>
            </div>
            <p className="text-sm text-blue-800">
              ادفع نقداً عند استلام طلبك • آمن ومضمون ✓
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="أحمد بن علي"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">رقم الهاتف *</label>
            <input
              type="tel"
              required
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0555123456"
            />
          </div>

          <LocationSelector
            selectedWilaya={formData.wilayaId}
            selectedCommune={formData.communeId}
            onWilayaChange={(id, name) => setFormData({ ...formData, wilayaId: id, wilaya: name })}
            onCommuneChange={(id, name, postalCode) => setFormData({ 
              ...formData, 
              communeId: id, 
              commune: name, 
              postalCode 
            })}
            required
          />

          <div>
            <label className="block text-sm font-semibold mb-2">العنوان الكامل *</label>
            <textarea
              required
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="رقم المنزل، اسم الشارع، الحي..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">ملاحظات (اختياري)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="أي ملاحظات إضافية..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              تأكيد الطلب 🎉
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
