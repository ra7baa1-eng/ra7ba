import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet() as any);

  // CORS - Allow subdomains and Render
  app.enableCors({
    origin: (origin, callback) => {
      // Development and Render origins
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://ra7ba-frontend.onrender.com',
        'https://ra7ba-backend.onrender.com',
        ...(process.env.CORS_ORIGINS?.split(',') || [])
      ];
      
      const isAllowed = !origin || allowedOrigins.some((allowed) => {
        if (allowed.includes('*')) {
          const regex = new RegExp(allowed.replace('*', '.*'));
          return regex.test(origin);
        }
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(null, false);
      }
    },
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

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
  🚀 Rahba Backend is running!
  📡 API: http://localhost:${port}/api
  📚 Docs: http://localhost:${port}/api/docs
  🇩🇿 Made for Algeria with ❤️
  `);
}

bootstrap();
