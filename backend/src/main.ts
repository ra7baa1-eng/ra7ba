import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AdminService } from './modules/admin/admin.service';
import * as express from 'express';
import * as path from 'path';
import { exec } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet() as any);

  // CORS - Allow all origins for now (temporary fix)
  app.enableCors({
    origin: true, // Allow all origins temporarily
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Simple health check endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.status(200).send('OK');
  });
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  app.getHttpAdapter().get('/api', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Rahba API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Rahba API')
    .setDescription('Multi-Tenant E-commerce Platform for Algeria')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('admin', 'Super Admin endpoints')
    .addTag('merchant', 'Merchant dashboard endpoints')
    .addTag('store', 'Customer storefront endpoints')
    .addTag('products', 'Product management')
    .addTag('orders', 'Order management')
    .addTag('subscription', 'Subscription & billing')
    .addTag('delivery', 'Delivery integration')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Serve local uploads directory (for StorageService local mode)
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Run maintenance tasks on boot if flag is set
  if (process.env.MAINTENANCE_FIX_FEATURES_ON_BOOT === 'true') {
    console.log('MAINTENANCE_FIX_FEATURES_ON_BOOT is true, applying feature schema fix...');
    const adminService = app.get(AdminService);
    try {
      await adminService.applyFeatureSchemaFix();
      console.log('✅ Feature schema fix applied successfully on boot.');
    } catch (error) {
      console.error('❌ Error applying feature schema fix on boot:', error);
    }
  }

  // Defer SUPER_ADMIN bootstrap to background after migrations
  if (process.env.MAINTENANCE_CREATE_ADMIN_ON_BOOT === 'true') {
    console.log('MAINTENANCE_CREATE_ADMIN_ON_BOOT=true, will bootstrap admin after migrations.');
  }


  const port = process.env.PORT || 10000;
  await app.listen(port);

  console.log(`
  🚀 Rahba Backend is running!
  📡 API: http://localhost:${port}/api
  📚 Docs: http://localhost:${port}/api/docs
  🇩🇿 صنع من طرف gribo abdo ❤️ ❤️
  `);

  const autoMig = String(process.env.AUTO_MIGRATE_ON_BOOT ?? 'true').toLowerCase() === 'true';
  if (autoMig) {
    const run = (cmd: string) => new Promise<void>((resolve, reject) => {
      exec(cmd, { env: process.env }, (err) => (err ? reject(err) : resolve()));
    });
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      const max = parseInt(process.env.DB_CONNECT_RETRIES || '20', 10);
      const wait = parseInt(process.env.DB_CONNECT_RETRY_DELAY_MS || '3000', 10);
      for (let i = 1; i <= max; i++) {
        try {
          await run('npx prisma migrate deploy');
          break;
        } catch (e) {
          await delay(wait);
        }
      }
      const autoSeed = String(process.env.AUTO_SEED_ON_BOOT ?? 'true').toLowerCase() === 'true';
      if (autoSeed) {
        try {
          await run('npx prisma db seed');
        } catch (e) {}
      }
      if (process.env.MAINTENANCE_CREATE_ADMIN_ON_BOOT === 'true') {
        const adminService = app.get(AdminService);
        try {
          const result = await adminService.createOrResetAdminUser();
          console.log('✅ Admin bootstrap (post-migrate):', result);
        } catch (error) {
          console.error('❌ Admin bootstrap failed post-migrate:', error);
        }
      }
    })();
  }
}

bootstrap();
