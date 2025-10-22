# 🚀 Frontend Setup Guide | دليل إعداد الواجهة الأمامية

## 📋 المشاكل المحلولة

### ✅ إصلاح خطأ TypeScript في صفحة الطلب
تم إصلاح الخطأ في `src/app/store/[subdomain]/order/[productId]/page.tsx`:
- إزالة `style={darkMode ? {} : { '&:hover': neonGlow }}` من motion.div
- استخدام CSS classes بدلاً من inline styles للـ hover effects
- إصلاح بنية JSX وإضافة props المفقودة لـ motion.div

### ✅ إصلاح مشكلة تسجيل الدخول
تم تحديث ملف `.env.example` ليشمل إعدادات التطوير المحلي الصحيحة.

## 🛠️ إعداد البيئة للتطوير المحلي

### 1. إنشاء ملف البيئة

**انسخ محتويات `.env.example` إلى `.env.local`:**

```bash
# في مجلد frontend
cp .env.example .env.local
```

**ثم قم بتعديل `.env.local` مع القيم التالية:**

```env
# Frontend Environment Variables

# For Local Development (localhost)
NEXT_PUBLIC_API_URL=http://localhost:10000/api
NEXT_PUBLIC_APP_DOMAIN=localhost:3000
NEXT_PUBLIC_APP_NAME=Rahba

# Clerk Authentication (استبدل بالمفاتيح الحقيقية)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret

# ImgBB API key for image uploads (احصل على مفتاح مجاني من imgbb.com)
NEXT_PUBLIC_IMGBB_KEY=YOUR_IMGBB_API_KEY

# Supabase Configuration (استبدل بالمفاتيح الحقيقية)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration (للمدفوعات)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
```

### 2. تثبيت التبعيات

```bash
# في مجلد frontend
npm install
```

### 3. تشغيل التطوير

```bash
# في مجلد frontend
npm run dev
```

## 🖥️ التحقق من الـ Backend

### تأكد من تشغيل الـ Backend أولاً:

```bash
# في مجلد backend
npm run start:dev
```

**يجب أن ترى:**
```
🚀 Rahba Backend is running!
📡 API: http://localhost:10000/api
📚 Docs: http://localhost:10000/api/docs
```

### التحقق من الـ API:

افتح المتصفح واذهب إلى:
- **API Health**: http://localhost:10000/api
- **API Docs**: http://localhost:10000/api/docs
- **Auth Login**: http://localhost:10000/api/auth/login (POST)

## 🔧 حل المشاكل الشائعة

### مشكلة: "Failed to compile" - TypeScript errors

**الحل:**
```bash
# تنظيف وإعادة تثبيت
rm -rf node_modules package-lock.json
npm install

# إعادة تشغيل
npm run dev
```

### مشكلة: "cannot post /auth/login"

**الحل:**
1. تأكد من تشغيل الـ backend على port 10000
2. تأكد من أن `.env.local` يحتوي على `NEXT_PUBLIC_API_URL=http://localhost:10000/api`
3. أعد تشغيل الـ frontend

### مشكلة: CORS errors

**الحل:** الـ Backend يسمح بجميع المصادر في التطوير. إذا واجهت مشاكل:
1. تأكد من أن الـ backend يعمل
2. تحقق من الـ port (10000)
3. أعد تحميل الصفحة

## 📱 الوصول للتطبيق

بعد الإعداد الصحيح:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:10000/api
- **API Documentation**: http://localhost:10000/api/docs

## 🚀 للإنتاج (Railway)

عند النشر على Railway، استخدم:

```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url/api
NEXT_PUBLIC_APP_DOMAIN=your-custom-domain.com
```

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تأكد من تشغيل الـ backend أولاً
2. تحقق من ملف `.env.local`
3. أعد تشغيل الـ frontend
4. راجع console.log في المتصفح للأخطاء

---
**🎉 المشروع جاهز للاستخدام!**
