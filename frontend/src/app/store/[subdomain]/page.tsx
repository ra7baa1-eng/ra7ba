'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Search, Menu, Heart, User, ChevronLeft, ChevronRight, Star, MapPin, Clock, Check, ChevronDown } from 'lucide-react';
import { productsApi, ordersApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import LocationSelector from '@/components/LocationSelector';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {storeInfo?.name || 'متجري'}
                </h1>
                <p className="text-xs text-gray-500 flex items-center">
                  <MapPin size={12} className="ml-1" />
                  توصيل سريع لجميع المناطق
                </p>
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCart(!showCart)}
              className="relative p-2.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-1.5"
            >
              🛒 السلة
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <motion.main 
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="container mx-auto px-4 py-12"
          >
            <motion.div 
              variants={fadeIn}
              className="flex items-center justify-between mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <ShoppingBag className="ml-2 text-blue-600" size={24} />
                منتجاتنا المميزة
              </h2>
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-sm text-gray-600">ترتيب حسب:</span>
                <select className="bg-transparent text-sm font-medium text-blue-600 focus:outline-none">
                  <option>الأحدث</option>
                  <option>الأعلى سعراً</option>
                  <option>الأقل سعراً</option>
                </select>
              </div>
            </motion.div>
            
            <motion.div 
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300">
                        <ShoppingBag size={40} className="opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus size={16} />
                        <span>أضف للسلة</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{product.name}</h3>
                      <div className="flex items-center text-amber-400">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm text-gray-500 mr-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => addToCart(product)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.main>
            })}
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
                      <span className="text-purple-600">{formatCurrency(cartTotal)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">+ رسوم التوصيل عند الطلب</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-lg"
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

function CheckoutModal({ cart, onClose, onSuccess }: any) {
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
    // Here you would call the checkout API
    // For now, just simulate success
    setTimeout(() => {
      onSuccess();
    }, 1000);
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
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="رقم المنزل، اسم الشارع، الحي..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">ملاحظات (اختياري)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              تأكيد الطلب 🎉
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
