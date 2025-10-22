# 🛍️ رحبة - Rahba

<div dir="rtl">

## منصة SaaS Multi-Tenant للتجارة الإلكترونية - السوق الجزائرية

**رحبة** هي منصة متكاملة لإنشاء المتاجر الإلكترونية، مصممة خصيصاً للسوق الجزائرية مع دعم كامل للغة العربية (RTL).

</div>

---

## 🌟 Features | الميزات

### 🏪 **Multi-Tenant Architecture**
- كل تاجر له متجره المستقل (subdomain)
- عزل كامل للبيانات بين التجار
- إدارة مركزية من Super Admin

### 💰 **Subscription Plans | خطط الاشتراك**
- **Standard**: 1,350 DZD/month
- **Pro**: 2,500 DZD/month (all features)
- **Trial**: 7 days free (20 orders, 10 products max)

### 💳 **Payment Methods | طرق الدفع**
- **للتجار**: BaridiMob (موافقة يدوية من الأدمن)
- **للعملاء**: الدفع عند الاستلام (COD) فقط

### 🚚 **Delivery | التوصيل**
- تغطية شاملة لـ **58 ولاية جزائرية**
- تكامل مع: Yalidine, Zr Express, JetExpress
- رسوم توصيل قابلة للتخصيص لكل ولاية

---

## 🛠️ Tech Stack | التقنيات المستخدمة

### **Backend**
- NestJS (Node.js, TypeScript)
- PostgreSQL with Prisma ORM
- JWT Authentication with Refresh Tokens
- Multi-tenant Middleware
- Cron Jobs for subscription management

### **Frontend**
- Next.js 14+ (React, TypeScript)
- TailwindCSS with RTL support
- Arabic-first UI/UX
- Responsive design

### **Deployment**
- Railway (Backend + Frontend + Database)
- GitHub (Version Control)
- GitHub Actions (CI/CD)
- Docker support

### **Storage**
- Supabase Storage / Railway Volume
- Image optimization

---

## 📦 Project Structure | هيكل المشروع

```
rahba/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── auth/      # Authentication module
│   │   ├── tenant/    # Multi-tenant logic
│   │   ├── admin/     # Super admin module
│   │   ├── merchant/  # Merchant dashboard
│   │   ├── product/   # Product management
│   │   ├── order/     # Order management
│   │   ├── subscription/ # Billing & plans
│   │   ├── delivery/  # Delivery integration
│   │   └── common/    # Shared utilities
│   ├── prisma/        # Database schema
│   └── package.json
│
├── frontend/          # Next.js App
│   ├── src/
│   │   ├── app/       # App router
│   │   ├── components/# Reusable components
│   │   ├── layouts/   # RTL layouts
│   │   ├── features/  # Feature modules
│   │   │   ├── admin/    # Super admin UI
│   │   │   ├── merchant/ # Merchant dashboard
│   │   │   └── store/    # Customer storefront
│   │   └── lib/       # Utilities
│   └── package.json
│
├── docker-compose.yml # Local development
├── .github/           # CI/CD workflows
└── README.md
```

---

## 🚀 Quick Start | البدء السريع

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ra7ba.git
cd ra7ba
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:10000/api
- API Docs: http://localhost:10000/api

---

## 🚂 Railway Deployment | النشر على Railway

### Prerequisites | المتطلبات الأساسية

