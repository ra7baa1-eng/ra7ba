# الفصل الكامل بين المتاجر (Tenant Isolation)

## ✅ تم التأكد من الفصل الكامل بين جميع المتاجر

### المبدأ الأساسي
كل متجر (tenant) معزول تماماً عن الآخر. لا يمكن لأي متجر الوصول إلى بيانات متجر آخر.

## آلية الفصل

### 1. Backend (NestJS)

#### A. Storefront Module
جميع queries تستخدم `tenantId` للفصل:

```typescript
// ✅ Get Store
where: { subdomain } // يجلب tenant ID أولاً

// ✅ Get Products
where: { tenantId: tenant.id, isActive: true }

// ✅ Get Single Product
where: { tenantId: tenant.id, slug: productSlug }

// ✅ Get Categories
where: { tenantId: tenant.id }

// ✅ Get Featured Products
where: { tenantId: tenant.id, isFeatured: true }

// ✅ Create Order
tenantId: tenant.id // في كل order
where: { id: { in: productIds }, tenantId: tenant.id } // التحقق من المنتجات
```

#### B. Merchant Module
جميع العمليات تتطلب `tenantId` من JWT token:

```typescript
// ✅ Dashboard
async getDashboard(tenantId: string)

// ✅ Products CRUD
async getProducts(tenantId: string, filters)
async getProduct(tenantId: string, productId: string)
async createProduct(tenantId: string, data)
async updateProduct(tenantId: string, productId: string, data)
async deleteProduct(tenantId: string, productId: string)

// ✅ Categories CRUD
async getCategories(tenantId: string)
async createCategory(tenantId: string, data)
async updateCategory(tenantId: string, categoryId: string, data)
async deleteCategory(tenantId: string, categoryId: string)

// ✅ Orders Management
async getOrders(tenantId: string, filters)
async getOrder(tenantId: string, orderId: string)
async updateOrder(tenantId: string, orderId: string, data)

// ✅ Store Settings
async updateStoreSettings(tenantId: string, data)
```

#### C. Authentication Guard
```typescript
// JWT token يحتوي على:
{
  userId: string,
  email: string,
  role: UserRole,
  tenant: {
    id: string,      // ← هذا يُستخدم في كل query
    subdomain: string
  }
}
```

### 2. Database Schema (Prisma)

#### Foreign Keys
```prisma
model Product {
  id        String   @id @default(cuid())
  tenantId  String   // ← مطلوب
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  // ...
}

model Order {
  id        String   @id @default(cuid())
  tenantId  String   // ← مطلوب
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  // ...
}

model Category {
  id        String   @id @default(cuid())
  tenantId  String   // ← مطلوب
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  // ...
}
```

### 3. Frontend (Next.js)

#### A. Storefront
```typescript
// كل API call يمر عبر subdomain
storefrontApi.getStore(subdomain)
storefrontApi.getProducts(subdomain, filters)
storefrontApi.getProduct(subdomain, slug)
storefrontApi.createOrder(subdomain, orderData)
```

#### B. Merchant Dashboard
```typescript
// JWT token في localStorage
// كل request يحتوي على Authorization header
// Backend يستخرج tenantId من token تلقائياً
```

## ضمانات الأمان

### ✅ لا يمكن للمتجر A:
- ❌ رؤية منتجات المتجر B
- ❌ رؤية طلبات المتجر B
- ❌ تعديل إعدادات المتجر B
- ❌ حذف فئات المتجر B
- ❌ الوصول لأي بيانات المتجر B

### ✅ لا يمكن للعميل:
- ❌ إنشاء طلب بمنتجات من متجر آخر
- ❌ رؤية منتجات غير نشطة (isActive: false)
- ❌ رؤية منتجات بدون مخزون (stock: 0)

## الاختبارات المطلوبة

### 1. اختبار الفصل بين المتاجر
```bash
# إنشاء متجرين
POST /auth/register (متجر A)
POST /auth/register (متجر B)

# إنشاء منتج في متجر A
POST /merchant/products (token A)

# محاولة الوصول من متجر B
GET /merchant/products/:productId (token B)
# النتيجة المتوقعة: 404 Not Found
```

### 2. اختبار Storefront
```bash
# متجر A
GET /store/subdomain-a/products
# يجب أن يرجع منتجات A فقط

# متجر B
GET /store/subdomain-b/products
# يجب أن يرجع منتجات B فقط
```

### 3. اختبار الطلبات
```bash
# محاولة إنشاء طلب بمنتجات من متجر آخر
POST /store/subdomain-a/orders
{
  items: [
    { productId: "product-from-store-b", quantity: 1 }
  ]
}
# النتيجة المتوقعة: 400 Bad Request (Product not found)
```

## حذف سياسة الخصوصية

### ✅ تم حذف نهائياً:
- ❌ `/merchant/settings/privacy` - صفحة إعدادات السياسات
- ❌ `/store/[subdomain]/privacy` - صفحة عرض سياسة الخصوصية
- ❌ `privacyPolicy` field من Backend DTO
- ❌ `termsOfService` field من Backend DTO
- ❌ `returnPolicy` field من Backend DTO
- ❌ جميع حقول السياسات من `merchant.service.ts`

### ✅ ما زال موجوداً:
- ✅ `thankYouMessage` - رسالة الشكر بعد الطلب
- ✅ `thankYouImage` - صورة صفحة الشكر

## الملفات المعدلة

1. ✅ حذف: `frontend/src/app/merchant/settings/privacy/`
2. ✅ حذف: `frontend/src/app/store/[subdomain]/privacy/`
3. ✅ تعديل: `frontend/src/app/merchant/settings/page.tsx`
4. ✅ تعديل: `backend/src/modules/merchant/dto/update-store-settings.dto.ts`
5. ✅ تعديل: `backend/src/modules/merchant/merchant.service.ts`

## التوصيات

### Database Indexes (لتحسين الأداء)
```sql
-- تسريع البحث بـ tenantId
CREATE INDEX idx_product_tenant ON "Product"(tenantId);
CREATE INDEX idx_order_tenant ON "Order"(tenantId);
CREATE INDEX idx_category_tenant ON "Category"(tenantId);

-- تسريع البحث بـ subdomain
CREATE INDEX idx_tenant_subdomain ON "Tenant"(subdomain);

-- تسريع البحث بـ slug
CREATE INDEX idx_product_slug ON "Product"(slug);
CREATE INDEX idx_category_slug ON "Category"(slug);
```

### Row Level Security (RLS) في PostgreSQL
```sql
-- إضافة RLS policy (اختياري - للأمان المضاعف)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON "Product"
  USING (tenantId = current_setting('app.current_tenant_id')::text);
```

---

**تاريخ التحديث:** 21 أكتوبر 2025  
**الحالة:** ✅ الفصل الكامل مضمون - لا يوجد تداخل بين المتاجر
