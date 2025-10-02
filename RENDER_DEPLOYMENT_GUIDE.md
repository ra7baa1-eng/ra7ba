# 🚀 دليل نشر مشروع Ra7ba على Render

## 📋 المشاكل التي تم إصلاحها

### ✅ 1. مشكلة الباكند (Backend)
**الخطأ:** `Cannot find module '/opt/render/project/src/backend/dist/main'`

**الحل:**
- ✅ تم إنشاء ملف `nest-cli.json` لتحديد بنية المشروع
- ✅ تم تصحيح script `start:prod` في `package.json` من `dist/src/main` إلى `dist/main`

### ✅ 2. مشكلة الفرونت اند (Frontend)
**الخطأ:** `Invalid rewrite found - destination does not start with /`

**الحل:**
- ✅ تم تحسين ملف `next.config.js` للتعامل مع متغيرات البيئة غير المحددة
- ✅ الآن يتحقق من صحة `NEXT_PUBLIC_API_URL` قبل استخدامه
- ✅ يعرض رسائل تحذير واضحة في حالة عدم تحديد المتغير

---

## 🔧 خطوات النشر على Render

### 📦 1. نشر الباكند (Backend)

1. **إنشاء Web Service جديد:**
   - اذهب إلى [Render Dashboard](https://dashboard.render.com/)
   - اضغط على "New +" → "Web Service"
   - اختر مستودع GitHub الخاص بك

2. **إعدادات البناء:**
   ```
   Name: ra7ba-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npx prisma migrate deploy && npm run start:prod
   ```

3. **متغيرات البيئة (Environment Variables):**
   - افتح ملف `backend/.env.render` وانسخ جميع المتغيرات
   - أضفها في تبويب "Environment" في Render
   - **⚠️ مهم جداً:** تأكد من تحديث `DATABASE_URL` برابط قاعدة البيانات الصحيح

4. **قاعدة البيانات:**
   - إذا لم تكن لديك قاعدة بيانات، أنشئ PostgreSQL Database في Render
   - انسخ الـ Internal Database URL
   - ضعه في متغير `DATABASE_URL`

---

### 🎨 2. نشر الفرونت اند (Frontend)

1. **إنشاء Static Site:**
   - اذهب إلى [Render Dashboard](https://dashboard.render.com/)
   - اضغط على "New +" → "Static Site"
   - اختر نفس مستودع GitHub

2. **إعدادات البناء:**
   ```
   Name: ra7ba-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: .next
   ```

3. **⚠️ متغيرات البيئة (مهم جداً):**
   
   يجب إضافة هذه المتغيرات في تبويب "Environment":
   
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://ra7ba-backend.onrender.com/api
   NEXT_PUBLIC_APP_NAME=Ra7ba
   ```

   **📝 ملاحظة مهمة:**
   - استبدل `https://ra7ba-backend.onrender.com/api` برابط الباكند الفعلي الخاص بك
   - تأكد من إضافة `/api` في نهاية الرابط
   - بدون هذا المتغير، سيفشل البناء!

---

## 🔍 التحقق من نجاح النشر

### للباكند:
1. افتح رابط الباكند في المتصفح
2. يجب أن ترى رسالة ترحيب أو صفحة API
3. جرب الوصول إلى `/api/health` أو `/api/docs` (إذا كان Swagger مفعلاً)

### للفرونت اند:
1. افتح رابط الفرونت اند في المتصفح
2. يجب أن يظهر الموقع بشكل صحيح
3. تحقق من أن الاتصال بالـ API يعمل

---

## 🐛 حل المشاكل الشائعة

### ❌ مشكلة: "Cannot find module dist/main"
**الحل:** تأكد من وجود ملف `nest-cli.json` في مجلد الباكند

### ❌ مشكلة: "Invalid rewrite found"
**الحل:** 
1. تأكد من إضافة `NEXT_PUBLIC_API_URL` في متغيرات البيئة في Render
2. تأكد من أن القيمة تبدأ بـ `http://` أو `https://`
3. لا تترك القيمة فارغة أو `undefined`

### ❌ مشكلة: "Database connection failed"
**الحل:**
1. تحقق من صحة `DATABASE_URL` في متغيرات البيئة
2. استخدم Internal Database URL وليس External
3. تأكد من أن قاعدة البيانات تعمل

### ❌ مشكلة: "Prisma migrations failed"
**الحل:**
1. تأكد من وجود ملفات migrations في مجلد `prisma/migrations`
2. إذا لم تكن موجودة، قم بإنشائها محلياً أولاً:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```
3. ثم ارفع التغييرات إلى GitHub

---

## 📚 ملفات مهمة

- `backend/nest-cli.json` - إعدادات NestJS (تم إنشاؤه)
- `backend/.env.render` - متغيرات البيئة للباكند
- `frontend/.env.render` - متغيرات البيئة للفرونت اند
- `frontend/next.config.js` - إعدادات Next.js (تم تحسينه)

---

## 🎯 الخطوات التالية

1. ✅ تأكد من رفع جميع التغييرات إلى GitHub:
   ```bash
   git add .
   git commit -m "fix: إصلاح مشاكل النشر على Render"
   git push origin master
   ```

2. ✅ انشر الباكند أولاً وانتظر حتى يكتمل النشر

3. ✅ انسخ رابط الباكند وضعه في `NEXT_PUBLIC_API_URL` للفرونت اند

4. ✅ انشر الفرونت اند

5. ✅ اختبر الموقع والتأكد من عمل جميع الميزات

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من logs في Render Dashboard
2. تأكد من جميع متغيرات البيئة
3. تحقق من أن قاعدة البيانات متصلة

---

**تم إنشاء هذا الدليل بواسطة Cascade AI 🤖**
**آخر تحديث: 2025-10-02**
