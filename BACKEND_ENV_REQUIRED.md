# 🚨 متغيرات البيئة المطلوبة للباكند

## 📋 **قائمة كاملة بالمتغيرات:**

### 🔐 **المتغيرات الأساسية:**
```bash
NODE_ENV=production
PORT=10000
```

### 🗄️ **قاعدة البيانات:**
```bash
DATABASE_URL=[من Render PostgreSQL Database]
```

### 🔑 **JWT Secrets:**
```bash
JWT_SECRET=Ra7ba_JWT_S3cr3t_2024_Change_This!
JWT_REFRESH_SECRET=Ra7ba_R3fr3sh_S3cr3t_2024_Change_This!
```

### 👤 **حساب المدير:**
```bash
ADMIN_EMAIL=admin@ra7ba.dz
ADMIN_PASSWORD=Admin@123!ChangeThis
```

### 🌐 **CORS & Frontend:**
```bash
FRONTEND_URL=https://ra7ba-1.onrender.com
CORS_ORIGINS=https://ra7ba-1.onrender.com,https://ra7ba-frontend.onrender.com
```

---

## 🔧 **خطوات الإصلاح:**

### 1️⃣ **اذهب إلى Render Dashboard:**
- اختر خدمة الباكند (`ra7ba` أو `ra7ba-backend`)
- اضغط على "Environment"

### 2️⃣ **تحقق من وجود هذه المتغيرات:**
- `DATABASE_URL` ✅ (يجب أن يكون موجود)
- `JWT_SECRET` ❓ (قد يكون مفقود)
- `JWT_REFRESH_SECRET` ❓ (قد يكون مفقود)
- `ADMIN_EMAIL` ❓ (قد يكون مفقود)
- `ADMIN_PASSWORD` ❓ (قد يكون مفقود)

### 3️⃣ **أضف المتغيرات المفقودة:**
```bash
JWT_SECRET=Ra7ba_JWT_S3cr3t_2024_Change_This!
JWT_REFRESH_SECRET=Ra7ba_R3fr3sh_S3cr3t_2024_Change_This!
ADMIN_EMAIL=admin@ra7ba.dz
ADMIN_PASSWORD=Admin@123!ChangeThis
FRONTEND_URL=https://ra7ba-1.onrender.com
```

### 4️⃣ **احفظ وأعد النشر:**
- اضغط "Save Changes"
- اضغط "Manual Deploy" > "Deploy Latest Commit"

---

## 🧪 **اختبار سريع الآن:**

### **جرب هذا الرابط:**
```
https://ra7ba.onrender.com/api
```

**النتائج المحتملة:**
- ✅ `{"status":"ok"...}` → الباكند يعمل
- ❌ `Internal Server Error` → مشكلة في المتغيرات
- ❌ `Cannot connect` → مشكلة في قاعدة البيانات

---

## 📱 **إرسل لي:**

1. **نتيجة اختبار** `https://ra7ba.onrender.com/api`
2. **لقطة شاشة** من Environment Variables في Render
3. **أي رسالة خطأ** تظهر في Console

---

**بمجرد إضافة المتغيرات، كل شيء سيعمل! 🚀**
