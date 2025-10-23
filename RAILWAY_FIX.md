# 🚨 حل مشكلة Railway - تسجيل الدخول لا يعمل

## 🔍 تشخيص المشكلة

المشكلة تحدث لأنك انتقلت من Koyeb إلى Railway، ولكن متغيرات البيئة في الـ frontend ما زالت تشير إلى العنوان القديم أو localhost.

## 🛠️ الحلول المطلوبة

### 1️⃣ تحديث متغيرات البيئة في الـ Frontend

**أنشئ أو عدل ملف `.env.local` في مجلد `frontend`:**

```env
# Frontend Environment Variables

# Railway Backend URL (استبدل بالـ URL الحقيقي من Railway)
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app/api
NEXT_PUBLIC_APP_DOMAIN=https://your-frontend-domain.railway.app
NEXT_PUBLIC_APP_NAME=Rahba

# Clerk Authentication (استبدل بالمفاتيح الحقيقية)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret

# ImgBB API key for image uploads (create a free key at imgbb.com)
NEXT_PUBLIC_IMGBB_KEY=YOUR_IMGBB_API_KEY

# Supabase Configuration (replace with your actual keys)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
```

### 2️⃣ الحصول على Railway URLs الصحيحة

**في لوحة تحكم Railway:**

1. **اذهب إلى Project Settings**
2. **انسخ الـ Domain للـ backend service** (يبدو مثل: `https://your-backend-service.railway.app`)
3. **انسخ الـ Domain للـ frontend service** (يبدو مثل: `https://your-frontend-service.railway.app`)

**ثم استبدل في `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app/api
NEXT_PUBLIC_APP_DOMAIN=https://your-frontend-service.railway.app
```

### 3️⃣ إعادة نشر التطبيق

بعد تحديث متغيرات البيئة:

```bash
# في Railway dashboard
1. اذهب إلى Variables في كل service
2. أضف أو عدل متغيرات البيئة
3. انقر على "Deploy" لإعادة النشر
```

### 4️⃣ التحقق من الـ Backend على Railway

**تأكد من أن الـ backend يعمل:**

1. اذهب إلى: `https://your-backend-service.railway.app/api`
2. يجب أن ترى: `{"status":"ok","message":"Rahba API is running"}`

3. جرب endpoint تسجيل الدخول:
   ```bash
   curl -X POST https://your-backend-service.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

### 5️⃣ حل مشاكل CORS (إذا وجدت)

**إذا رأيت أخطاء CORS، تأكد من أن الـ backend يسمح بـ origins التالية:**

```typescript
// في backend/src/main.ts
app.enableCors({
  origin: [
    'https://your-frontend-service.railway.app',
    'http://localhost:3000', // للتطوير المحلي
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
```

## 🔧 أدوات التشخيص

### اختبار الاتصال:
```bash
# اختبار API
curl https://your-backend-service.railway.app/api

# اختبار تسجيل الدخول
curl -X POST https://your-backend-service.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rahba.com","password":"password"}'
```

### فحص Logs في Railway:
1. اذهب إلى Railway dashboard
2. انقر على service الخاص بالـ backend
3. اذهب إلى "Logs" للتحقق من الأخطاء

## ⚠️ ملاحظات مهمة

1. **تأكد من أن البيانات في `.env.local` صحيحة**
2. **أعد نشر كلا من frontend و backend بعد تغيير المتغيرات**
3. **تحقق من أن قاعدة البيانات متصلة بشكل صحيح**
4. **تأكد من أن Clerk authentication مُعد بشكل صحيح**

## 🚀 بعد الحل

بعد تطبيق هذه الحلول:
- ✅ تسجيل الدخول سيعمل بشكل طبيعي
- ✅ API calls ستذهب إلى Railway backend
- ✅ لن تواجه مشاكل CORS

---
**💡 إذا واجهت مشاكل أخرى، تحقق من logs في Railway أولاً!**
