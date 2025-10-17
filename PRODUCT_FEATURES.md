# تحسينات صفحة المنتجات - الميزات الجديدة

## 📋 نظرة عامة

تم تحسين صفحة إضافة/تعديل المنتجات بميزات احترافية متقدمة لتوفير أفضل تجربة للتاجر.

---

## ✨ الميزات المضافة

### 1. **Multi-Step Form (نموذج متعدد الخطوات)**
- **5 خطوات منظمة**:
  1. المعلومات الأساسية (الاسم، الوصف، الصور)
  2. التسعير والمخزون
  3. الشحن والأبعاد
  4. SEO والميزات المتقدمة
  5. المراجعة والنشر
- شريط تقدم مرئي مع أيقونات
- التنقل السهل بين الخطوات
- حفظ تلقائي عند كل خطوة

### 2. **Drag & Drop للصور**
- رفع صور متعددة (حتى 10 صور)
- إعادة ترتيب الصور بالسحب والإفلات
- معاينة فورية
- تحديد الصورة الرئيسية تلقائياً (الأولى)
- حذف سريع للصور

### 3. **معاينة مباشرة**
- معاينة فورية للمنتج أثناء الإضافة
- تقسيم الشاشة (نموذج + معاينة)
- عرض كيف سيظهر المنتج للعملاء
- تحديث تلقائي عند أي تغيير

### 4. **الحفظ التلقائي**
- حفظ المسودة كل 3 ثوانٍ في localStorage
- استرجاع المسودة عند فتح النموذج
- عرض وقت آخر حفظ
- حماية من فقدان البيانات

### 5. **SEO المتقدم**
```typescript
{
  seoTitle: string;        // عنوان محرك البحث
  seoDescription: string;  // وصف ميتا
  slug: string;            // رابط مخصص (يتم توليده تلقائياً)
}
```

### 6. **الشحن والأبعاد**
```typescript
{
  weight: number;          // الوزن
  weightUnit: 'kg' | 'g';  // وحدة الوزن
  length: number;          // الطول
  width: number;           // العرض
  height: number;          // الارتفاع
  dimensionUnit: 'cm' | 'm'; // وحدة القياس
  shippingFee: number;     // رسوم شحن مخصصة
  freeShipping: boolean;   // شحن مجاني
}
```

### 7. **إدارة المخزون المتقدمة**
```typescript
{
  stock: number;           // المخزون الحالي
  lowStockAlert: number;   // تنبيه عند الوصول لهذا العدد
  allowBackorder: boolean; // السماح بالطلب عند نفاذ المخزون
  barcode: string;         // رمز الباركود
}
```

### 8. **التسعير المتدرج (Bulk Pricing)**
```typescript
{
  bulkPricing: Array<{
    min: number;    // الحد الأدنى للكمية
    max: number;    // الحد الأقصى
    price: number;  // السعر لهذا النطاق
  }>;
}
// مثال: 1-5 قطع = 1000 دج، 6-10 = 900 دج
```

### 9. **الشارات (Badges)**
```typescript
{
  badges: string[];  // ['جديد', 'الأكثر مبيعاً', 'محدود', 'حصري', 'عرض ساخن']
}
```

### 10. **المنتجات المرتبطة**
```typescript
{
  relatedProducts: string[];    // منتجات مشابهة
  crossSellProducts: string[];  // يُشترى معه عادة
}
```

### 11. **جدول المتغيرات التفاعلي**
- تعريف متغيرات (لون، مقاس، إلخ)
- توليد تلقائي لجميع التوليفات
- تحديد سعر ومخزون وSKU لكل توليفة
- إضافة صورة لكل توليفة
- تفعيل/تعطيل توليفات معينة

```typescript
{
  variants: Array<{
    name: string;      // اسم المتغير (مثلاً: اللون)
    options: string[]; // الخيارات (أحمر، أزرق)
  }>;
  
  variantCombinations: Array<{
    combination: string;  // "أحمر / كبير"
    price: number;
    stock: number;
    sku: string;
    image?: string;
    enabled: boolean;
  }>;
}
```

### 12. **نسخ منتج**
- زر نسخ في بطاقة المنتج
- ينسخ جميع البيانات
- يضيف "(نسخة)" للاسم تلقائياً

### 13. **محرر نصوص غني**
- شريط أدوات كامل (عريض، مائل، قوائم، روابط، إلخ)
- دعم Markdown
- معاينة مباشرة

---

## 🗂️ المكونات المساعدة

### 1. `ProductPreview.tsx`
معاينة مباشرة للمنتج كما سيظهر للعملاء.

