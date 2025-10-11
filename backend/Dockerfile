# ========================
# 1) Build stage
# ========================
FROM node:20-alpine AS builder

# أدوات لازمة لتشغيل Prisma engine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# رفع حد الذاكرة أثناء البناء (مفيد على بيئات RAM منخفضة)
ENV NODE_OPTIONS=--max-old-space-size=512

# تثبيت التبعيات (تستخدم package-lock.json لنفس الإصدارات)
COPY backend/package*.json ./
RUN npm ci

# نسخ كود المصدر وملفات Prisma
COPY backend/ ./
RUN npx prisma generate

# بناء NestJS
RUN npm run build

# حذف تبعيات التطوير والإبقاء على تبعيات الإنتاج فقط
RUN npm prune --omit=dev

# ========================
# 2) Runtime stage
# ========================
FROM node:20-alpine

# أدوات لازمة + curl للـ Healthcheck
RUN apk add --no-cache openssl libc6-compat curl

WORKDIR /app

ENV NODE_ENV=production
# رفع حد الذاكرة في التشغيل أيضاً
ENV NODE_OPTIONS=--max-old-space-size=512

# نسخ تبعيات الإنتاج والـ dist وملفات prisma من مرحلة البناء
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Install Prisma CLI at runtime for automatic migrations
RUN npm install --no-save prisma

# المنفذ الافتراضي في التطبيق Nest هو 10000 (أو PORT من البيئة)
EXPOSE 10000

# Healthcheck على /api
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/api || exit 1

# شغّل التطبيق (يفضّل أن يكون start:prod = "node --max-old-space-size=512 dist/main" في package.json)
<<<<<<< HEAD
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
=======
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
>>>>>>> 5d582f9ae8a6d6035f9fa17333cd445d639e748c
