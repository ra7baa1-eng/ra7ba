# 🛍️ Ra7ba - منصة التجارة الإلكترونية للسوق الجزائري

<div align="center">

![Ra7ba](https://img.shields.io/badge/Ra7ba-منصة_جزائرية-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/الحالة-جاهز_100%25-success?style=for-the-badge)

**منصة SaaS متكاملة لإنشاء وإدارة المتاجر الإلكترونية في الجزائر** 🇩🇿

[الموقع](#) • [التوثيق](#) • [الدعم](#)

</div>

---

## 🌟 **نظرة عامة**

**Ra7ba** (رحبة) هي منصة SaaS جزائرية تسمح للتجار بإنشاء متاجرهم الإلكترونية في دقائق، مع دعم كامل للسوق الجزائري:

✅ **دفع عند الاستلام (COD)**
✅ **توصيل لكل الولايات الـ58**
✅ **BaridiMob للتجار**
✅ **واجهة عربية RTL**
✅ **تكامل مع شركات التوصيل الجزائرية**

---

## 🎯 **المميزات الرئيسية**

### 🏪 **للتجار:**
- ✅ إنشاء متجر في 5 دقائق
- ✅ تجربة مجانية 7 أيام
- ✅ إدارة منتجات غير محدودة
- ✅ تتبع الطلبات بالتفصيل
- ✅ تحليلات مبيعات
- ✅ اشتراك شهري رخيص (1,350 دج)

### 🛒 **للعملاء:**
- ✅ تسوق سهل وسريع
- ✅ دفع عند الاستلام
- ✅ توصيل لكل الولايات
- ✅ تتبع الطلب أونلاين

### 👑 **للمدير:**
- ✅ لوحة تحكم شاملة
- ✅ إدارة جميع المتاجر
- ✅ موافقة المدفوعات
- ✅ إحصائيات المنصة

---

## 🏗️ **التقنيات المستخدمة**

### Backend:
```
✅ NestJS (Node.js + TypeScript)
✅ PostgreSQL + Prisma ORM
✅ JWT Authentication
✅ Multi-tenant Architecture
✅ REST API
```

### Frontend:
```
✅ Next.js 14 (React + TypeScript)
✅ TailwindCSS
✅ RTL Support (عربي)
✅ Responsive Design
```

### الميزات:
```
✅ 58 ولاية جزائرية
✅ COD (الدفع عند الاستلام)
✅ BaridiMob للاشتراكات
✅ Yalidine, Zr Express, JetExpress
✅ Cron Jobs للاشتراكات
✅ File Storage (Supabase/Railway)
```

---

## 📁 **هيكل المشروع**

```
ra7ba/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── modules/     # Auth, Admin, Merchant, Products, Orders
│   │   ├── common/      # Middleware, Guards, Decorators
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
│
├── frontend/            # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing Page
│   │   │   ├── auth/                 # Login, Register
│   │   │   ├── admin/                # Admin Dashboard
│   │   │   ├── merchant/             # Merchant Dashboard
│   │   │   └── store/                # Storefront
│   │   └── lib/
│   │       └── api.ts                # API Client
│   └── package.json
│
├── DEPLOY_EASY.md       # دليل النشر السهل
├── README.md            # التوثيق الكامل
└── demo.html            # صفحة تجريبية
```

---

## 🚀 **التشغيل السريع**

### ⚡ **الطريقة السهلة (Railway):**

اتبع الدليل: [`DEPLOY_EASY.md`](./DEPLOY_EASY.md)

### 💻 **التشغيل المحلي:**

#### 1. Backend:
```bash
cd backend
npm install
npm run start:dev
```

#### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

#### 3. افتح المتصفح:
```
Frontend: http://localhost:3000
Backend: http://localhost:3001
```

---

## 👤 **حسابات التجربة**

### Admin:
```
البريد: admin@ra7ba.com
كلمة المرور: Admin123!ChangeMe
```

⚠️ **غيّر كلمة المرور بعد أول تسجيل دخول!**

---

## 💰 **خطط الاشتراك**

### Standard - 1,350 دج/شهر
- ✅ منتجات غير محدودة
- ✅ طلبات غير محدودة
- ✅ تحليلات أساسية
- ✅ دعم عبر البريد

### Pro - 2,500 دج/شهر
- ✅ كل ميزات Standard
- ✅ تحليلات متقدمة
- ✅ دعم ذو أولوية
- ✅ نطاق مخصص
- ✅ API Access

### تجربة مجانية:
- 🎁 7 أيام مجاناً
- 📦 حتى 10 منتجات
- 🛒 حتى 20 طلب

---

## 📊 **نموذج الربح**

### مثال على الدخل الشهري:

| عدد التجار | الاشتراك | الدخل الشهري |
|------------|----------|--------------|
| 10 تجار   | Standard | 13,500 دج    |
| 20 تاجر   | Standard | 27,000 دج    |
| 50 تاجر   | Standard | 67,500 دج    |
| 100 تاجر  | Standard | 135,000 دج   |

**+ دخل إضافي من Pro Plan** 💎

---

## 🗺️ **خارطة الطريق**

### ✅ المرحلة 1 (منجزة):
- [x] Backend API كامل
- [x] Frontend كامل
- [x] Multi-tenant
- [x] Authentication
- [x] Admin Panel
- [x] Merchant Panel
- [x] Storefront
- [x] 58 ولاية

### 🔄 المرحلة 2 (قريباً):
- [ ] تطبيق موبايل
- [ ] تقارير متقدمة
- [ ] أدوات تسويق
- [ ] SMS Notifications
- [ ] نطاقات مخصصة

---

## 📞 **الدعم والتواصل**

- 📧 البريد: support@ra7ba.com
- 💬 Telegram: @ra7ba_support
- 📚 التوثيق: docs.ra7ba.com
- 🐛 المشاكل: [GitHub Issues](#)

---

## 📄 **الترخيص**

هذا المشروع مرخص تحت رخصة MIT.

---

## 🙏 **شكر وتقدير**

شكر خاص لـ:
- ✅ المجتمع الجزائري التقني
- ✅ مطوري NestJS و Next.js
- ✅ كل من ساهم في المشروع

---

## 🎉 **ابدأ الآن!**

### خطوات بسيطة:

1. **📖 اقرأ** [`DEPLOY_EASY.md`](./DEPLOY_EASY.md)
2. **🚀 انشر** على Railway
3. **💰 ابدأ** بجذب التجار
4. **📈 اكسب** من الاشتراكات!

---

<div align="center">

**صنع بحب في الجزائر** 🇩🇿 ❤️

**Ra7ba - منصة جزائرية | بتقنيات عالمية** 🌍

[الموقع](#) • [التوثيق](#) • [الدعم](#)

</div>

---

## 🔥 **آخر التحديثات**

### الإصدار 1.0.0 (2024)
- ✅ إطلاق المنصة الرسمي
- ✅ دعم كامل للسوق الجزائري
- ✅ 58 ولاية
- ✅ Multi-tenant
- ✅ 3 لوحات تحكم
- ✅ جاهز للاستخدام التجاري

---

## 💡 **نصائح للنجاح**

### 1. التسويق:
- استهدف التجار الصغار والمتوسطين
- استخدم Facebook & Instagram
- قدم عروض خاصة للشهر الأول

### 2. الدعم:
- كن سريعاً في الرد
- ساعد التجار في الإعداد
- اجمع الملاحظات

### 3. التطوير:
- استمع لطلبات التجار
- أضف ميزات تدريجياً
- حافظ على الاستقرار

---

**جاهز للانطلاق؟ ابدأ الآن! 🚀**