**الموقع**: `frontend/src/components/products/ProductPreview.tsx`

**الاستخدام**:
```tsx
<ProductPreview product={formData} />
```

### 2. `ImageUploader.tsx`
رفع وإدارة الصور مع Drag & Drop.

**الموقع**: `frontend/src/components/products/ImageUploader.tsx`

**الاستخدام**:
```tsx
<ImageUploader
  images={imagePreviews}
  onImagesChange={setImagePreviews}
  maxImages={10}
/>
```

### 3. `VariantsTable.tsx`
جدول تفاعلي لإدارة المتغيرات والتوليفات.

**الموقع**: `frontend/src/components/products/VariantsTable.tsx`

**الاستخدام**:
```tsx
<VariantsTable
  variants={variants}
  combinations={variantCombinations}
  onVariantsChange={setVariants}
  onCombinationsChange={setVariantCombinations}
/>
```

---

## 🔌 الربط بالباكند

### تحديث Prisma Schema

أضف الحقول الجديدة إلى موديل `Product`:

```prisma
model Product {
  id          String   @id @default(cuid())
  // ... الحقول الموجودة
  
  // SEO
  seoTitle       String?
  seoDescription String?
  slug           String?  @unique
  
  // الشحن والأبعاد
  weight         Float?
  weightUnit     String?  @default("kg")
  length         Float?
  width          Float?
  height         Float?
  dimensionUnit  String?  @default("cm")
  shippingFee    Float?
  freeShipping   Boolean  @default(false)
  
  // المخزون المتقدم
  lowStockAlert  Int?
  allowBackorder Boolean  @default(false)
  barcode        String?
  
  // التسعير المتدرج (JSON)
  bulkPricing    Json?
  
  // الشارات
  badges         String[]
  
  // المنتجات المرتبطة
  relatedProducts    String[]
  crossSellProducts  String[]
  
  // المتغيرات (JSON)
  variants           Json?
  variantCombinations Json?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### تحديث API Endpoints

#### 1. إنشاء منتج
```typescript
// backend/src/products/products.service.ts

async create(createProductDto: CreateProductDto) {
  const {
    name,
    description,
    price,
    stock,
    images,
    // الحقول الجديدة
    seoTitle,
    seoDescription,
    slug,
    weight,
    dimensions,
    shippingFee,
    freeShipping,
    lowStockAlert,
    allowBackorder,
    barcode,
    bulkPricing,
    badges,
    relatedProducts,
    crossSellProducts,
    variants,
    variantCombinations,
    ...rest
  } = createProductDto;

  // توليد slug فريد إن لم يُحدد
  const finalSlug = slug || await this.generateUniqueSlug(name);

  return this.prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      images,
      seoTitle,
      seoDescription,
      slug: finalSlug,
      weight,
      weightUnit: dimensions?.weightUnit || 'kg',
      length: dimensions?.length,
      width: dimensions?.width,
      height: dimensions?.height,
      dimensionUnit: dimensions?.dimensionUnit || 'cm',
      shippingFee,
      freeShipping,
      lowStockAlert,
      allowBackorder,
      barcode,
      bulkPricing: bulkPricing || [],
      badges: badges || [],
      relatedProducts: relatedProducts || [],
      crossSellProducts: crossSellProducts || [],
      variants: variants || [],
      variantCombinations: variantCombinations || [],
      ...rest,
    },
  });
}

