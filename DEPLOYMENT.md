# 🚀 Rahba Deployment Guide

## Development Setup (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/rahba.git
cd rahba

# Install backend dependencies
cd backend
npm install
cp .env.example .env

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env.local
```

### Step 2: Configure Environment

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rahba"
JWT_SECRET="your-super-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_DOMAIN=localhost:3000
```

### Step 3: Database Setup

```bash
cd backend

# Run migrations
npx prisma migrate dev

# Seed database (creates admin + wilayas)
npx prisma db seed
```

### Step 4: Run Applications

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Docs**: http://localhost:3001/api/docs

---

## Docker Setup (Recommended)

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

---

## Railway Deployment

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Create Railway Project

```bash
railway init
railway link
```

### Step 3: Add PostgreSQL Database

```bash
railway add postgresql
```

### Step 4: Set Environment Variables

In Railway Dashboard, add these variables for **Backend**:

```env
DATABASE_URL=<automatically set by Railway>
JWT_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>
PORT=3001
NODE_ENV=production
ADMIN_EMAIL=admin@rahba.dz
ADMIN_PASSWORD=<your-admin-password>
```

For **Frontend**:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_APP_DOMAIN=your-app.railway.app
```

### Step 5: Deploy

```bash
# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up

# Run migrations
cd ../backend
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

### Step 6: Setup Custom Domain & Subdomains

In Railway Dashboard:
1. Go to Settings → Domains
2. Add your custom domain (e.g., `rahba.dz`)
3. Configure DNS:
   - Main app: `app.rahba.dz` → Frontend service
   - API: `api.rahba.dz` → Backend service
   - Wildcard: `*.rahba.dz` → Frontend service (for tenants)

### Step 7: Configure Subdomain Routing

Update backend `.env`:
```env
APP_DOMAIN=rahba.dz
CORS_ORIGINS=https://rahba.dz,https://*.rahba.dz
```

---

## GitHub Actions CI/CD

### Setup Secrets

In GitHub repository → Settings → Secrets, add:

- `RAILWAY_TOKEN`: Your Railway API token

### Auto-Deploy on Push

Every push to `main` branch will automatically:
1. Build & test
2. Deploy to Railway
3. Run database migrations
4. Perform health check

---

## Post-Deployment Checklist

### ✅ Backend
- [ ] API accessible at `https://api.rahba.dz`
- [ ] Swagger docs at `https://api.rahba.dz/api/docs`
- [ ] Database connected and migrated
- [ ] Super admin account created
- [ ] Cron jobs running

### ✅ Frontend
- [ ] Main site at `https://rahba.dz`
- [ ] Admin panel at `https://admin.rahba.dz`
- [ ] Test subdomain works: `https://test.rahba.dz`

### ✅ Configuration
- [ ] Environment variables set
- [ ] CORS configured for subdomains
- [ ] File storage (Supabase) configured
- [ ] Email/Telegram notifications configured

---

## Default Admin Credentials

After seeding:
- **Email**: `admin@rahba.dz`
- **Password**: `Admin@123!Change`

⚠️ **IMPORTANT**: Change the admin password immediately after first login!

---

## Monitoring & Logs

### Railway Logs
```bash
railway logs --service backend
railway logs --service frontend
```

### Database Access
```bash
railway connect postgres
```

### Health Checks

Backend health endpoint:
```bash
curl https://api.rahba.dz/api/health
```

---

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL
railway variables

# Test connection
railway run npx prisma db push
```

### Subdomain Not Working
1. Verify DNS wildcard record: `*.rahba.dz` → Railway frontend
2. Check CORS in backend .env
3. Restart services

### Migration Errors
```bash
# Reset database (⚠️ USE WITH CAUTION)
railway run npx prisma migrate reset

# Or apply specific migration
railway run npx prisma migrate deploy
```

---

## Backup & Restore

### Backup Database
```bash
railway connect postgres
pg_dump rahba > backup.sql
```

### Restore Database
```bash
railway connect postgres
psql rahba < backup.sql
```

---

## Scaling

Railway automatically scales based on traffic. For manual scaling:

1. Go to Railway Dashboard
2. Select service
3. Adjust resources in Settings

---

## Support

For issues, check:
- Railway logs
- Database connection
- Environment variables
- API docs: `/api/docs`

---

**Made with ❤️ for Algeria** 🇩🇿
