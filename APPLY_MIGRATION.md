# 🚨 كيفية تطبيق Migration على Production

## ⚠️ مهم جداً!

قاعدة البيانات على Production **قديمة** وتحتاج لتطبيق Migration لإضافة الأعمدة الناقصة.

---

## 🎯 الطريقة الأولى: استخدام Prisma CLI (موصى بها)

### الخطوة 1: الاتصال بـ Production Database

تأكد من أن `.env` يحتوي على DATABASE_URL الخاص بـ Production:

```bash
DATABASE_URL="postgresql://postgres.fkixzb...@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

### الخطوة 2: تشغيل Migration

```bash
cd backend
npx prisma db execute --file ./prisma/migrations/20251018_complete_schema_sync/migration.sql --schema ./prisma/schema.prisma
```

إذا فشل الأمر أعلاه، استخدم:

```bash
npx prisma db push
```

---

## 🎯 الطريقة الثانية: استخدام Supabase Dashboard

### الخطوة 1: فتح SQL Editor

1. اذهب إلى: https://supabase.com/dashboard
2. اختر مشروعك
3. اضغط على **SQL Editor** من القائمة الجانبية

### الخطوة 2: نسخ ولصق SQL Script

افتح الملف: `backend/prisma/migrations/20251018_complete_schema_sync/migration.sql`

انسخ **كل المحتوى** والصقه في SQL Editor

### الخطوة 3: تشغيل الـ Script

اضغط على **Run** أو **Ctrl+Enter**

---

## 🎯 الطريقة الثالثة: استخدام psql (للمحترفين)

```bash
psql "postgresql://postgres.fkixzb...@aws-1-us-east-1.pooler.supabase.com:5432/postgres" -f backend/prisma/migrations/20251018_complete_schema_sync/migration.sql
```

---

## ✅ التحقق من نجاح Migration

بعد تطبيق Migration، تحقق من أن الأعمدة تمت إضافتها:

```sql
-- تحقق من Product columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Product';

-- يجب أن ترى:
-- stock, comparePrice, seoKeywords, weight, etc.
```

---

## 🐛 استكشاف الأخطاء

### خطأ: "invalid enum value"
**السبب**: Migration script يحاول استخدام enum value قبل إضافته

**الحل**: شغل Migration على دفعتين:
1. أولاً: القسم الخاص بإضافة enum values
2. ثانياً: باقي الأقسام

---

### خطأ: "column already exists"
**السبب**: العمود موجود مسبقاً

**الحل**: هذا طبيعي، Migration تستخدم `ADD COLUMN IF NOT EXISTS`

---

### خطأ: "table does not exist"
**السبب**: جدول معين غير موجود

**الحل**: تأكد من أن Prisma schema محدثة وشغل:
```bash
npx prisma db push
```

---

## 🔄 بعد Migration

### 1. إعادة توليد Prisma Client

```bash
cd backend
npx prisma generate
```

### 2. إعادة Build Backend

```bash
npm run build
```

### 3. إعادة تشغيل Server

إذا كنت على Heroku/Koyeb/Render، اعمل redeploy:

```bash
git push heroku master
# أو
git push origin master
```

---

## 📊 ما الذي ستضيفه Migration؟

### للـ Product table:
- ✅ stock column
- ✅ comparePrice column  
- ✅ seoKeywords column
- ✅ weight, length, width, height columns
- ✅ shippingFee, freeShipping columns
- ✅ lowStockAlert, allowBackorder columns
- ✅ bulkPricing, badges, relatedProducts, crossSellProducts (JSON)

### جداول جديدة:
- ✅ Notification table
- ✅ PlanFeatureFlags table

### تحديثات Enum:
- ✅ SubscriptionPlan: إضافة FREE, STANDARD, PRO
- ✅ DeliveryCompany: إضافة YALIDINE, ZR_EXPRESS, JET_EXPRESS

---

## 🎉 بعد نجاح Migration

ستعمل جميع الصفحات بدون أخطاء:
- ✅ إضافة منتج
- ✅ عرض الطلبات
- ✅ واجهة المتجر
- ✅ الإعدادات العامة

---

## 📞 هل تحتاج مساعدة؟

إذا واجهت أي مشاكل:
1. تحقق من Backend logs
2. تحقق من Frontend console
3. تأكد من DATABASE_URL صحيح
4. تأكد من Prisma Client محدث

---

**✨ بالتوفيق!** 🚀
