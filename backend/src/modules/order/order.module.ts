import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MerchantModule } from '../merchant/merchant.module';
import { DeliveryModule } from '../delivery/delivery.module';

@Module({
  imports: [MerchantModule, DeliveryModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
