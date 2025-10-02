# 🎯 دليل متغيرات البيئة لـ Render - شرح مبسط

## 📌 ما هي متغيرات البيئة؟
هي معلومات سرية أو إعدادات يحتاجها مشروعك للعمل (مثل: كلمات السر، روابط قواعد البيانات، إلخ)

---

## 🔴 الباكند (Backend) - Web Service

### 📍 أين تضع المتغيرات؟
1. اذهب إلى Render Dashboard
2. افتح الـ Backend Service (ra7ba-backend)
3. اضغط على تبويب **"Environment"** من القائمة اليسرى
4. اضغط **"Add Environment Variable"**
5. أضف كل متغير على حدة

---

### ✅ المتغيرات المطلوبة للباكند (إجبارية):

#### 1️⃣ **NODE_ENV**
```
Key: NODE_ENV
Value: production
```
📝 **الشرح:** يخبر التطبيق أنه في وضع الإنتاج (Production)

---

#### 2️⃣ **PORT**
```
Key: PORT
Value: 3001
```
📝 **الشرح:** رقم البورت الذي سيعمل عليه الباكند

---

#### 3️⃣ **DATABASE_URL** ⚠️ مهم جداً
```
Key: DATABASE_URL
Value: [سيتم شرحه بالتفصيل]
```

**📖 كيف تحصل على قيمة DATABASE_URL؟**

**الطريقة 1: إذا أنشأت قاعدة بيانات في Render**
1. اذهب إلى Dashboard
2. اضغط "New +" → "PostgreSQL"
3. أنشئ قاعدة بيانات جديدة
4. بعد الإنشاء، افتح القاعدة
5. انسخ **"Internal Database URL"** (مهم: Internal وليس External)
6. الصق الرابط في Value

**مثال على الشكل:**
```
postgresql://rahba_user:xYz123ABC@dpg-abc123-a.oregon-postgres.render.com/rahba_db
```

**الطريقة 2: إذا كانت لديك قاعدة بيانات خارجية**
استخدم الرابط الخاص بها

---

#### 4️⃣ **JWT_SECRET** ⚠️ مهم للأمان
```
Key: JWT_SECRET
Value: [كلمة سر قوية وعشوائية]
```

📝 **الشرح:** مفتاح سري لتشفير tokens المستخدمين

**💡 كيف تنشئ كلمة سر قوية؟**
- اذهب إلى: https://randomkeygen.com/
- أو استخدم هذا المثال (غيّره!): `Ra7ba_JWT_S3cr3t_K3y_2024_Pr0d_X9Z!`

---

#### 5️⃣ **JWT_REFRESH_SECRET** ⚠️ مهم للأمان
```
Key: JWT_REFRESH_SECRET
Value: [كلمة سر قوية أخرى مختلفة]
```

📝 **الشرح:** مفتاح سري آخر لتجديد tokens

**مثال:** `Ra7ba_R3fr3sh_T0k3n_S3cr3t_2024_Y8W!`

---

#### 6️⃣ **ADMIN_EMAIL**
```
Key: ADMIN_EMAIL
Value: admin@ra7ba.com
```
📝 **الشرح:** البريد الإلكتروني للمدير الأساسي (يمكنك تغييره لاحقاً)

---

#### 7️⃣ **ADMIN_PASSWORD**
```
Key: ADMIN_PASSWORD
Value: [كلمة سر قوية للمدير]
```
📝 **الشرح:** كلمة المرور للدخول كمدير

**مثال:** `Admin@Ra7ba2024!Secure`

---

#### 8️⃣ **FRONTEND_URL** ⚠️ مهم
```
Key: FRONTEND_URL
Value: [سيتم الحصول عليه بعد نشر الفرونت اند]
```

📝 **الشرح:** رابط موقع الفرونت اند

**⚠️ ملاحظة:** 
- في البداية، ضع أي قيمة مؤقتة: `https://ra7ba.onrender.com`
- بعد نشر الفرونت اند، ارجع وعدّل هذا المتغير بالرابط الحقيقي

---

### 🟡 المتغيرات الاختيارية للباكند (يمكن تجاهلها في البداية):

