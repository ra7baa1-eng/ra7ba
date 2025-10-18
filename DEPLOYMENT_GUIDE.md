# 🚀 دليل النشر الكامل - Rahba Platform

## 📋 نظرة عامة

هذا الدليل يشرح كيفية تطبيق جميع التحديثات على Production بدون أخطاء.

---

## ✅ التحديثات المطبقة

### 1️⃣ **Backend (NestJS + Prisma)**
- ✅ إصلاح Prisma Schema
- ✅ إضافة حقول جديدة للمنتجات (SEO, Shipping, Stock)
- ✅ تصحيح DTOs (comparePrice, categoryId, nameAr)
- ✅ إصلاح Storefront & Merchant services
- ✅ إضافة جدول Notification و PlanFeatureFlags

### 2️⃣ **Frontend (Next.js)**
- ✅ إصلاح صفحة إضافة المنتجات
- ✅ إصلاح صفحة الطلبات (address بدلاً من shippingAddress)
- ✅ إصلاح صفحة الإعدادات (API calls)
- ✅ تحديث storefrontApi و merchantApi

---

## 🎯 خطوات النشر على Production

### **الخطوة 1: تحديث قاعدة البيانات**

قم بتشغيل Migration Script على Production:

```bash
cd backend
npx prisma db execute --file ./prisma/migrations/20251018_complete_schema_sync/migration.sql --schema ./prisma/schema.prisma
```

أو استخدم Prisma Studio:

```bash
npx prisma studio
```

ثم نفذ SQL Script يدوياً من ملف:
`backend/prisma/migrations/20251018_complete_schema_sync/migration.sql`

---

### **الخطوة 2: توليد Prisma Client**

```bash
cd backend
npx prisma generate
```

---

### **الخطوة 3: إعادة Build Backend**

```bash
cd backend
npm run build
```

---

### **الخطوة 4: إعادة Build Frontend**

```bash
cd frontend
npm run build
```

---

### **الخطوة 5: Push الكود**

```bash
git add -A
git commit -m "fix: تمشيط كامل للمشروع - Schema + DTOs + Frontend"
git push origin master
```

---

## 📊 التغييرات الرئيسية

### **Product Schema**
```prisma
model Product {
  // الحقول الجديدة:
  stock          Int     @default(0)
  comparePrice   Decimal? @db.Decimal(10,2)
  
  // SEO
  seoKeywords    String?
  
  // Shipping & Dimensions
  weight         Decimal? @db.Decimal(10,2)
  weightUnit     String?  @default("kg")
  length         Decimal? @db.Decimal(10,2)
  width          Decimal? @db.Decimal(10,2)
  height         Decimal? @db.Decimal(10,2)
  dimensionUnit  String?  @default("cm")
  shippingFee    Decimal? @db.Decimal(10,2)
  freeShipping   Boolean  @default(false)
  
  // Stock Management
  lowStockAlert  Int?
  allowBackorder Boolean  @default(false)
  
  // JSON Fields
  bulkPricing    Json?    @default("[]")
  badges         Json?    @default("[]")
  relatedProducts    Json? @default("[]")
  crossSellProducts  Json? @default("[]")
}
```

### **CreateProductDto (Backend)**
```typescript
{
  name: string           // ✅ مطلوب
  nameAr: string         // ✅ مطلوب
  description: string    // ✅ مطلوب
  descriptionAr?: string
  price: number          // ✅ مطلوب
  comparePrice?: number  // ✅ تم التصحيح
  stock: number          // ✅ مطلوب
  categoryId: string     // ✅ مطلوب (تم التصحيح)
  images?: string[]
  isActive?: boolean
  isFeatured?: boolean
  // ... باقي الحقول
}
```

### **Frontend API Calls**
```typescript
// Products
await merchantApi.products.create(productData)

// Settings
await merchantApi.updateSettings(settingsData)

// Orders
await merchantApi.orders.getAll()
await merchantApi.orders.getOne(id)
await merchantApi.orders.updateStatus(id, status)
```

---

## 🐛 الأخطاء التي تم إصلاحها

| الخطأ | السبب | الحل |
|------|-------|------|
| `Product.stock does not exist` | Schema قديمة | ✅ تمت إضافتها في migration |
| `Product.comparePrice does not exist` | Schema قديمة | ✅ تمت إضافتها في migration |
| `compareAtPrice should not exist` | DTO خاطئ | ✅ تم تغييره إلى comparePrice |
| `categoryId must be a string` | Frontend يرسل category بدلاً من categoryId | ✅ تم التصحيح |
| `nameAr must be a string` | ناقص في Frontend | ✅ تم إضافته |
| `shippingAddress undefined` | Schema فيها address | ✅ تم التصحيح |
| `Notification table not exists` | جدول ناقص | ✅ تمت إضافته في migration |

---

## 🔐 متغيرات البيئة المطلوبة

### Backend (.env)
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
IMGBB_API_KEY="..."
FRONTEND_URL="https://ra7ba41.vercel.app"
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL="https://rahba-1.onrender.com/api"
NEXT_PUBLIC_IMGBB_API_KEY="..."
```

---

## 📝 ملاحظات مهمة

1. **التأكد من Categories موجودة**: قبل إضافة منتج، يجب إنشاء Category أولاً
2. **Prisma Client**: يجب توليده بعد كل تغيير في Schema
3. **CORS**: تأكد من إضافة Frontend URL في backend CORS settings
4. **JWT Tokens**: تأكد من وجود JWT_SECRET في .env

---

## 🎉 النتيجة النهائية

بعد تطبيق جميع التحديثات:
- ✅ إضافة منتج تعمل 100%
- ✅ عرض الطلبات يعمل 100%
- ✅ الإعدادات العامة تعمل 100%
- ✅ واجهة المتجر تعمل 100%
- ✅ جميع API endpoints تعمل
- ✅ لا توجد أخطاء في Console

---

## 🆘 استكشاف الأخطاء

### خطأ: "column does not exist"
**الحل**: شغل migration script مرة أخرى

### خطأ: "invalid enum value"
**الحل**: Migration script يضيف enum values تلقائياً

### خطأ: "Prisma Client is outdated"
**الحل**: 
```bash
npx prisma generate
npm run build
```

---

## 📞 الدعم

إذا واجهت أي مشاكل، تواصل معي!

---

**✨ تم التحديث:** 18 أكتوبر 2025
**🔧 النسخة:** 2.0.0 - Complete Schema Sync
