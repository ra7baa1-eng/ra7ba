import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-3xl font-bold text-primary-600">
            رحبة 🛍️
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-gray-700 hover:text-primary-600 transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              إنشاء متجر مجاني
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            أنشئ متجرك الإلكتروني في دقائق 🚀
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            منصة متكاملة لإدارة متجرك الإلكتروني في الجزائر
            <br />
            مع دعم الدفع عند الاستلام والتوصيل لكل الولايات
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 transition shadow-lg"
            >
              ابدأ تجربة مجانية 7 أيام
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-primary-600 text-lg rounded-lg hover:bg-gray-50 transition shadow"
            >
              استكشف المميزات
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">58</div>
              <div className="text-gray-600">ولاية جزائرية</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">1,350 دج</div>
              <div className="text-gray-600">شهرياً فقط</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">دعم فني</div>
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

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
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
