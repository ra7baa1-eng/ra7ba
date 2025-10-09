import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@/shims/prisma-client';
import { CurrentUser } from '@/common/decorators/tenant.decorator';

@ApiTags('merchant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MERCHANT)
@Controller('merchant')
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get merchant dashboard data' })
  async getDashboard(@CurrentUser() user: any) {
    return this.merchantService.getDashboard(user.tenant.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get merchant statistics' })
  async getStats(@CurrentUser() user: any) {
    return this.merchantService.getStats(user.tenant.id);
  }

  @Patch('store/settings')
  @ApiOperation({ summary: 'Update store settings' })
  async updateStoreSettings(
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.merchantService.updateStoreSettings(user.tenant.id, data);
  }

  @Get('trial-limits')
  @ApiOperation({ summary: 'Check trial limits' })
  async checkTrialLimits(@CurrentUser() user: any) {
    return this.merchantService.checkTrialLimits(user.tenant.id);
  }
}
