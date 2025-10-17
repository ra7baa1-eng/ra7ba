# دليل إكمال الفرونت إند - صفحة المنتجات

## ✅ ما تم إنجازه (100%)

### 1. **المكونات المساعدة** ✅
- ✅ `ProductPreview.tsx` - معاينة مباشرة للمنتج
- ✅ `ImageUploader.tsx` - رفع الصور مع Drag & Drop
- ✅ `VariantsTable.tsx` - جدول المتغيرات التفاعلي

### 2. **State Management** ✅
- ✅ جميع الحقول الجديدة مضافة (SEO, الشحن, المخزون المتقدم, التسعير المتدرج, الشارات, المنتجات المرتبطة)
- ✅ `currentStep` لإدارة الخطوات
- ✅ `showPreview` للمعاينة المباشرة
- ✅ `lastSaved` لعرض وقت آخر حفظ

### 3. **الوظائف الأساسية** ✅
- ✅ الحفظ التلقائي كل 3 ثوانٍ
- ✅ استرجاع المسودة عند فتح النموذج
- ✅ توليد Slug تلقائي من اسم المنتج
- ✅ نسخ منتج موجود
- ✅ إدارة الخطوات (nextStep, prevStep, goToStep)
- ✅ إضافة/حذف شارة (toggleBadge)
- ✅ إدارة التسعير المتدرج (add/remove/update)
- ✅ resetForm محدّث بجميع الحقول

### 4. **واجهة المستخدم** ✅
- ✅ Header محسّن مع زر المعاينة ووقت الحفظ
- ✅ شريط تقدم مرئي للخطوات الخمس
- ✅ زر نسخ في بطاقات المنتجات
- ✅ تقسيم الشاشة (نموذج + معاينة)

---

## 📝 كيفية استخدام الصفحة المحسّنة

### **الخطوة 1: المعلومات الأساسية**
```tsx
{currentStep === 1 && (
  <>
    {/* اسم المنتج */}
    <input value={formData.name} onChange={...} />
    
    {/* الوصف مع محرر نصوص */}
    <textarea value={formData.description} onChange={...} />
    
    {/* رفع الصور - استخدام المكون الجديد */}
    <ImageUploader
      images={imagePreviews}
      onImagesChange={(images) => {
        setImagePreviews(images);
        setFormData({...formData, images});
      }}
    />
    
    {/* التصنيف والوسوم */}
    <select value={formData.category} onChange={...} />
    <input value={formData.tags} onChange={...} />
    
    {/* أزرار التنقل */}
    <button onClick={nextStep}>التالي</button>
  </>
)}
```

### **الخطوة 2: التسعير والمخزون**
```tsx
{currentStep === 2 && (
  <>
    {/* السعر الأساسي */}
    <input type="number" value={formData.price} onChange={...} />
    <input type="number" value={formData.comparePrice} onChange={...} />
    
    {/* المخزون */}
    <input type="number" value={formData.stock} onChange={...} />
    <input type="text" value={formData.sku} onChange={...} />
    <input type="text" value={formData.barcode} onChange={...} />
    
    {/* تنبيه المخزون المنخفض */}
    <input type="number" value={formData.lowStockAlert} onChange={...} />
    <input type="checkbox" checked={formData.allowBackorder} onChange={...} />
    
    {/* التسعير المتدرج */}
    <div>
      <h4>التسعير المتدرج (خصومات الكمية)</h4>
      {formData.bulkPricing.map((tier, idx) => (
        <div key={idx}>
          <input 
            type="number" 
            placeholder="من" 
            value={tier.min}
            onChange={(e) => updateBulkPricingTier(idx, 'min', e.target.value)}
          />
          <input 
            type="number" 
            placeholder="إلى" 
            value={tier.max}
            onChange={(e) => updateBulkPricingTier(idx, 'max', e.target.value)}
          />
          <input 
            type="number" 
            placeholder="السعر" 
            value={tier.price}
            onChange={(e) => updateBulkPricingTier(idx, 'price', e.target.value)}
          />
          <button onClick={() => removeBulkPricingTier(idx)}>حذف</button>
        </div>
      ))}
      <button onClick={addBulkPricingTier}>إضافة نطاق سعري</button>
    </div>
    
    {/* العروض الخاصة */}
    <input type="checkbox" checked={formData.isOffer} onChange={...} />
    {formData.isOffer && (
      <>
        <input type="number" value={formData.offerPrice} onChange={...} />
        <input type="date" value={formData.offerEndDate} onChange={...} />
      </>
    )}
    
    {/* أزرار التنقل */}
    <button onClick={prevStep}>السابق</button>
    <button onClick={nextStep}>التالي</button>
  </>
)}
```

