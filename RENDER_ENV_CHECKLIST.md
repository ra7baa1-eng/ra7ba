# ✅ قائمة التحقق - متغيرات البيئة في Render

## 🔴 الباكند (Backend) - Web Service

### ✅ المتغيرات الإجبارية (يجب إضافتها كلها):

| # | Key | Value | ملاحظات |
|---|-----|-------|---------|
| 1 | `NODE_ENV` | `production` | ✅ جاهز للنسخ |
| 2 | `PORT` | `3001` | ✅ جاهز للنسخ |
| 3 | `DATABASE_URL` | `postgresql://user:pass@host/db` | ⚠️ انسخه من قاعدة البيانات |
| 4 | `JWT_SECRET` | `Ra7ba_JWT_S3cr3t_2024_X9Z!` | ⚠️ غيّر هذه القيمة! |
| 5 | `JWT_REFRESH_SECRET` | `Ra7ba_R3fr3sh_2024_Y8W!` | ⚠️ غيّر هذه القيمة! |
| 6 | `ADMIN_EMAIL` | `admin@ra7ba.com` | يمكنك تغييره |
| 7 | `ADMIN_PASSWORD` | `Admin@Ra7ba2024!` | ⚠️ غيّر هذه القيمة! |
| 8 | `FRONTEND_URL` | `https://ra7ba-frontend.onrender.com` | ⚠️ عدّله بعد نشر الفرونت اند |

---

### 🟡 المتغيرات الاختيارية (يمكن تجاهلها الآن):

| Key | Value | متى تحتاجه؟ |
|-----|-------|-------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | عند استخدام Supabase لتخزين الصور |
| `SUPABASE_KEY` | `your-key` | عند استخدام Supabase |
| `TELEGRAM_BOT_TOKEN` | `your-token` | للإشعارات عبر Telegram |
| `TELEGRAM_CHAT_ID` | `your-chat-id` | للإشعارات عبر Telegram |
| `BARIDIMOB_API_KEY` | `your-key` | للدفع عبر BaridiMob |
| `YALIDINE_API_KEY` | `your-key` | للتوصيل عبر Yalidine |

---

## 🔵 الفرونت اند (Frontend) - Static Site

### ✅ المتغيرات الإجبارية:

| # | Key | Value | ملاحظات |
|---|-----|-------|---------|
| 1 | `NODE_ENV` | `production` | ✅ جاهز للنسخ |
| 2 | `NEXT_PUBLIC_API_URL` | `https://ra7ba-backend.onrender.com/api` | ⚠️ استبدل برابط الباكند الحقيقي + `/api` |
| 3 | `NEXT_PUBLIC_APP_NAME` | `Ra7ba` | ✅ جاهز للنسخ |

---

## 📝 نموذج جاهز للنسخ

### 🔴 للباكند (عدّل القيم المطلوبة):

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://rahba_user:password@dpg-xxxxx-a.oregon-postgres.render.com/rahba_db
JWT_SECRET=Ra7ba_JWT_S3cr3t_K3y_2024_Pr0d_X9Z!
JWT_REFRESH_SECRET=Ra7ba_R3fr3sh_T0k3n_S3cr3t_2024_Y8W!
ADMIN_EMAIL=admin@ra7ba.com
ADMIN_PASSWORD=Admin@Ra7ba2024!Secure
FRONTEND_URL=https://ra7ba-frontend.onrender.com
```

### 🔵 للفرونت اند (عدّل رابط الباكند):

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://ra7ba-backend.onrender.com/api
NEXT_PUBLIC_APP_NAME=Ra7ba
```

---

## 🎯 خطوات الإضافة في Render

### للباكند أو الفرونت اند:

1. ✅ افتح Service في Render Dashboard
2. ✅ اضغط على تبويب **"Environment"** من القائمة اليسرى
3. ✅ اضغط زر **"Add Environment Variable"**
4. ✅ في حقل **Key**: ضع اسم المتغير (مثل: `NODE_ENV`)
5. ✅ في حقل **Value**: ضع القيمة (مثل: `production`)
6. ✅ اضغط **"Add"** أو **"Save"**
7. ✅ كرر العملية لكل متغير

---

## ⚠️ تحذيرات مهمة

### ❌ أخطاء شائعة:

| الخطأ | الصواب |
|-------|--------|
| `NEXT_PUBLIC_API_URL=https://backend.com` | `NEXT_PUBLIC_API_URL=https://backend.com/api` |
| نسيان `/api` في النهاية | ✅ دائماً أضف `/api` |
| استخدام External Database URL | ✅ استخدم Internal Database URL |
| ترك كلمات السر الافتراضية | ✅ غيّر JWT_SECRET و ADMIN_PASSWORD |

---

## 🔍 كيف تتحقق من نجاح الإعدادات؟

### ✅ الباكند:
1. افتح رابط الباكند في المتصفح
2. يجب أن ترى رسالة أو صفحة API
3. جرب: `https://your-backend.onrender.com/api/health`

### ✅ الفرونت اند:
1. افتح رابط الفرونت اند
2. يجب أن يظهر الموقع بدون أخطاء
3. افتح Console في المتصفح (F12)
4. لا يجب أن ترى أخطاء API connection

---

## 🆘 إذا واجهت مشاكل

### المشكلة: "Build failed"
**الحل:** تحقق من أنك أضفت جميع المتغيرات الإجبارية

### المشكلة: "Cannot connect to database"
**الحل:** تأكد من استخدام Internal Database URL وليس External

### المشكلة: "API not found" في الفرونت اند
**الحل:** تحقق من `NEXT_PUBLIC_API_URL` وتأكد من إضافة `/api`

---

## 📞 نصيحة نهائية

**ابدأ بسيط:**
1. أضف المتغيرات الإجبارية فقط (الجدول الأول)
2. انشر وتأكد من العمل
3. أضف المتغيرات الاختيارية لاحقاً عند الحاجة

**لا تقلق من الأخطاء:**
- يمكنك تعديل المتغيرات في أي وقت
- Render سيعيد النشر تلقائياً
- راجع الـ Logs إذا حدث خطأ

---

**تم إنشاؤه بواسطة Cascade AI 🤖**
**آخر تحديث: 2025-10-02**
