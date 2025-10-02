# 🚀 نشر سريع - 5 دقائق فقط!

## 📋 قائمة التحقق السريعة

### 1️⃣ Upload to GitHub ✅
```bash
git add .
git commit -m "Ready for Render"
git push
```

### 2️⃣ Create Database ✅
- New PostgreSQL
- Name: `ra7ba-db`  
- Free Plan

### 3️⃣ Deploy Backend ✅
- **Name:** `ra7ba-backend`
- **Root Directory:** `backend`
- **Build:** `npm install && npx prisma generate && npm run build`
- **Start:** `npx prisma migrate deploy && npm run start:prod`
- **Environment Variables:**
  ```
  NODE_ENV=production
  PORT=10000
  DATABASE_URL=[Copy from Database]
  JWT_SECRET=your-secret-here
  JWT_REFRESH_SECRET=your-refresh-secret-here
  ADMIN_EMAIL=admin@ra7ba.com
  ADMIN_PASSWORD=Admin123!ChangeMe
  ```

### 4️⃣ Deploy Frontend ✅
- **Name:** `ra7ba-frontend`
- **Root Directory:** `frontend`
- **Build:** `npm install && npm run build`
- **Start:** `npm run start`
- **Environment Variables:**
  ```
  NODE_ENV=production
  PORT=10000
  NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
  NEXT_PUBLIC_APP_NAME=Ra7ba
  ```

### 5️⃣ Update CORS ✅
في Backend Environment Variables:
```
CORS_ORIGINS=https://YOUR-FRONTEND-URL.onrender.com
FRONTEND_URL=https://YOUR-FRONTEND-URL.onrender.com
```

### 6️⃣ Seed Database ✅
في Backend Shell:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## 🎯 Test URLs:
- Backend: `https://YOUR-BACKEND.onrender.com/api`
- Frontend: `https://YOUR-FRONTEND.onrender.com`
- Login: admin@ra7ba.com / Admin123!ChangeMe

## 🆘 مشكلة؟
1. تحقق من Logs
2. تأكد من Environment Variables
3. اعد Deploy

**تم! 🎉**
