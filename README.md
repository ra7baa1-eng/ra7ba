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
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api

---

## 📦 Deployment to Render.com (FREE!)

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