private async generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-\u0600-\u06ff]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  let slug = baseSlug;
  let counter = 1;
  
  while (await this.prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
```

#### 2. حساب السعر حسب الكمية (Bulk Pricing)
```typescript
// backend/src/products/products.service.ts

calculatePrice(product: Product, quantity: number): number {
  if (!product.bulkPricing || product.bulkPricing.length === 0) {
    return product.price * quantity;
  }

  const bulkPricing = product.bulkPricing as Array<{
    min: number;
    max: number;
    price: number;
  }>;

  const applicableTier = bulkPricing.find(
    tier => quantity >= tier.min && quantity <= tier.max
  );

  const unitPrice = applicableTier ? applicableTier.price : product.price;
  return unitPrice * quantity;
}
```

#### 3. حساب رسوم الشحن
```typescript
// backend/src/shipping/shipping.service.ts

async calculateShipping(product: Product, wilaya: string): Promise<number> {
  // إذا كان الشحن مجاني للمنتج
  if (product.freeShipping) {
    return 0;
  }

  // إذا كان هناك رسوم مخصصة للمنتج
  if (product.shippingFee) {
    return product.shippingFee;
  }

  // استخدام رسوم الشحن العامة حسب الولاية
  return this.getWilayaShippingFee(wilaya, product.weight);
}
```

#### 4. التحقق من المخزون
```typescript
// backend/src/products/products.service.ts

async checkStock(productId: string): Promise<{
  available: boolean;
  stock: number;
  lowStock: boolean;
  allowBackorder: boolean;
}> {
  const product = await this.prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new NotFoundException('المنتج غير موجود');
  }

  const lowStock = product.lowStockAlert 
    ? product.stock <= product.lowStockAlert 
    : false;

  return {
    available: product.stock > 0 || product.allowBackorder,
    stock: product.stock,
    lowStock,
    allowBackorder: product.allowBackorder,
  };
}
```

---

## 📊 واجهات TypeScript (DTOs)

### CreateProductDto
```typescript
// backend/src/products/dto/create-product.dto.ts

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  // SEO
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  // الشحن والأبعاد
  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  weightUnit?: string;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  dimensionUnit?: string;

  @IsNumber()
  @IsOptional()
  shippingFee?: number;

  @IsBoolean()
  @IsOptional()
  freeShipping?: boolean;

  // المخزون المتقدم
  @IsNumber()
  @IsOptional()
  lowStockAlert?: number;

  @IsBoolean()
  @IsOptional()
  allowBackorder?: boolean;

  @IsString()
  @IsOptional()
  barcode?: string;

  // التسعير المتدرج
  @IsArray()
  @IsOptional()
  bulkPricing?: Array<{
    min: number;
    max: number;
    price: number;
  }>;

  // الشارات
  @IsArray()
  @IsOptional()
  badges?: string[];

  // المنتجات المرتبطة
  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  @IsArray()
  @IsOptional()
  crossSellProducts?: string[];

  // المتغيرات
  @IsArray()
  @IsOptional()
  variants?: any[];

  @IsArray()
  @IsOptional()
  variantCombinations?: any[];
}
```

---

## 🎯 الخطوات التالية للتطبيق

### 1. تحديث قاعدة البيانات
```bash
cd backend
npx prisma migrate dev --name add_product_advanced_features
```

### 2. تحديث API
- أضف الحقول الجديدة في DTOs
- حدّث `products.service.ts` لمعالجة الحقول الجديدة
- أضف endpoints للميزات الجديدة (bulk pricing, shipping calculation)

### 3. اختبار الميزات
- اختبر إضافة منتج بجميع الحقول
- تحقق من حفظ البيانات في قاعدة البيانات
- اختبر حساب الأسعار المتدرجة
- تحقق من حساب رسوم الشحن

### 4. تحسينات إضافية (اختيارية)
- إضافة AI لتوليد الوصف تلقائياً
- ضغط وتحسين الصور تلقائياً
- استيراد منتجات من CSV
- تصدير المنتجات

---

## 📝 ملاحظات مهمة

1. **الحفظ التلقائي**: يعمل محلياً فقط، لا يرسل للسيرفر
2. **الصور**: يجب رفعها إلى ImgBB أو Supabase Storage
3. **Slug**: يجب أن يكون فريداً، يتم التحقق في الباكند
4. **المتغيرات**: يتم حفظها كـ JSON في قاعدة البيانات
5. **التسعير المتدرج**: يُطبق تلقائياً عند إضافة المنتج للسلة

---

## 🐛 التعامل مع الأخطاء

### Frontend
```typescript
try {
  await productsApi.create(productData);
  alert('تم إضافة المنتج بنجاح!');
  resetForm();
} catch (error: any) {
  if (error.response?.data?.message) {
    alert(error.response.data.message);
  } else {
    alert('حدث خطأ في إضافة المنتج');
  }
}
```

### Backend
```typescript
@Post()
async create(@Body() createProductDto: CreateProductDto) {
  try {
    return await this.productsService.create(createProductDto);
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictException('الـ slug موجود مسبقاً');
    }
    throw new InternalServerErrorException('خطأ في إنشاء المنتج');
  }
}
```

---

## ✅ قائمة التحقق

- [x] إنشاء مكونات المعاينة والصور والمتغيرات
- [x] إضافة Multi-Step Form
- [x] إضافة الحفظ التلقائي
- [x] إضافة جميع الحقول الجديدة في State
- [ ] تحديث Prisma Schema
- [ ] تحديث DTOs في الباكند
- [ ] تحديث Products Service
- [ ] إضافة endpoints جديدة
- [ ] اختبار شامل
- [ ] توثيق API

---

تم إنشاء هذا الملف في: 17 أكتوبر 2025
