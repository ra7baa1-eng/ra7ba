'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    password: '',
    phone: '',
    // Store Info
    storeName: '',
    storeNameAr: '',
    subdomain: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await authApi.register(formData);
      
      // Save tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to merchant dashboard
      router.push('/merchant/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل التسجيل');
    } finally {
      setLoading(false);
    }
  };

  const handleSubdomainChange = (value: string) => {
    // Only allow lowercase alphanumeric and hyphens
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, subdomain: cleaned });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              🛍️ رحبة
            </div>
          </Link>
          <p className="text-gray-600 text-lg">إنشاء متجرك الإلكتروني في دقائق</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="font-semibold">معلوماتك</span>
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="font-semibold">متجرك</span>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">معلوماتك الشخصية</h3>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="أحمد بن علي"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ltr-content"
                    placeholder="0555123456"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    كلمة المرور *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">8 أحرف على الأقل</p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  التالي ←
                </button>
              </div>
            )}

            {/* Step 2: Store Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">معلومات المتجر</h3>

                {/* Store Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم المتجر (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ltr-content"
                    placeholder="My Awesome Store"
                  />
                </div>

                {/* Store Name Arabic */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم المتجر (عربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeNameAr}
                    onChange={(e) => setFormData({ ...formData, storeNameAr: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="متجري الرائع"
                  />
                </div>

                {/* Subdomain */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان المتجر (Subdomain) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={formData.subdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ltr-content"
                      placeholder="mystore"
                      pattern="[a-z0-9-]+"
                    />
                    <span className="text-gray-600 font-mono">.rahba.dz</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    حروف صغيرة وأرقام وشرطات فقط
                  </p>
                  {formData.subdomain && (
                    <p className="text-sm text-purple-600 mt-2 font-semibold">
                      ✓ متجرك سيكون: {formData.subdomain}.rahba.dz
                    </p>
                  )}
                </div>

                {/* Trial Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <h4 className="font-bold text-green-800 mb-1">تجربة مجانية 7 أيام</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✓ 20 طلب مجاني</li>
                        <li>✓ 10 منتجات مجانية</li>
                        <li>✓ جميع الميزات</li>
                        <li>✓ بدون بطاقة ائتمان</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    → رجوع
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                  >
                    {loading ? 'جاري الإنشاء...' : 'إنشاء المتجر 🚀'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center pt-6 border-t">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
