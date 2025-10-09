import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { AdminModule } from './modules/admin/admin.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { StorageModule } from './modules/storage/storage.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SettingModule } from './modules/setting/setting.module';
import { CronModule } from './modules/cron/cron.module';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Cron jobs
    ScheduleModule.forRoot(),
    
    // Core modules
    SupabaseModule,
    
    // Feature modules
    AuthModule,
    TenantModule,
    AdminModule,
    MerchantModule,
    ProductModule,
    OrderModule,
    SubscriptionModule,
    DeliveryModule,
    StorageModule,
    NotificationModule,
    SettingModule,
    CronModule,
  ],
})
export class AppModule {}
