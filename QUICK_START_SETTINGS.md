# 🚀 دليل التشغيل السريع - إعدادات المتجر

## خطوات التشغيل

### 1️⃣ تثبيت المكتبات

```bash
cd frontend
npm install
```

سيتم تثبيت `@supabase/supabase-js` تلقائياً.

### 2️⃣ إعداد متغيرات البيئة

أضف في `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **ملاحظة:** إذا لم تكن تستخدم Supabase، المزامنة الفورية ستكون معطلة تلقائياً ولكن باقي الميزات ستعمل.

### 3️⃣ تفعيل Realtime في Supabase (اختياري)

في Supabase SQL Editor:

```sql
ALTER TABLE "Tenant" REPLICA IDENTITY FULL;
```

### 4️⃣ تشغيل المشروع

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5️⃣ اختبار الإعدادات

1. افتح `http://localhost:3000/merchant/settings`
2. جرب تحديث:
   - الشعار (Logo)
   - صورة الغلاف (Banner)
   - اسم المتجر
   - سياسة الخصوصية

## ✅ التحقق من نجاح التثبيت

### في Backend Console:
```
🔄 Updating store settings for tenant: clxxxxx...
📦 Data received: { ... }
✅ Store updated successfully: clxxxxx...
```

### في Frontend:
- ظهور رسالة "✅ تم حفظ التغييرات بنجاح!"
- تحديث الواجهة فوراً
- (اختياري) مؤشر "متصل - مزامنة فورية" إذا كان Supabase مفعل

## 🐛 حل المشاكل الشائعة

### المشكلة: "Cannot find module '@supabase/supabase-js'"
**الحل:**
```bash
cd frontend
npm install @supabase/supabase-js
```

### المشكلة: التغييرات لا تحفظ
**الحل:**
1. تحقق من Backend console للأخطاء
2. تأكد من JWT token صحيح
3. تحقق من Network tab في DevTools

### المشكلة: رفع الصور يفشل
**الحل:**
1. تحقق من `/storage/upload` endpoint يعمل
2. تأكد من حجم الصورة < 5MB
3. تحقق من صلاحيات Supabase Storage

## 📝 ملاحظات

- ✅ جميع التحديثات تتطلب تسجيل دخول
- ✅ كل متجر يرى بياناته فقط
- ✅ الملفات تُرفع أولاً ثم تُحفظ URLs
- ✅ المزامنة الفورية اختيارية (تعمل بدونها)

## 📚 للمزيد من التفاصيل

راجع: `SETTINGS_FIX_COMPLETE.md`
