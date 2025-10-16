'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sparkles, Zap, TrendingUp, Shield, Rocket, Star } from 'lucide-react';

export default function HomePage() {
  const [text, setText] = useState('');
  const fullText = 'أنشئ متجرك الإلكتروني في دقائق';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gray-900/50 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                رحبة 🛍️
              </div>
              <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-400/30 animate-pulse">
                Beta
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                المميزات
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                الأسعار
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                آراء العملاء
              </Link>
              <Link href="#demo" className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                عرض توضيحي
              </Link>
            </div>
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transform hover:-translate-y-0.5 hover:scale-105 animate-pulse"
              >
                ابدأ مجاناً ✨
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-400/30 backdrop-blur-sm animate-bounce">
              <Sparkles className="w-4 h-4" />
              🎉 جديد: دعم الذكاء الاصطناعي لتحسين المبيعات
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse">
                {text}
              </span>
              <span className="inline-block animate-bounce ml-4">🚀</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <span className="text-purple-300">منصة متكاملة</span> لإدارة متجرك الإلكتروني في <span className="text-pink-400">الجزائر</span>
              <br />
              مع دعم <span className="text-blue-400">الدفع عند الاستلام</span> والتوصيل لكل الولايات
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/register"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                  ابدأ تجربة مجانية 7 أيام ✨
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/store/demo"
                className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-purple-300 text-lg font-semibold rounded-xl hover:bg-gray-800/70 transition-all duration-300 shadow-md border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                شاهد العرض التوضيحي 🎥
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-70">
              <div className="text-sm text-gray-500">موثوق من قبل أكثر من</div>
              <div className="font-bold text-2xl text-primary-600">500+</div>
              <div className="text-sm text-gray-500">تاجر جزائري</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-primary-600 mb-2">58</div>
                <div className="text-gray-600 font-medium">ولاية جزائرية</div>
                <div className="text-sm text-gray-500 mt-1">تغطية شاملة</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-green-600 mb-2">1,350</div>
                <div className="text-gray-600 font-medium">دج شهرياً</div>
                <div className="text-sm text-gray-500 mt-1">أرخص الأسعار</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">دعم فني</div>
                <div className="text-sm text-gray-500 mt-1">متاح دائماً</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600 font-medium">وقت التشغيل</div>
                <div className="text-sm text-gray-500 mt-1">موثوقية عالية</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            لماذا رحبة؟ 🌟
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-5xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold mb-4">متجر احترافي</h3>
              <p className="text-gray-600">
                واجهة عربية جميلة وسهلة الاستخدام
                مع إمكانية التخصيص الكامل
              </p>
            </div>

            <div className="text-center p-8">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-4">دفع عند الاستلام</h3>
              <p className="text-gray-600">
                دعم COD للعملاء
                و BaridiMob للتجار
              </p>
            </div>

            <div className="text-center p-8">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-4">توصيل سريع</h3>
              <p className="text-gray-600">
                تكامل مع أفضل شركات التوصيل
                Yalidine, Zr Express, JetExpress
              </p>
            </div>

            <div className="text-center p-8">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-4">تحليلات دقيقة</h3>
              <p className="text-gray-600">
                تتبع مبيعاتك وطلباتك
                في لوحة تحكم احترافية
              </p>
            </div>

            <div className="text-center p-8">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-4">آمن ومضمون</h3>
              <p className="text-gray-600">
                حماية بيانات عملائك
                مع أعلى معايير الأمان
              </p>
            </div>

            <div className="text-center p-8">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-4">متجاوب</h3>
              <p className="text-gray-600">
                يعمل على جميع الأجهزة
                موبايل، تابلت، كمبيوتر
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ماذا يقول عملاؤنا؟ 💬
            </h2>
            <p className="text-xl text-gray-600">
              آراء حقيقية من تجار نجحوا مع رحبة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "رحبة غيرت حياتي! من متجر صغير في البيت إلى أكثر من 100 طلب شهرياً. 
                الواجهة سهلة والدعم ممتاز."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                  ف
                </div>
                <div className="mr-4">
                  <div className="font-semibold text-gray-900">فاطمة بن علي</div>
                  <div className="text-sm text-gray-500">متجر الأزياء النسائية - وهران</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "أفضل منصة جربتها! التوصيل لكل الولايات والدفع عند الاستلام 
                خلاني أوصل لعملاء ما كنتش نقدر نوصلهم قبل."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                  م
                </div>
                <div className="mr-4">
                  <div className="font-semibold text-gray-900">محمد الصالح</div>
                  <div className="text-sm text-gray-500">متجر الإلكترونيات - الجزائر العاصمة</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "الإحصائيات والتقارير ساعدوني نفهم عملائي أكثر. 
                زادت مبيعاتي 300% في 6 أشهر!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                  ع
                </div>
                <div className="mr-4">
                  <div className="font-semibold text-gray-900">عائشة مرابط</div>
                  <div className="text-sm text-gray-500">متجر مستحضرات التجميل - قسنطينة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            الخطط والأسعار 💳
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Standard</h3>
              <div className="text-4xl font-bold text-primary-600 mb-6">
                1,350 دج
                <span className="text-lg text-gray-600"> / شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>منتجات غير محدودة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>طلبات غير محدودة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>تحليلات أساسية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>دعم عبر البريد</span>
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                ابدأ الآن
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl shadow-xl text-white relative">
              <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                الأكثر شعبية
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">
                2,500 دج
                <span className="text-lg opacity-80"> / شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>كل ميزات Standard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>تحليلات متقدمة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>دعم ذو أولوية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>نطاق مخصص</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>API access</span>
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-bold"
              >
                ابدأ الآن
              </Link>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-600">
            🎁 تجربة مجانية 7 أيام - بدون بطاقة ائتمان
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-3xl font-bold mb-4">رحبة 🛍️</div>
          <p className="text-gray-400 mb-6">
            منصة جزائرية لإنشاء المتاجر الإلكترونية
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 Rahba. جميع الحقوق محفوظة 🇩🇿
          </p>
        </div>
      </footer>
    </div>
  );
}
