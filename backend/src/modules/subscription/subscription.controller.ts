import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '@/common/decorators/tenant.decorator';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get subscription plans' })
  getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('current')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get current subscription (Merchant)' })
  async getCurrentSubscription(@CurrentUser() user: any) {
    return this.subscriptionService.getCurrentSubscription(user.tenant.id);
  }

  @Post('payment/submit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiOperation({ summary: 'Submit payment proof (Merchant)' })
  async submitPayment(@CurrentUser() user: any, @Body() data: any) {
    return this.subscriptionService.submitPayment(user.tenant.id, data);
  }

  @Get('payments/history')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get payment history (Merchant)' })
  async getPaymentHistory(@CurrentUser() user: any) {
    return this.subscriptionService.getPaymentHistory(user.tenant.id);
  }
}