#### **Supabase** (لتخزين الصور)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-key-here
```
📝 إذا لم تستخدم Supabase، لا تضيفها

#### **Telegram Bot** (للإشعارات)
```
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_CHAT_ID=your-chat-id
```

#### **خدمات الدفع والتوصيل الجزائرية**
```
BARIDIMOB_API_KEY=your-key
YALIDINE_API_KEY=your-key
ZR_EXPRESS_API_KEY=your-key
```
📝 ستحتاجها لاحقاً عند التكامل مع هذه الخدمات

---

## 🔵 الفرونت اند (Frontend) - Static Site

### 📍 أين تضع المتغيرات؟
1. اذهب إلى Render Dashboard
2. افتح الـ Frontend Service (ra7ba-frontend)
3. اضغط على تبويب **"Environment"**
4. اضغط **"Add Environment Variable"**

---

### ✅ المتغيرات المطلوبة للفرونت اند (إجبارية):

#### 1️⃣ **NODE_ENV**
```
Key: NODE_ENV
Value: production
```

---

#### 2️⃣ **NEXT_PUBLIC_API_URL** ⚠️ الأهم!
```
Key: NEXT_PUBLIC_API_URL
Value: [رابط الباكند]/api
```

📝 **الشرح:** رابط الـ API الخاص بالباكند

**📖 كيف تحصل على القيمة؟**

1. **أولاً:** انشر الباكند وانتظر حتى يكتمل النشر
2. **ثانياً:** افتح Backend Service في Render
3. **ثالثاً:** في الأعلى ستجد رابط مثل:
   ```
   https://ra7ba-backend.onrender.com
   ```
4. **رابعاً:** أضف `/api` في النهاية:
   ```
   https://ra7ba-backend.onrender.com/api
   ```
5. **خامساً:** ضع هذا الرابط الكامل في Value

**⚠️ مهم جداً:**
- لا تنسى `/api` في النهاية
- بدون هذا المتغير، الفرونت اند لن يعمل!

---

#### 3️⃣ **NEXT_PUBLIC_APP_NAME**
```
Key: NEXT_PUBLIC_APP_NAME
Value: Ra7ba
```
📝 **الشرح:** اسم التطبيق (اختياري لكن مفيد)

---

## 📋 ملخص سريع - خطوة بخطوة

### 🎯 الترتيب الصحيح:

#### **المرحلة 1: إنشاء قاعدة البيانات**
1. أنشئ PostgreSQL Database في Render
2. انسخ Internal Database URL

#### **المرحلة 2: نشر الباكند**
1. أنشئ Web Service للباكند
2. أضف المتغيرات الإجبارية:
   - `NODE_ENV=production`
   - `PORT=3001`
   - `DATABASE_URL=[الرابط من المرحلة 1]`
   - `JWT_SECRET=[كلمة سر قوية]`
   - `JWT_REFRESH_SECRET=[كلمة سر قوية أخرى]`
   - `ADMIN_EMAIL=admin@ra7ba.com`
   - `ADMIN_PASSWORD=[كلمة سر قوية]`
   - `FRONTEND_URL=https://ra7ba.onrender.com` (مؤقت)
3. انتظر حتى يكتمل النشر
4. انسخ رابط الباكند

#### **المرحلة 3: نشر الفرونت اند**
1. أنشئ Static Site للفرونت اند
2. أضف المتغيرات:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_API_URL=[رابط الباكند]/api`
   - `NEXT_PUBLIC_APP_NAME=Ra7ba`
3. انتظر حتى يكتمل النشر
4. انسخ رابط الفرونت اند

#### **المرحلة 4: التحديث النهائي**
1. ارجع للباكند
2. عدّل متغير `FRONTEND_URL` بالرابط الحقيقي للفرونت اند
3. احفظ (سيعيد النشر تلقائياً)

---

## 🖼️ مثال عملي كامل

### الباكند:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://rahba_user:xYz123@dpg-abc123-a.oregon-postgres.render.com/rahba_db
JWT_SECRET=Ra7ba_JWT_S3cr3t_K3y_2024_Pr0d_X9Z!
JWT_REFRESH_SECRET=Ra7ba_R3fr3sh_T0k3n_S3cr3t_2024_Y8W!
ADMIN_EMAIL=admin@ra7ba.com
ADMIN_PASSWORD=Admin@Ra7ba2024!Secure
FRONTEND_URL=https://ra7ba-frontend.onrender.com
```

### الفرونت اند:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://ra7ba-backend.onrender.com/api
NEXT_PUBLIC_APP_NAME=Ra7ba
```

---

## ❓ أسئلة شائعة

### س: من أين أحصل على رابط الباكند؟
**ج:** بعد نشر الباكند، ستجده في أعلى صفحة الـ Service في Render

### س: هل يجب أن أضع كل المتغيرات؟
**ج:** المتغيرات الإجبارية فقط في البداية. الباقي اختياري

### س: ماذا لو نسيت متغير؟
**ج:** يمكنك إضافته لاحقاً. الموقع سيعيد النشر تلقائياً

### س: كيف أعرف إذا كانت المتغيرات صحيحة؟
**ج:** إذا نجح النشر وعمل الموقع، فهي صحيحة! 😊

---

## 🎉 نصيحة أخيرة

**لا تقلق!** 
- ابدأ بالمتغيرات الإجبارية فقط
- يمكنك إضافة الباقي لاحقاً
- Render سيخبرك إذا كان هناك خطأ

**حظاً موفقاً! 🚀**
