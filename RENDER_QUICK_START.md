# 🚀 Ra7ba Platform - Render Quick Start

> **منصة Ra7ba جاهزة 100% للنشر على Render.com** 🇩🇿

---

## ⚡ النشر السريع (10 دقائق)

### 1️⃣ GitHub
```bash
git init
git add .
git commit -m "Ra7ba Platform"
git push origin main
```

### 2️⃣ Render.com
- **Database**: PostgreSQL (Free)
- **Backend**: Web Service (Free)
- **Frontend**: Web Service (Free)

### 3️⃣ Environment Variables

**Backend:**
```env
DATABASE_URL=<postgres-internal-url>
JWT_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>
ADMIN_EMAIL=admin@ra7ba.com
ADMIN_PASSWORD=Admin123!ChangeMe
FRONTEND_URL=<frontend-url>
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=<backend-url>/api
NEXT_PUBLIC_APP_NAME=Ra7ba
```

### 4️⃣ Seed Database
```bash
npx prisma db seed
```

---

## 📚 الأدلة الكاملة

| الملف | الوصف |
|-------|-------|
| `DEPLOY_RENDER.md` | دليل كامل ومفصل بالعربية |
| `نشر_راندر_سريع.txt` | خطوات بسيطة للمبتدئين |
| `backend/.env.render` | كل متغيرات Backend |
| `frontend/.env.render` | كل متغيرات Frontend |
| `render.yaml` | تكوين تلقائي (اختياري) |

---

## ✅ Build Commands

### Backend
```bash
# Build
npm install && npx prisma generate && npm run build

# Start
npx prisma migrate deploy && npm run start:prod
```

### Frontend
```bash
# Build
npm install && npm run build

# Start
npm run start
```

---

## 🎯 Default Admin

```
Email: admin@ra7ba.com
Password: Admin123!ChangeMe
```

⚠️ **Change password immediately!**

---

## 💡 Tips

- ✅ Use **Internal Database URL** (not External)
- ✅ Free plan sleeps after 15 minutes
- ✅ Use UptimeRobot to keep alive
- ✅ Auto-deploy on every `git push`

---

## 📞 Need Help?

1. Read: `DEPLOY_RENDER.md`
2. Check: `نشر_راندر_سريع.txt`
3. Review: Logs in Render Dashboard

---

**Made with ❤️ in Algeria 🇩🇿**

**Ra7ba - منصة جزائرية بتقنيات عالمية**