1. **Railway Account**: سجل حساب مجاني على [railway.app](https://railway.app)
2. **Railway CLI**: `npm i -g @railway/cli`
3. **GitHub Repository**: ارفع الكود إلى GitHub

### Quick Deploy | النشر السريع

#### 1. ربط المشروع
```bash
railway login
railway init
railway link
```

#### 2. إضافة قاعدة البيانات
```bash
railway add postgresql
```

#### 3. إعداد متغيرات البيئة

انسخ هذه المتغيرات وقم بتخصيصها:

```bash
# Database (Railway will provide these)
railway variables set DATABASE_URL="${{ DATABASE_URL }}"
railway variables set DIRECT_URL="${{ DIRECT_URL }}"

# Authentication
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-in-production"
railway variables set JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# Clerk Authentication
railway variables set CLERK_PUBLISHABLE_KEY="pk_test_your-clerk-key"
railway variables set CLERK_SECRET_KEY="sk_test_your-clerk-secret"

# Email Service
railway variables set SMTP_HOST="smtp.gmail.com"
railway variables set SMTP_PORT="587"
railway variables set SMTP_USER="your-email@gmail.com"
railway variables set SMTP_PASS="your-16-character-app-password"

# File Upload
railway variables set IMGBB_API_KEY="your-imgbb-api-key"

# Payment Processing
railway variables set STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-key"
railway variables set STRIPE_SECRET_KEY="sk_test_your-stripe-secret"
railway variables set STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Supabase Integration
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
railway variables set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

#### 4. النشر
```bash
railway up
```

#### 5. مراقبة السجلات
```bash
railway logs
```

### ملفات Railway | Railway Files

```
backend/
├── Dockerfile              # Multi-stage build محسن
├── railway.toml            # تكوين Railway
├── nixpacks.toml           # تكوين Nixpacks
├── .dockerignore           # استبعاد الملفات غير الضرورية
└── RAILWAY_DEPLOYMENT.md   # دليل النشر المفصل
```

### استكشاف الأخطاء | Troubleshooting

**خطأ في قاعدة البيانات:**
```bash
# التحقق من حالة قاعدة البيانات
railway status

# إعادة بناء قاعدة البيانات
railway run npx prisma migrate deploy
```

**خطأ في متغيرات البيئة:**
```bash
# عرض جميع المتغيرات
railway variables

# تحديث متغير
railway variables set VARIABLE_NAME="new-value"
```

**خطأ في البناء:**
```bash
# إعادة بناء التطبيق
railway up --build

# مراقبة سجلات البناء
railway logs --tail
```

---

## 📦 Project Structure | هيكل المشروع

```
rahba/
├── backend/                    # NestJS API
│   ├── src/                    # كود المصدر
│   │   ├── modules/            # وحدات التطبيق
│   │   │   ├── auth/           # المصادقة والتفويض
│   │   │   ├── tenant/         # نظام متعدد المستأجرين
│   │   │   ├── admin/          # لوحة المدير العام
│   │   │   ├── merchant/       # لوحة التاجر
│   │   │   ├── product/        # إدارة المنتجات
│   │   │   ├── order/          # إدارة الطلبات
│   │   │   ├── subscription/   # نظام الاشتراكات
│   │   │   ├── delivery/       # تكامل التوصيل
│   │   │   └── common/         # المكتبات المشتركة
│   ├── prisma/                 # قاعدة البيانات
│   ├── scripts/                # سكريبتات مساعدة
│   ├── Dockerfile              # Docker للإنتاج
│   ├── railway.toml            # تكوين Railway
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── src/                    # كود المصدر
│   │   ├── app/                # صفحات التطبيق (App Router)
│   │   ├── components/         # المكونات المشتركة
│   │   │   ├── ui/             # مكونات UI الأساسية
│   │   │   ├── dashboard/      # لوحة التحكم
│   │   │   ├── products/       # مكونات المنتجات
│   │   │   └── editor/         # محرر النصوص الغني
│   │   ├── contexts/           # React Contexts
│   │   ├── hooks/              # Custom Hooks
│   │   ├── lib/                # المكتبات المساعدة
│   │   └── styles/             # أنماط CSS
│   ├── public/                 # الملفات الثابتة
│   └── package.json
│
├── docker-compose.yml          # Docker Compose محلي
├── docker-compose.railway.yml  # Docker Compose لـ Railway
├── .github/                    # CI/CD workflows
└── README.md                   # هذا الملف
```

---

## 🛠️ Tech Stack | التقنيات المستخدمة

### **Backend (NestJS)**
- **Framework**: NestJS 10+ مع TypeScript
- **Database**: PostgreSQL 15+ مع Prisma ORM
- **Authentication**: JWT مع Refresh Tokens
- **File Upload**: Multer مع ImgBB API
- **Payment**: Stripe SDK
- **Email**: Nodemailer مع SMTP
- **Real-time**: Supabase Realtime
- **Caching**: Redis (اختياري)
- **Testing**: Jest مع Supertest

### **Frontend (Next.js)**
- **Framework**: Next.js 14+ مع App Router
- **Styling**: TailwindCSS مع RTL
- **UI Components**: shadcn/ui مخصص
- **Icons**: Lucide React
- **Charts**: Recharts (للتحليلات)
- **Forms**: React Hook Form مع Zod
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Rich Text Editor**: React Quill

### **DevOps & Deployment**
- **Containerization**: Docker Multi-stage
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Railway
- **Database**: PostgreSQL (Railway)
- **File Storage**: Supabase Storage
- **Monitoring**: Railway Logs
- **Domain**: Custom domains + subdomains

### **External Services**
- **Authentication**: Clerk
- **Database**: PostgreSQL (Railway)
- **File Storage**: ImgBB / Supabase
- **Payment**: Stripe
- **Email**: Gmail SMTP
- **Maps**: Google Maps API
- **Analytics**: Custom analytics

---

## 🔐 Authentication Flow | نظام المصادقة

### **التسجيل والاشتراك**
1. **تسجيل التاجر**: إنشاء حساب مع اختيار خطة اشتراك
2. **فترة تجريبية**: 7 أيام مجاناً (حدود: 20 طلب، 10 منتجات)
3. **دفع الاشتراك**: رفع إثبات دفع BaridiMob
4. **موافقة الأدمن**: مراجعة وتفعيل الاشتراك
5. **تجديد تلقائي**: إشعار قبل انتهاء الاشتراك

### **الأدوار والصلاحيات**
- **Super Admin**: إدارة المنصة كاملة
- **Merchant**: إدارة متجره الخاص
- **Customer**: تصفح وشراء المنتجات

---

## 🇩🇿 Algerian Market Features | ميزات خاصة بالسوق الجزائري

### **التغطية الجغرافية**
- ✅ تغطية شاملة لـ **58 ولاية جزائرية**
- ✅ عناوين مفصلة بالعربية
- ✅ رسوم توصيل مخصصة لكل ولاية
- ✅ خرائط تفاعلية مع تحديد الموقع

### **طرق الدفع**
- **للتجار**: BaridiMob (موافقة يدوية)
- **للعملاء**: الدفع عند الاستلام (COD)
- **Stripe**: للمدفوعات الدولية (اختياري)

### **شركاء التوصيل**
- Yalidine API (رسمي)
- Zr Express API
- JetExpress API
- Mock API للتطوير والاختبار

### **العملة واللغة**
- الدينار الجزائري (DZD) فقط
- عرض الأسعار بالصيغة المحلية
- دعم كامل للغة العربية (RTL)
- ترجمة شاملة للواجهات

---

## 📊 Database Schema | قاعدة البيانات

### **نظام متعدد المستأجرين**
كل جدول يحتوي على `tenantId` لعزل البيانات:

```prisma
model Tenant {
  id          String   @id @default(uuid())
  subdomain   String   @unique
  name        String
  nameAr      String?
  logo        String?
  banner      String?
  phone       String?
  address     String?
  status      TenantStatus @default(TRIAL)

  // Relations
  subscription Subscription?
  products     Product[]
  orders       Order[]
  customers    Customer[]

  @@map("tenants")
}

model Product {
  id            String   @id @default(uuid())
  tenantId      String   // عزل المستأجرين
  name          String
  nameAr        String?
  description   String?
  descriptionAr String?
  price         Decimal  @db.Decimal(10,2)
  comparePrice  Decimal? @db.Decimal(10,2)
  stock         Int      @default(0)

  // SEO & Marketing
  slug          String?  @unique
  metaTitle     String?
  metaDescription String?
  seoKeywords   String?

  // Shipping & Dimensions
  weight        Decimal? @db.Decimal(10,2)
  weightUnit    WeightUnit? @default(KG)
  length        Decimal? @db.Decimal(10,2)
  width         Decimal? @db.Decimal(10,2)
  height        Decimal? @db.Decimal(10,2)
  dimensionUnit DimensionUnit? @default(CM)
  shippingFee   Decimal? @db.Decimal(10,2)
  freeShipping  Boolean  @default(false)

  // Advanced Stock
  lowStockAlert Int?     @default(5)
  allowBackorder Boolean @default(false)

  // Features
  bulkPricing   Json?    // تسعير متدرج
  badges        Json?    // شارات المنتج
  relatedProducts Json?  // منتجات مرتبطة
  crossSellProducts Json? // منتجات مكملة

  // Relations
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  category      Category? @relation(fields: [categoryId], references: [id])
  categoryId    String?

  @@map("products")
}
```

---

## 🔄 API Endpoints | نقاط نهاية API

### **Authentication | المصادقة**
```
POST /api/auth/login                    # تسجيل الدخول
POST /api/auth/register/merchant        # تسجيل تاجر جديد
POST /api/auth/refresh                  # تجديد الـ token
GET  /api/auth/profile                  # ملف المستخدم
```

### **Merchant Dashboard | لوحة التاجر**
```
GET  /api/merchant/dashboard            # لوحة التحكم الرئيسية
GET  /api/merchant/stats                # الإحصائيات
GET  /api/merchant/trial-limits         # حدود الفترة التجريبية

# Products | المنتجات
GET    /api/merchant/products           # قائمة المنتجات
POST   /api/merchant/products           # إضافة منتج
GET    /api/merchant/products/:id       # تفاصيل منتج
PATCH  /api/merchant/products/:id       # تحديث منتج
DELETE /api/merchant/products/:id       # حذف منتج

# Orders | الطلبات
GET    /api/merchant/orders             # قائمة الطلبات
GET    /api/merchant/orders/:id         # تفاصيل طلب
PATCH  /api/merchant/orders/:id         # تحديث حالة الطلب

# Settings | الإعدادات
PATCH  /api/merchant/store/settings     # تحديث إعدادات المتجر
```

### **Storefront | واجهة المتجر**
```
GET  /api/store/:subdomain              # معلومات المتجر
GET  /api/store/:subdomain/products     # قائمة المنتجات
GET  /api/store/:subdomain/products/:slug # تفاصيل منتج
POST /api/store/:subdomain/orders       # إنشاء طلب جديد
```

### **Admin Panel | لوحة المدير**
```
GET  /api/admin/tenants                 # قائمة التجار
POST /api/admin/tenants/:id/suspend     # تعليق متجر
POST /api/admin/tenants/:id/activate    # تفعيل متجر
GET  /api/admin/stats                   # إحصائيات المنصة
```

---

## 🎯 Three Dashboards | ثلاث لوحات تحكم

### 1️⃣ **Super Admin Panel** | لوحة المدير العام
- إدارة شاملة للمنصة والتجار
- الموافقة على طلبات الاشتراك
- إدارة الخطط والأسعار
- تحليلات المنصة كاملة
- نظام التقارير والإشعارات

### 2️⃣ **Merchant Dashboard** | لوحة التاجر
- إدارة المتجر والعلامة التجارية
- إدارة شاملة للمنتجات والمخزون
- تتبع الطلبات وإدارة الشحنات
- تحليلات المبيعات والعملاء
- إدارة الاشتراك والمدفوعات

### 3️⃣ **Customer Storefront** | واجهة العميل
- تصفح المنتجات بالعربية (RTL)
- سلة تسوق ذكية مع حفظ البيانات
- نظام دفع آمن ومريح
- تتبع الطلبات والشحنات
- تقييم المنتجات والمراجعات

---

## 🔧 الأوامر المفيدة

### Backend | الباكند
```bash
# تطوير
npm run start:dev        # تشغيل مع إعادة تحميل
npm run start:debug      # تشغيل مع تصحيح الأخطاء

# إنتاج
npm run build           # بناء المشروع
npm run start:prod      # تشغيل في الإنتاج
npm run start:railway   # تشغيل خاص بـ Railway

# قاعدة البيانات
npx prisma studio       # واجهة قاعدة البيانات
npx prisma migrate dev  # تطبيق الـ migrations
npx prisma db seed      # ملء البيانات الأولية

# اختبارات
npm run test            # تشغيل الاختبارات
npm run test:cov        # تغطية الاختبارات
```

### Frontend | الفرونتند
```bash
# تطوير
npm run dev             # تشغيل مع إعادة تحميل
npm run build           # بناء للإنتاج
npm run start           # تشغيل في الإنتاج

# تحليل
npm run lint            # فحص الأخطاء
npm run type-check      # فحص الأنواع
```

### Railway | السكك الحديدية
```bash
railway login           # تسجيل الدخول
railway link            # ربط المشروع
railway up              # النشر
railway logs            # مراقبة السجلات
railway variables       # عرض المتغيرات
railway status          # حالة الخدمات
```

---

## 🚢 Deployment | النشر

### **Railway Deployment** | النشر على Railway

#### خطوات النشر

1. **ربط المستودع**
```bash
railway login
railway link
```

2. **إضافة قاعدة البيانات**
```bash
railway add postgresql
```

3. **إعداد متغيرات البيئة**
```bash
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="${{ DATABASE_URL }}"
# أضف باقي المتغيرات المطلوبة من القائمة أعلاه
```

4. **النشر**
```bash
railway up
```

5. **مراقبة السجلات**
```bash
railway logs
```

#### تكوين Railway | Railway Configuration

```
backend/
├── Dockerfile              # Multi-stage build محسن
├── railway.toml            # تكوين Railway
├── nixpacks.toml           # تكوين Nixpacks لبناء أسرع
├── .dockerignore           # استبعاد الملفات غير الضرورية
└── RAILWAY_DEPLOYMENT.md   # دليل النشر المفصل
```

#### ميزات Railway | Railway Features
- ✅ **مجاني تماماً** - بدون بطاقة ائتمان
- ✅ **قاعدة بيانات مجانية** - PostgreSQL 1GB
- ✅ **نشر تلقائي** من GitHub
- ✅ **SSL مجاني** - HTTPS تلقائي
- ✅ **توسع تلقائي** حسب الحمل
- ✅ **سجلات مفصلة** للتتبع
- ✅ **متغيرات محمية** للأسرار

---

## 📈 Roadmap | خارطة الطريق

### **المرحلة الحالية** ✅
- [x] نظام متعدد المستأجرين
- [x] نظام اشتراكات متكامل
- [x] ثلاث لوحات تحكم كاملة
- [x] دفع عند الاستلام (COD)
- [x] تغطية 58 ولاية جزائرية
- [x] واجهة عربية كاملة (RTL)
- [x] تكامل مع Clerk للمصادقة
- [x] نظام ملفات مع ImgBB
- [x] تكامل مع Stripe للمدفوعات
- [x] نظام إشعارات تيليجرام
- [x] نظام توصيل متكامل

### **المرحلة التالية** 🚧
- [ ] تطبيق جوال (React Native)
- [ ] تحليلات متقدمة مع رسوم بيانية
- [ ] أدوات تسويقية متكاملة
- [ ] دعم متعدد العملات
- [ ] تكامل مع المزيد من شركاء التوصيل
- [ ] نظام إدارة المخزون المتقدم
- [ ] برنامج ولاء العملاء
- [ ] تكامل مع وسائل التواصل الاجتماعي

---

## 🤝 Contributing | المساهمة

نرحب بالمساهمات! يرجى قراءة إرشادات المساهمة:

1. Fork المشروع
2. إنشاء branch للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الـ branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### إرشادات التطوير
- استخدم TypeScript دائماً
- اتبع أسلوب الكود المحدد في ESLint
- أضف اختبارات للميزات الجديدة
- وثق الـ API endpoints الجديدة
- اختبر على جميع المتصفحات الرئيسية

---

## 📄 License | الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف LICENSE للتفاصيل.

---

## 📞 Support | الدعم

### **التواصل معنا**
- 📧 **البريد الإلكتروني**: support@rahba.com
- 📚 **التوثيق**: [docs.rahba.com](https://docs.rahba.com)
- 💬 **تيليجرام**: [@rahba_support](https://t.me/rahba_support)
- 🐛 **التقارير**: [GitHub Issues](https://github.com/rahba/issues)

### **التوثيق الفني**
- [دليل المطور](https://docs.rahba.com/developer-guide)
- [API Documentation](https://docs.rahba.com/api)
- [نشر على Railway](https://docs.rahba.com/deployment/railway)

---

## 🎉 ابدأ رحلتك في التجارة الإلكترونية مع **رحبة**!

**منصة جزائرية 🇩🇿 | بتقنيات عالمية 🌍**

### **لماذا رحبة؟**
- ✅ **مجاني تماماً** لبدء التشغيل
- ✅ **سهولة الاستخدام** مع واجهة عربية
- ✅ **دعم فني متميز** باللغة العربية
- ✅ **تغطية شاملة** للجزائر كاملة
- ✅ **أمان عالي** لحماية بياناتك
- ✅ **توسع سلس** حسب نمو أعمالك

### **ابدأ الآن مجاناً!**
1. سجل حسابك كتاجر
2. أنشئ متجرك في دقائق
3. أضف منتجاتك الأولى
4. ابدأ في بيع منتجاتك!

---

**تم تطوير هذا المشروع بحب ❤️ لخدمة التجار في الجزائر والمنطقة العربية** 🇩🇿

### Quick Deploy:

See **[DEPLOY_RENDER.md](./DEPLOY_RENDER.md)** for detailed deployment instructions.

For a super simple guide in Arabic: **[نشر_راندر_سريع.txt](./نشر_راندر_سريع.txt)**

### Why Render?
- ✅ **100% Free** - No credit card required
- ✅ **PostgreSQL included** - 1GB free database
- ✅ **Auto-deploy** from GitHub
- ✅ **Free SSL** - HTTPS automatic
- ✅ **Easy setup** - 10 minutes total

---

## 🎯 Three Dashboards | ثلاث لوحات

### 1️⃣ **Super Admin Panel** | لوحة المدير العام
- إدارة جميع التجار والمتاجر
- الموافقة/رفض طلبات الاشتراك
- إعدادات النظام (الخطط، الأسعار)
- تحليلات شاملة للمنصة

### 2️⃣ **Merchant Dashboard** | لوحة التاجر
- إدارة المتجر (لوجو، ثيم، subdomain)
- إدارة المنتجات (إضافة، تعديل، حذف)
- إدارة الطلبات وتتبع الشحنات
- تحليلات المبيعات
- إدارة الاشتراك ورفع إثبات الدفع

### 3️⃣ **Customer Storefront** | واجهة العميل
- تصفح المنتجات (عربي RTL)
- سلة التسوق والدفع
- تتبع الطلبات
- دعم الدفع عند الاستلام (COD)

---

## 🔐 Authentication Flow | نظام المصادقة

1. **Merchant Registration**: تسجيل التاجر → اختيار خطة → فترة تجريبية 7 أيام
2. **Subscription**: رفع إثبات دفع BaridiMob → موافقة الأدمن → تفعيل الاشتراك
3. **Trial Limits**: 20 طلب و 10 منتجات كحد أقصى
4. **Expiry**: تعليق المتجر تلقائياً عند انتهاء الاشتراك

---

## 🇩🇿 Algerian Features | ميزات خاصة بالجزائر

### **58 Wilaya Coverage**
- قائمة كاملة بالولايات الـ58
- رسوم توصيل مخصصة لكل ولاية
- دعم العنونة بالعربية

### **Payment Integration**
- **BaridiMob**: نظام الدفع الوطني للتجار
- **COD**: الدفع عند الاستلام للعملاء

### **Delivery Partners**
- Yalidine API
- Zr Express API
- JetExpress API
- Mock API للتطوير

### **Currency**
- الدينار الجزائري (DZD) فقط
- عرض الأسعار بالصيغة الجزائرية

---

## 📊 Database Schema | قاعدة البيانات

```prisma
// Multi-tenant with tenant_id in all tables
model Tenant {
  id          String   @id @default(uuid())
  subdomain   String   @unique
  name        String
  logo        String?
  theme       Json?
  status      TenantStatus
  // ... relations
}

model Subscription {
  id          String   @id @default(uuid())
  tenantId    String
  plan        Plan
  status      SubscriptionStatus
  expiresAt   DateTime
  // ... relations
}

model Product {
  id          String   @id @default(uuid())
  tenantId    String   // Tenant isolation
  name        String
  price       Decimal
  // ... fields
}

// ... more models
```

---

## 🔄 CI/CD Pipeline | خط الإنتاج

### **GitHub Actions Workflow**
```yaml
- Build & Test
- Docker Build
- Deploy to Railway
- Database Migrations
- Health Check
```

---

## 📝 Environment Variables | المتغيرات

### **Backend (.env)**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
BARIDIMOB_API_KEY=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_APP_DOMAIN=...
```

---

## 🚢 Deployment | النشر

### **Railway Deployment**
1. Connect GitHub repository
2. Configure environment variables
3. Deploy backend service
4. Deploy frontend service
5. Setup custom domain + subdomains
6. Configure PostgreSQL database

### **Subdomain Setup**
- Main app: `app.rahba.com`
- Merchant stores: `{subdomain}.rahba.com`
- Admin panel: `admin.rahba.com`

---

## 📈 Roadmap | خارطة الطريق

- [x] Multi-tenant architecture
- [x] Subscription system
- [x] Three dashboards
- [x] COD payment
- [x] 58 Wilaya delivery
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Marketing tools
- [ ] Multi-currency support

---

## 🤝 Contributing | المساهمة

Contributions are welcome! Please read our contributing guidelines.

---

## 📄 License | الترخيص

This project is licensed under the MIT License.

---

## 📞 Support | الدعم

- Email: support@ra7ba.dz
- Documentation: docs.ra7ba.dz
- Telegram: @ra7ba_support
- Documentation: docs.rahba.dz
- Telegram: @rahba_support

---

<div dir="rtl">

## 🎉 ابدأ رحلتك في التجارة الإلكترونية مع **رحبة**!

**منصة جزائرية 🇩🇿 | بتقنيات عالمية 🌍**

</div>

---

**Made with ❤️ for Algeria** 🇩🇿