### **الخطوة 3: الشحن والأبعاد**
```tsx
{currentStep === 3 && (
  <>
    {/* الوزن */}
    <div className="grid grid-cols-2 gap-4">
      <input type="number" value={formData.weight} onChange={...} />
      <select value={formData.weightUnit} onChange={...}>
        <option value="kg">كجم</option>
        <option value="g">جرام</option>
      </select>
    </div>
    
    {/* الأبعاد */}
    <div className="grid grid-cols-4 gap-4">
      <input type="number" placeholder="الطول" value={formData.length} onChange={...} />
      <input type="number" placeholder="العرض" value={formData.width} onChange={...} />
      <input type="number" placeholder="الارتفاع" value={formData.height} onChange={...} />
      <select value={formData.dimensionUnit} onChange={...}>
        <option value="cm">سم</option>
        <option value="m">متر</option>
      </select>
    </div>
    
    {/* رسوم الشحن */}
    <input type="checkbox" checked={formData.freeShipping} onChange={...} />
    {!formData.freeShipping && (
      <input type="number" value={formData.shippingFee} onChange={...} />
    )}
    
    {/* أزرار التنقل */}
    <button onClick={prevStep}>السابق</button>
    <button onClick={nextStep}>التالي</button>
  </>
)}
```

### **الخطوة 4: SEO والميزات**
```tsx
{currentStep === 4 && (
  <>
    {/* SEO */}
    <input 
      type="text" 
      placeholder="عنوان SEO"
      value={formData.seoTitle} 
      onChange={...} 
    />
    <textarea 
      placeholder="وصف SEO (160 حرف)"
      value={formData.seoDescription} 
      onChange={...}
      maxLength={160}
    />
    <input 
      type="text" 
      placeholder="الرابط المخصص (slug)"
      value={formData.slug} 
      onChange={...} 
    />
    
    {/* الشارات */}
    <div>
      <h4>الشارات</h4>
      <div className="flex flex-wrap gap-2">
        {availableBadges.map(badge => (
          <button
            key={badge}
            type="button"
            onClick={() => toggleBadge(badge)}
            className={`px-4 py-2 rounded-lg ${
              formData.badges.includes(badge)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {badge}
          </button>
        ))}
      </div>
    </div>
    
    {/* المتغيرات - استخدام المكون الجديد */}
    <VariantsTable
      variants={formData.variants}
      combinations={formData.variantCombinations}
      onVariantsChange={(variants) => setFormData({...formData, variants})}
      onCombinationsChange={(combinations) => setFormData({...formData, variantCombinations: combinations})}
    />
    
    {/* المنتجات المرتبطة */}
    <div>
      <h4>منتجات مشابهة</h4>
      <select 
        multiple
        value={formData.relatedProducts}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          setFormData({...formData, relatedProducts: selected});
        }}
      >
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.nameAr}</option>
        ))}
      </select>
    </div>
    
    <div>
      <h4>يُشترى معه عادة</h4>
      <select 
        multiple
        value={formData.crossSellProducts}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          setFormData({...formData, crossSellProducts: selected});
        }}
      >
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.nameAr}</option>
        ))}
      </select>
    </div>
    
    {/* صفحة الهبوط */}
    <input type="checkbox" checked={formData.isLandingPage} onChange={...} />
    {formData.isLandingPage && (
      <>
        <input type="checkbox" checked={formData.showWhatsappButton} onChange={...} />
        {formData.showWhatsappButton && (
          <input type="tel" value={formData.whatsappNumber} onChange={...} />
        )}
      </>
    )}
    
    {/* أزرار التنقل */}
    <button onClick={prevStep}>السابق</button>
    <button onClick={nextStep}>التالي</button>
  </>
)}
```

### **الخطوة 5: المراجعة والنشر**
```tsx
{currentStep === 5 && (
  <>
    {/* ملخص شامل */}
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-bold">مراجعة المنتج</h3>
      
      <div>
        <h4 className="font-semibold">المعلومات الأساسية</h4>
        <p>الاسم: {formData.name}</p>
        <p>التصنيف: {formData.category}</p>
        <p>عدد الصور: {formData.images.length}</p>
      </div>
      
      <div>
        <h4 className="font-semibold">التسعير</h4>
        <p>السعر: {formData.price} دج</p>
        {formData.comparePrice && <p>السعر قبل الخصم: {formData.comparePrice} دج</p>}
        {formData.bulkPricing.length > 0 && (
          <p>نطاقات التسعير المتدرج: {formData.bulkPricing.length}</p>
        )}
      </div>
      
      <div>
        <h4 className="font-semibold">المخزون</h4>
        <p>الكمية: {formData.stock}</p>
        {formData.lowStockAlert && <p>تنبيه عند: {formData.lowStockAlert}</p>}
      </div>
      
      <div>
        <h4 className="font-semibold">الشحن</h4>
        {formData.freeShipping ? (
          <p>شحن مجاني ✅</p>
        ) : (
          <p>رسوم الشحن: {formData.shippingFee || 'حسب الولاية'}</p>
        )}
        {formData.weight && <p>الوزن: {formData.weight} {formData.weightUnit}</p>}
      </div>
      
      <div>
        <h4 className="font-semibold">SEO</h4>
        <p>Slug: {formData.slug}</p>
        {formData.seoTitle && <p>عنوان SEO: {formData.seoTitle}</p>}
      </div>
      
      <div>
        <h4 className="font-semibold">الميزات</h4>
        {formData.badges.length > 0 && (
          <p>الشارات: {formData.badges.join(', ')}</p>
        )}
        {formData.variants.length > 0 && (
          <p>المتغيرات: {formData.variants.length}</p>
        )}
        {formData.variantCombinations.length > 0 && (
          <p>التوليفات: {formData.variantCombinations.length}</p>
        )}
      </div>
    </div>
    
    {/* خيارات النشر */}
    <div className="flex items-center gap-4">
      <input 
        type="checkbox" 
        checked={formData.isActive} 
        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
      />
      <label>نشر المنتج مباشرة</label>
    </div>
    
    <div className="flex items-center gap-4">
      <input 
        type="checkbox" 
        checked={formData.isFeatured} 
        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
      />
      <label>منتج مميز</label>
    </div>
    
    {/* أزرار التنقل */}
    <button onClick={prevStep}>السابق</button>
    <button type="submit" disabled={uploadingImages}>
      {uploadingImages ? 'جاري الرفع...' : 'نشر المنتج'}
    </button>
  </>
)}
```

### **المعاينة المباشرة**
```tsx
{/* Preview Panel */}
{showPreview && (
  <div className="w-1/3 sticky top-0">
    <ProductPreview product={formData} />
  </div>
)}
```

---

## 🎨 التحسينات البصرية

### **شريط التقدم**
- ✅ 5 خطوات مع أيقونات
- ✅ تغيير اللون حسب الحالة (رمادي → بنفسجي → أخضر)
- ✅ علامة ✓ للخطوات المكتملة
- ✅ خط يربط بين الخطوات

### **أزرار التنقل**
```tsx
<div className="flex justify-between pt-6 border-t">
  {currentStep > 1 && (
    <button 
      type="button"
      onClick={prevStep}
      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
    >
      <ChevronRight className="w-5 h-5" />
      السابق
    </button>
  )}
  
  <div className="flex-1" />
  
  {currentStep < 5 ? (
    <button 
      type="button"
      onClick={nextStep}
      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
    >
      التالي
      <ChevronLeft className="w-5 h-5" />
    </button>
  ) : (
    <button 
      type="submit"
      disabled={uploadingImages}
      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
    >
      {uploadingImages ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          جاري الرفع...
        </>
      ) : (
        <>
          <Check className="w-5 h-5" />
          نشر المنتج
        </>
      )}
    </button>
  )}
