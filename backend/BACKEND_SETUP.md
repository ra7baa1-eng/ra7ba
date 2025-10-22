# 🚀 Backend Setup Guide | دليل إعداد الخادم الخلفي

## 📋 المشاكل المحلولة

### ✅ إصلاح مشكلة تسجيل الدخول
- تم تحديث ملف `.env.example` ليشمل الإعدادات الصحيحة
- تم إضافة Clerk authentication configuration
- تم تحديث PORT إلى 10000 ليتناسب مع الـ frontend

### ✅ إصلاح مشاكل قاعدة البيانات
- تم إضافة إعدادات محلية وإنتاجية
- تم إضافة maintenance flags للتطوير

## 🛠️ إعداد البيئة للتطوير المحلي

### 1. تثبيت PostgreSQL (محلي)

**لـ Windows:**
1. حمل PostgreSQL من [postgresql.org](https://www.postgresql.org/download/windows/)
2. قم بالتثبيت وتذكر كلمة مرور المستخدم
3. افتح pgAdmin أو psql وقم بإنشاء قاعدة بيانات جديدة

**لـ macOS:**
```bash
brew install postgresql
brew services start postgresql
createdb rahba
```

**لـ Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb rahba
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your-password';"
```

### 2. إنشاء ملف البيئة

**انسخ محتويات `.env.example` إلى `.env`:**

```bash
# في مجلد backend
cp .env.example .env
```

**ثم قم بتعديل `.env` مع القيم التالية:**

```env
# Database Configuration (استبدل بالبيانات الحقيقية)
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/rahba?schema=public&sslmode=prefer"
DIRECT_URL="postgresql://postgres:your-password@localhost:5432/rahba?schema=public&sslmode=prefer"

# JWT Configuration (استبدل بمفاتيح قوية)
JWT_SECRET="your-super-secret-jwt-key-32-chars-min"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-32-chars-min"

# Application Configuration
PORT=10000
NODE_ENV=development

# Clerk Authentication (احصل على مفاتيح من clerk.com)
CLERK_PUBLISHABLE_KEY="pk_test_your-clerk-key"
CLERK_SECRET_KEY="sk_test_your-clerk-secret"

# ImgBB API (احصل على مفتاح مجاني من imgbb.com)
IMGBB_API_KEY="your-imgbb-api-key"

# Stripe (للمدفوعات)
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret"

# Email (استخدم Gmail أو أي خدمة SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Admin Setup
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

### 3. تثبيت التبعيات

```bash
# في مجلد backend
npm install
```

### 4. إعداد قاعدة البيانات

```bash
# توليد Prisma Client
npx prisma generate

# تطبيق الـ migrations
npx prisma migrate dev

# ملء البيانات الأولية (اختياري)
npx prisma db seed
```

### 5. تشغيل الخادم

```bash
# للتطوير (مع إعادة تحميل تلقائي)
npm run start:dev

# للإنتاج
npm run start:prod

# للتصحيح
npm run start:debug
```

## 🖥️ التحقق من الخادم

### تأكد من أن الخادم يعمل على:

```bash
# التحقق من أن الخادم يعمل
curl http://localhost:10000/api

# يجب أن ترى:
{
  "status": "ok",
  "message": "Rahba API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### API Endpoints المهمة:

- **API Health**: http://localhost:10000/api
- **Swagger Docs**: http://localhost:10000/api/docs
- **Auth Login**: http://localhost:10000/api/auth/login (POST)
- **Auth Register**: http://localhost:10000/api/auth/register/merchant (POST)

## 🔧 حل المشاكل الشائعة

### مشكلة: "Connection refused" أو "ECONNREFUSED"

**الحل:**
1. تأكد من تشغيل PostgreSQL: `sudo systemctl status postgresql`
2. تحقق من الـ connection string في `.env`
3. تأكد من أن قاعدة البيانات `rahba` موجودة

### مشكلة: "Failed to compile" أو TypeScript errors

**الحل:**
```bash
# تنظيف وإعادة تثبيت
rm -rf node_modules package-lock.json
npm install

# إعادة توليد Prisma
npx prisma generate

# إعادة تشغيل
npm run start:dev
```

### مشكلة: "Environment variables not found"

**الحل:**
1. تأكد من وجود ملف `.env` في مجلد backend
2. تحقق من أن جميع المتغيرات المطلوبة موجودة
3. أعد تشغيل الخادم

### مشكلة: Prisma errors

**الحل:**
```bash
# إعادة تعيين قاعدة البيانات (حذار!)
npx prisma migrate reset

# أو تطبيق migrations يدوياً
npx prisma migrate deploy

# أو إعادة توليد Prisma
npx prisma generate
```

## 📊 قاعدة البيانات

### للتحقق من قاعدة البيانات:

```bash
# فتح Prisma Studio (واجهة رسومية)
npx prisma studio

# أو استخدام psql مباشرة
psql -h localhost -U postgres -d rahba
```

### إنشاء Admin User تلقائياً:

عند تشغيل الخادم لأول مرة مع `MAINTENANCE_CREATE_ADMIN_ON_BOOT=true`، سيتم إنشاء admin user تلقائياً.

## 🚀 للإنتاج (Railway)

عند النشر على Railway:

1. **أضف PostgreSQL service**
2. **انسخ متغيرات البيئة من Railway dashboard**
3. **استخدم نفس `.env.example` لكن مع قيم Railway**

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من logs: `npm run start:dev` (يظهر logs مفصلة)
2. راجع console.log في المتصفح
3. تأكد من إعدادات قاعدة البيانات
4. تحقق من متغيرات البيئة

---
**🎉 الخادم جاهز للاستخدام!**
