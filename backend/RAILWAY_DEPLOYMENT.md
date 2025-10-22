# Railway Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Railway CLI installed: `npm i -g @railway/cli`
- Railway account and project created
- PostgreSQL database provisioned in Railway

### Environment Variables Setup

Create the following environment variables in your Railway project:

#### Database
```
DATABASE_URL=postgresql://username:password@hostname:5432/database?sslmode=require
DIRECT_URL=postgresql://username:password@hostname:5432/database?sslmode=require
```

#### Authentication (Clerk)
```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### Email Service
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### File Upload
```
IMGBB_API_KEY=your-imgbb-api-key
```

#### Payment Processing (Stripe)
```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Supabase Integration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Deployment Steps

1. **Connect to Railway:**
   ```bash
   railway login
   railway link
   ```

2. **Deploy:**
   ```bash
   railway up
   ```

3. **Set Environment Variables:**
   ```bash
   railway variables set NODE_ENV=production
   # Add all other required variables
   ```

4. **Database Migration:**
   The application will automatically run migrations on startup.

### Project Structure

```
/
├── backend/
│   ├── Dockerfile          # Multi-stage build for NestJS
│   ├── railway.toml        # Railway configuration
│   ├── src/                # Source code
│   └── package.json        # Dependencies
├── docker-compose.railway.yml  # Railway-specific compose
└── README.md               # This file
```

### Features

- ✅ Multi-tenant SaaS architecture
- ✅ PostgreSQL with Prisma ORM
- ✅ JWT authentication with refresh tokens
- ✅ File upload with ImgBB integration
- ✅ Payment processing with Stripe
- ✅ Real-time updates with Supabase
- ✅ Email notifications
- ✅ Role-based access control (Admin/Merchant)
- ✅ Trial period management
- ✅ Subscription management

### Troubleshooting

**Database Connection Issues:**
- Ensure DATABASE_URL uses SSL (sslmode=require)
- Check if PostgreSQL service is running in Railway

**Build Failures:**
- Check Node.js version (requires >=20)
- Verify all dependencies are installed
- Check memory limits in Railway settings

**Authentication Issues:**
- Verify Clerk keys are correct
- Check if Clerk domain is properly configured

### Monitoring

Railway provides built-in monitoring:
- Application logs: `railway logs`
- Service status: `railway status`
- Metrics dashboard in Railway UI

### Scaling

Railway automatically scales based on usage. For custom scaling:
```bash
railway scale web=2  # Scale web service to 2 instances
```

### Backups

Railway automatically backs up PostgreSQL databases. You can also:
- Export data: `railway run pg_dump`
- Import data: `railway run psql`

### Support

For issues specific to this deployment:
1. Check Railway logs: `railway logs`
2. Verify environment variables
3. Test database connectivity
4. Check application health endpoint