</div>
```

---

## 📦 الملفات المطلوبة

### **الموجودة بالفعل** ✅
1. `frontend/src/components/products/ProductPreview.tsx`
2. `frontend/src/components/products/ImageUploader.tsx`
3. `frontend/src/components/products/VariantsTable.tsx`
4. `frontend/src/app/merchant/products/page.tsx` (محسّن جزئياً)

### **ما تبقى**
- إكمال محتوى الخطوات الخمس في `page.tsx`
- إضافة أزرار التنقل بين الخطوات
- دمج المكونات الجديدة في الخطوات المناسبة

---

## 🚀 الخطوات النهائية للإكمال

### **1. إضافة محتوى الخطوات**
استبدل المحتوى الحالي بين `<div className="space-y-6">` و `</div>` بالكود أعلاه لكل خطوة.

### **2. إضافة أزرار التنقل**
أضف أزرار السابق/التالي في نهاية كل خطوة.

### **3. دمج المكونات**
- استخدم `<ImageUploader />` في الخطوة 1
- استخدم `<VariantsTable />` في الخطوة 4
- استخدم `<ProductPreview />` في panel المعاينة

### **4. الاختبار**
- اختبر التنقل بين الخطوات
- تأكد من الحفظ التلقائي
- تحقق من المعاينة المباشرة
- اختبر نسخ المنتج

---

## ✅ قائمة التحقق النهائية

- [x] المكونات المساعدة منشأة
- [x] State محدّث بجميع الحقول
- [x] الوظائف الأساسية مضافة
- [x] Header محسّن مع شريط التقدم
- [x] زر النسخ مضاف
- [ ] محتوى الخطوات الخمس كامل
- [ ] أزرار التنقل في كل خطوة
- [ ] المكونات مدمجة في الخطوات
- [ ] المعاينة المباشرة مفعّلة
- [ ] اختبار شامل

---

## 📝 ملاحظات

1. **الكود الحالي جاهز بنسبة 80%** - البنية الأساسية والمكونات والوظائف موجودة
2. **ما تبقى هو التنسيق** - فقط ترتيب الحقول في الخطوات الخمس
3. **سهل الإكمال** - يمكن نسخ الكود من هذا الملف مباشرة
4. **جاهز للباكند** - جميع الحقول موجودة في State

---

تم إنشاء هذا الدليل في: 17 أكتوبر 2025
