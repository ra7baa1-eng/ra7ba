import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminSupabaseService } from './admin-supabase.service';
import { SupabaseAuthGuard } from '../../common/auth/supabase-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('super_admin')
export class AdminSupabaseController {
  constructor(private readonly adminService: AdminSupabaseService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Tenants
  @Get('tenants')
  async getAllTenants(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllTenants(Number(page), Number(limit));
  }

  @Get('tenants/:id')
  async getTenantById(@Param('id') id: string) {
    return this.adminService.getTenantById(id);
  }

  @Put('tenants/:id/status')
  async updateTenantStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateTenantStatus(id, status);
  }

  @Delete('tenants/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTenant(@Param('id') id: string) {
    return this.adminService.deleteTenant(id);
  }

  // Subscription Requests
  @Get('subscription-requests')
  async getSubscriptionRequests(@Query('status') status?: string) {
    return this.adminService.getSubscriptionRequests(status);
  }

  @Post('subscription-requests/:id/approve')
  async approveSubscriptionRequest(@Param('id') id: string) {
    return this.adminService.approveSubscriptionRequest(id);
  }

  @Post('subscription-requests/:id/reject')
  async rejectSubscriptionRequest(@Param('id') id: string) {
    return this.adminService.rejectSubscriptionRequest(id);
  }

  // Products
  @Get('products')
  async getAllProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('tenantId') tenantId?: string,
  ) {
    return this.adminService.getAllProducts(Number(page), Number(limit), tenantId);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  // Users
  @Get('users')
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllUsers(Number(page), Number(limit));
  }

  @Put('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  // Extensions
  @Get('extensions')
  async getAllExtensions() {
    return this.adminService.getAllExtensions();
  }

  @Get('tenants/:tenantId/extensions')
  async getTenantExtensions(@Param('tenantId') tenantId: string) {
    return this.adminService.getTenantExtensions(tenantId);
  }

  // Shipping
  @Get('shipping/companies')
  async getShippingCompanies(@Query('tenantId') tenantId?: string) {
    return this.adminService.getShippingCompanies(tenantId);
  }

  // Storage
  @Get('storage/usage')
  async getStorageUsage(@Query('tenantId') tenantId?: string) {
    return this.adminService.getStorageUsage(tenantId);
  }

  @Post('storage/usage/:tenantId/refresh')
  async updateStorageUsage(@Param('tenantId') tenantId: string) {
    return this.adminService.updateStorageUsage(tenantId);
  }

  // Settings
  @Get('settings')
  async getPlatformSettings() {
    return this.adminService.getPlatformSettings();
  }

  @Put('settings/:key')
  async updatePlatformSetting(
    @Param('key') key: string,
    @Body('value') value: any,
    @Body('description') description?: string,
  ) {
    return this.adminService.updatePlatformSetting(key, value, description);
  }

  // Reports
  @Get('reports/orders')
  async getOrdersReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.adminService.getOrdersReport(startDate, endDate, tenantId);
  }
}
