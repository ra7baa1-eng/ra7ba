'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Package, Check, MapPin, Phone, User, FileText, ArrowRight
} from 'lucide-react';
import { storefrontApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button, Input } from '@/components/ui';

interface City {
  id: number;
  commune_name: string;
  daira_name: string;
  wilaya_code: string;
  wilaya_name: string;
}

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;
  const productId = params.productId as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedDaira, setSelectedDaira] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // Filtered data
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [dairas, setDairas] = useState<string[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);

  useEffect(() => {
    loadProduct();
    loadCities();
  }, [subdomain, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await storefrontApi.getProduct(subdomain, productId);
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to load product', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const response = await fetch('/data/algeria_cities.json');
      const data = await response.json();
      setCities(data);
      
      // Extract unique wilayas
      const uniqueWilayas = Array.from(new Set(data.map((c: City) => c.wilaya_name)));
      setWilayas(uniqueWilayas.sort());
    } catch (error) {
      console.error('Failed to load cities', error);
    }
  };

  const handleWilayaChange = (wilaya: string) => {
    setSelectedWilaya(wilaya);
    setSelectedDaira('');
    setSelectedCommune('');
    
    // Filter dairas for selected wilaya
    const filteredDairas = cities
      .filter(c => c.wilaya_name === wilaya)
      .map(c => c.daira_name);
    const uniqueDairas = Array.from(new Set(filteredDairas));
    setDairas(uniqueDairas.sort());
    setCommunes([]);
  };

  const handleDairaChange = (daira: string) => {
    setSelectedDaira(daira);
    setSelectedCommune('');
    
    // Filter communes for selected daira and wilaya
    const filteredCommunes = cities
      .filter(c => c.wilaya_name === selectedWilaya && c.daira_name === daira)
      .map(c => c.commune_name);
    setCommunes(filteredCommunes.sort());
  };

  const handleSubmitOrder = async () => {
    if (!fullName || !phone || !selectedWilaya || !selectedDaira || !selectedCommune || !address) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const orderData = {
        customerName: fullName,
        customerPhone: phone,
        wilaya: selectedWilaya,
        daira: selectedDaira,
        commune: selectedCommune,
        address,
        notes: note,
        items: [{
          productId: product.id,
          quantity: 1,
        }],
      };

      await storefrontApi.createOrder(subdomain, orderData);
      
      // Success message
      alert('✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
      
      // Redirect to store
      router.push(`/store/${subdomain}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-cairo">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl font-cairo mb-4">المنتج غير موجود</p>
          <Button onClick={() => router.push(`/store/${subdomain}`)} className="font-cairo">
            العودة للمتجر
          </Button>
        </div>
      </div>
    );
  }

  const shippingFee = 600;
  const total = Number(product.price) + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-cairo"
          >
            <ArrowRight className="w-5 h-5" />
            رجوع
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-cairo">
              إتمام الطلب
            </h1>
            <p className="text-gray-600 font-tajawal">املأ البيانات أدناه لإتمام طلبك</p>
          </div>

          {/* Product Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-cairo flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              ملخص الطلب
            </h2>
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0]} 
                    alt={product.nameAr} 
                    width={96} 
                    height={96} 
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-cairo">
                  {product.nameAr || product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600 font-cairo">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-gray-600 font-tajawal">الكمية: 1</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-gray-700 font-tajawal">
                <span>سعر المنتج:</span>
                <span className="font-bold">{formatCurrency(product.price)}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-tajawal">
                <span>رسوم التوصيل:</span>
                <span className="font-bold">{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200 font-cairo">
                <span>المجموع الكلي:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-cairo flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              معلومات التوصيل
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 font-cairo">
                  <User className="w-5 h-5 inline ml-2" />
                  الاسم الكامل *
                </label>
                <Input
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-3 text-lg font-tajawal"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 font-cairo">
                  <Phone className="w-5 h-5 inline ml-2" />
                  رقم الهاتف *
                </label>
                <Input
                  type="tel"
                  placeholder="05XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-3 text-lg font-tajawal"
                />
              </div>

              {/* Wilaya */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 font-cairo">
                  <MapPin className="w-5 h-5 inline ml-2" />
                  الولاية *
                </label>
                <select
                  value={selectedWilaya}
                  onChange={(e) => handleWilayaChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg font-tajawal"
                >
                  <option value="">اختر الولاية</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
              </div>

              {/* Daira */}
              {selectedWilaya && (
                <div>
                  <label className="block text-gray-700 font-bold mb-2 font-cairo">
                    الدائرة *
                  </label>
                  <select
                    value={selectedDaira}
                    onChange={(e) => handleDairaChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg font-tajawal"
                  >
                    <option value="">اختر الدائرة</option>
                    {dairas.map((daira) => (
                      <option key={daira} value={daira}>{daira}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Commune */}
              {selectedDaira && (
                <div>
                  <label className="block text-gray-700 font-bold mb-2 font-cairo">
                    البلدية *
                  </label>
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg font-tajawal"
                  >
                    <option value="">اختر البلدية</option>
                    {communes.map((commune) => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 font-cairo">
                  العنوان التفصيلي *
                </label>
                <Input
                  type="text"
                  placeholder="الحي، الشارع، رقم المنزل..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full py-3 text-lg font-tajawal"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 font-cairo">
                  <FileText className="w-5 h-5 inline ml-2" />
                  ملاحظات إضافية (اختياري)
                </label>
                <textarea
                  placeholder="أي ملاحظات أو تعليمات خاصة..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg font-tajawal resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitOrder}
            disabled={submitting || !fullName || !phone || !selectedWilaya || !selectedDaira || !selectedCommune || !address}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-6 rounded-xl shadow-lg text-xl font-cairo disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                جاري الإرسال...
              </>
            ) : (
              <>
                <Check className="w-6 h-6 ml-2" />
                تأكيد الطلب
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-800 font-tajawal">
              🔒 معلوماتك آمنة ومحمية. الدفع عند الاستلام فقط.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
