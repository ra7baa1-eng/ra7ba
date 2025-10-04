import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AdminService } from './modules/admin/admin.service';

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


  const port = process.env.PORT || 10000;
  await app.listen(port);

  console.log(`
  🚀 Rahba Backend is running!
  📡 API: http://localhost:${port}/api
  📚 Docs: http://localhost:${port}/api/docs
  🇩🇿 Made for Algeria with ❤️
  `);
}

bootstrap();
