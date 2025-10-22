'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Star, Search, Menu, X, Heart, Sparkles, 
  TrendingUp, Package, Shield, Zap, ArrowRight, Filter
} from 'lucide-react';
import { storefrontApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button, Input, Badge } from '@/components/ui';

// Neon glow effect
const neonGlow = {
  boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
};

// Strip HTML helper
const stripHtml = (html: string) => {
  if (typeof window !== 'undefined') {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
};

export default function StorefrontPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)']);

  useEffect(() => {
    loadStore();
    loadProducts();
    loadCategories();
    loadCart();
  }, [subdomain]);

  const loadStore = async () => {
    try {
      const res = await storefrontApi.getStore(subdomain);
      setStore(res.data);
    } catch (error) {
      console.error('Failed to load store', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await storefrontApi.getProducts(subdomain);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await storefrontApi.getCategories(subdomain);
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const loadCart = () => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  };

  const addToCart = (product: any) => {
    const newCart = [...cart];
    const existing = newCart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchSearch = !searchTerm || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameAr?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20"
        style={{ backgroundColor: headerBg }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Sparkles className="w-8 h-8 text-purple-500" style={neonGlow} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {store?.name || subdomain}
              </h1>
            </motion.div>

            {/* Search - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن منتجك المفضل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border-purple-500/30 text-white pl-12 pr-4 py-3 rounded-xl backdrop-blur-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            {/* Cart & Menu */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
                style={neonGlow}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {totalCartItems}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden bg-white/5 hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <Input
                type="text"
                placeholder="ابحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border-purple-500/30 text-white pl-12 pr-4 py-3 rounded-xl"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                اكتشف عالم التسوق الرقمي
              </h2>
            </motion.div>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              منتجات أصلية، أسعار تنافسية، وتوصيل سريع لباب منزلك
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Package, label: 'منتج متنوع', value: products.length },
                { icon: Star, label: 'تقييم عالي', value: '4.9' },
                { icon: Shield, label: 'دفع آمن', value: '100%' },
                { icon: Zap, label: 'توصيل سريع', value: '24h' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
                  whileHover={{ scale: 1.05, ...neonGlow }}
                >
                  <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Categories */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <Button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-6 py-3 whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                style={selectedCategory === 'all' ? neonGlow : {}}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                كل المنتجات
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-6 py-3 whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  style={selectedCategory === cat.id ? neonGlow : {}}
                >
                  {cat.nameAr || cat.name}
                </Button>
              ))}
            </div>
          </motion.section>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                    className="group relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={() => router.push(`/store/${subdomain}/products/${product.slug}`)}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-black/50">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.nameAr || product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-purple-400/30" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Discount Badge */}
                      {product.comparePrice && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                          {Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}% خصم
                        </Badge>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          className="bg-white/90 hover:bg-white text-black rounded-full p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to wishlist
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {product.nameAr || product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {stripHtml(product.descriptionAr || product.description || '')}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-400 mr-2">(4.8)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {formatCurrency(product.price)}
                          </div>
                          {product.comparePrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.comparePrice)}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Neon border effect on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={neonGlow} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="w-24 h-24 text-purple-400/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">لا توجد منتجات</h3>
              <p className="text-gray-400">جرب البحث بكلمة أخرى أو اختر تصنيف آخر</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl z-50 overflow-y-auto border-l border-purple-500/30"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">سلة المشتريات</h3>
                  <Button
                    onClick={() => setShowCart(false)}
                    className="bg-white/10 hover:bg-white/20 rounded-full p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-24 h-24 text-purple-400/30 mx-auto mb-4" />
                    <p className="text-gray-400">سلتك فارغة</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/50">
                              {item.images?.[0] ? (
                                <Image
                                  src={item.images[0]}
                                  alt={item.nameAr || item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="w-full h-full text-purple-400/30 p-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white mb-1">{item.nameAr || item.name}</h4>
                              <div className="text-purple-400 font-bold">{formatCurrency(item.price)}</div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-400">الكمية: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-purple-500/20 pt-4 mb-6">
                      <div className="flex items-center justify-between text-xl font-bold text-white">
                        <span>المجموع:</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {formatCurrency(cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0))}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => router.push(`/store/${subdomain}/checkout`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl"
                      style={neonGlow}
                    >
                      إتمام الطلب
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-black/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            {store?.name || subdomain} © 2025 - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
