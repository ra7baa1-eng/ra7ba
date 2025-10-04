import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '@/common/decorators/tenant.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('tenants')
  @ApiOperation({ summary: 'Get all tenants (Super Admin only)' })
  async getAllTenants(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllTenants(page, limit, status as any);
  }

  @Get('payments/pending')
  @ApiOperation({ summary: 'Get pending payment approvals' })
  async getPendingPayments() {
    return this.adminService.getPendingPayments();
  }

  @Post('payments/:id/approve')
  @ApiOperation({ summary: 'Approve payment' })
  async approvePayment(
    @Param('id') paymentId: string,
    @CurrentUser() user: any,
  ) {
    return this.adminService.approvePayment(paymentId, user.id);
  }

  @Post('payments/:id/reject')
  @ApiOperation({ summary: 'Reject payment' })
  async rejectPayment(
    @Param('id') paymentId: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.adminService.rejectPayment(paymentId, user.id, reason);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  async getPlatformStats() {
    return this.adminService.getPlatformStats();
  }

  @Patch('tenants/:id/suspend')
  @ApiOperation({ summary: 'Suspend tenant' })
  async suspendTenant(
    @Param('id') tenantId: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.suspendTenant(tenantId, reason);
  }

  @Patch('tenants/:id/activate')
  @ApiOperation({ summary: 'Activate tenant' })
  async activateTenant(@Param('id') tenantId: string) {
    return this.adminService.activateTenant(tenantId);
  }

  @Post('maintenance/fix-features')
  @ApiOperation({ summary: 'Apply feature schema fix (Super Admin only)' })
  async applyFeatureSchemaFix() {
    return this.adminService.applyFeatureSchemaFix();
  }
}
