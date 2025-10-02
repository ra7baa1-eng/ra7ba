# ⚡ Rahba Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker (Easiest)

```bash
# Clone repository
git clone https://github.com/yourusername/rahba.git
cd rahba

# Start everything
docker-compose up -d

# Wait 30 seconds, then visit:
# http://localhost:3000
```

**Default Admin Login:**
- Email: `admin@rahba.dz`
- Password: `Admin@123!Change`

---

### Option 2: Manual Setup

```bash
# 1. Clone & Install
git clone https://github.com/yourusername/rahba.git
cd rahba

# 2. Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL

# 3. Database
npx prisma migrate dev
npx prisma db seed

# 4. Start Backend
npm run start:dev

# 5. In NEW terminal - Frontend Setup
cd ../frontend
npm install
cp .env.example .env.local

# 6. Start Frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

---

## 🎯 Test the Platform

### 1. Login as Super Admin
- Go to http://localhost:3000/auth/login
- Email: `admin@rahba.dz`
- Password: `Admin@123!Change`

### 2. Create a Test Merchant Store
- Register: http://localhost:3000/auth/register
- Fill in store details
- Choose subdomain (e.g., "mystore")

### 3. Access Merchant Dashboard
- Login with merchant credentials
- Add products
- View trial status

### 4. View Store (Customer View)
- Visit: http://mystore.localhost:3000
- Browse products
- Place test order

---

## 📋 Key Features to Test

### ✅ Super Admin Panel
- View all merchants
- Approve/reject subscription payments
- View platform statistics

### ✅ Merchant Dashboard
- Add/edit products
- Manage orders
- Upload payment proof for subscription
- View analytics

### ✅ Customer Storefront
- Browse products (Arabic RTL)
- Add to cart
- Checkout with COD
- Track order

---

## 🔧 Common Commands

```bash
# Backend
cd backend
npm run start:dev       # Development
npm run build          # Build
npm run start:prod     # Production
npx prisma studio      # Database GUI

# Frontend
cd frontend
npm run dev           # Development
npm run build         # Build
npm run start         # Production

# Docker
docker-compose up -d         # Start all
docker-compose down          # Stop all
docker-compose logs -f       # View logs
docker-compose restart       # Restart all
```

---

## 📦 Project Structure

```
rahba/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── common/      # Shared code
│   │   └── main.ts      # Entry point
│   ├── prisma/          # Database schema
│   └── package.json
│
├── frontend/            # Next.js App
│   ├── src/
│   │   ├── app/        # Pages
│   │   └── components/ # UI components
│   └── package.json
│
├── docker-compose.yml   # Docker setup
└── README.md           # Main docs
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 3001 (backend)
npx kill-port 3001
```

### Database Connection Error
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Or check DATABASE_URL in .env
```

### Migration Issues
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

---

## 📚 Next Steps

1. Read full [README.md](./README.md)
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. Explore API docs at http://localhost:3001/api/docs
4. Customize the frontend theme
5. Configure payment gateways (BaridiMob)
6. Setup delivery services (Yalidine, etc.)

---

## 💡 Tips

- **Trial Period**: 7 days, 20 orders, 10 products max
- **Subscription Plans**: Standard (1,350 DZD), Pro (2,500 DZD)
- **Payment Method**: BaridiMob for merchants, COD for customers
- **Delivery**: All 58 Algerian wilayas supported

---

## 🆘 Need Help?

- Check logs: `docker-compose logs -f`
- View database: `npx prisma studio`
- API documentation: http://localhost:3001/api/docs

---

**Happy coding! 🇩🇿 صنع بحب في الجزائر**
