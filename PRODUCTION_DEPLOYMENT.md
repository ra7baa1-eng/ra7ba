# 🚀 دليل النشر على الإنتاج | Production Deployment Guide

## 📋 نظرة عامة

هذا الدليل يشرح كيفية نشر مشروع Rahba على بيئة الإنتاج باستخدام:
- **Backend**: Railway
- **Frontend**: Vercel
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage

---

## 🎯 الخطوة 1: إعداد قاعدة البيانات (Supabase)

### 1. إنشاء مشروع جديد

1. اذهب إلى: https://supabase.com/dashboard
2. انقر على "New Project"
3. اختر اسم المشروع: `rahba-production`
4. اختر كلمة مرور قوية لقاعدة البيانات
5. اختر المنطقة الأقرب لك

### 2. الحصول على بيانات الاتصال

بعد إنشاء المشروع:

1. اذهب إلى **Settings** → **Database**
2. انسخ **Connection String** (URI):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
3. اذهب إلى **Settings** → **API**
4. انسخ:
   - `Project URL`: https://xxx.supabase.co
   - `anon public key`: eyJhbGc...
   - `service_role key`: eyJhbGc... (سري جداً!)

### 3. إنشاء Storage Bucket

1. اذهب إلى **Storage** في القائمة الجانبية
2. انقر على "Create a new bucket"
3. اسم الـ bucket: `rahba-storage`
4. اجعله **Public** (للصور والملفات العامة)

---

## 🔧 الخطوة 2: نشر Backend على Railway

### 1. إنشاء حساب Railway

1. اذهب إلى: https://railway.app
2. سجل دخول باستخدام GitHub
3. انقر على "New Project"

### 2. ربط المشروع من GitHub

1. اختر "Deploy from GitHub repo"
2. اختر repository: `ra7baa1-eng/ra7ba`
3. اختر مجلد: `backend`

### 3. إضافة متغيرات البيئة

في Railway Dashboard → Variables، أضف:

```env
# Database (من Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres?sslmode=require

# JWT (ولّد مفاتيح قوية)
JWT_SECRET=your-32-char-secret-key-here
JWT_REFRESH_SECRET=your-32-char-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=10000
NODE_ENV=production
APP_DOMAIN=https://your-frontend.vercel.app
API_URL=https://your-backend.railway.app

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=rahba-storage

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# ImgBB
IMGBB_API_KEY=your-imgbb-key

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com

# Admin
ADMIN_EMAIL=admin@rahba.com
ADMIN_PASSWORD=secure-password-here

# Flags
AUTO_MIGRATE_ON_BOOT=true
AUTO_SEED_ON_BOOT=false
MAINTENANCE_CREATE_ADMIN_ON_BOOT=true
```

### 4. الحصول على Backend URL

بعد النشر:
1. انسخ الـ URL من Railway Dashboard
2. مثال: `https://rahba-backend-production.up.railway.app`
3. احفظه للاستخدام في Frontend

---

## 🎨 الخطوة 3: نشر Frontend على Vercel

### 1. إنشاء حساب Vercel

1. اذهب إلى: https://vercel.com
2. سجل دخول باستخدام GitHub
3. انقر على "Add New Project"

### 2. استيراد المشروع

1. اختر repository: `ra7baa1-eng/ra7ba`
2. في **Root Directory**، اختر: `frontend`
3. **Framework Preset**: Next.js
4. انقر على "Deploy"

### 3. إضافة متغيرات البيئة

في Vercel Dashboard → Settings → Environment Variables:

```env
# Backend URL (من Railway)
NEXT_PUBLIC_API_URL=https://rahba-backend-production.up.railway.app/api
NEXT_PUBLIC_APP_DOMAIN=https://your-frontend.vercel.app
NEXT_PUBLIC_APP_NAME=Rahba

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# ImgBB
NEXT_PUBLIC_IMGBB_KEY=your-imgbb-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### 4. إعادة النشر

بعد إضافة المتغيرات:
1. اذهب إلى **Deployments**
2. انقر على "Redeploy" على آخر deployment
3. انتظر اكتمال النشر

---

## ✅ الخطوة 4: التحقق من النشر

### 1. اختبار Backend

افتح المتصفح واذهب إلى:
```
https://your-backend.railway.app/api
```

يجب أن ترى:
```json
{
  "status": "ok",
  "message": "Rahba API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. اختبار Frontend

افتح:
```
https://your-frontend.vercel.app
```

يجب أن ترى الصفحة الرئيسية بدون أخطاء.

### 3. اختبار تسجيل الدخول

1. اذهب إلى: `https://your-frontend.vercel.app/auth/login`
2. جرب تسجيل الدخول بحساب Admin:
   - Email: `admin@rahba.com`
   - Password: (الذي أضفته في متغيرات البيئة)

---

## 🔍 حل المشاكل الشائعة

### ❌ مشكلة: "Cannot connect to database"

**الحل:**
1. تحقق من `DATABASE_URL` في Railway
2. تأكد من أن Supabase database يعمل
3. تحقق من أن IP الخاص بـ Railway مسموح في Supabase

### ❌ مشكلة: "CORS error"

**الحل:**
1. تحقق من `CORS_ORIGINS` في Backend
2. أضف Frontend URL الصحيح
3. أعد نشر Backend

### ❌ مشكلة: "Cannot find module"

**الحل:**
1. تأكد من أن جميع dependencies مثبتة
2. في Railway/Vercel، أعد النشر
3. تحقق من `package.json`

### ❌ مشكلة: "Authentication failed"

**الحل:**
1. تحقق من Clerk keys
2. تأكد من أن `CLERK_SECRET_KEY` صحيح
3. تحقق من أن Clerk domain مضاف في Dashboard

---

## 📊 مراقبة الأداء

### Railway Logs

للتحقق من logs في Railway:
1. اذهب إلى Project Dashboard
2. انقر على Service
3. اذهب إلى "Logs"

### Vercel Analytics

لمراقبة Frontend:
1. اذهب إلى Vercel Dashboard
2. انقر على Project
3. اذهب إلى "Analytics"

---

## 🔐 الأمان

### 1. تأمين المفاتيح

- ✅ لا تشارك `service_role_key` أبداً
- ✅ استخدم مفاتيح `live` في الإنتاج فقط
- ✅ غيّر جميع كلمات المرور الافتراضية

### 2. HTTPS

- ✅ Railway و Vercel يوفران HTTPS تلقائياً
- ✅ تأكد من استخدام `https://` في جميع URLs

### 3. Environment Variables

- ✅ لا تضع أسرار في الكود
- ✅ استخدم متغيرات البيئة فقط
- ✅ لا ترفع `.env` إلى Git

---

## 🎉 تهانينا!

مشروعك الآن يعمل على الإنتاج! 🚀

**URLs الخاصة بك:**
- Frontend: `https://your-frontend.vercel.app`
- Backend API: `https://your-backend.railway.app/api`
- API Docs: `https://your-backend.railway.app/api/docs`
- Database: Supabase Dashboard

**الخطوات التالية:**
1. إضافة custom domain
2. إعداد monitoring و alerts
3. إعداد backups تلقائية
4. تفعيل analytics

---

**💡 للدعم:** راجع ملفات `RAILWAY_FIX.md` و `README.md` في المشروع.
