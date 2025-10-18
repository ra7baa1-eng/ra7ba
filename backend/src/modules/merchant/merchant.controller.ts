import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '@/common/decorators/tenant.decorator';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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
    @Body() data: UpdateStoreSettingsDto,
  ) {
    return this.merchantService.updateStoreSettings(user.tenant.id, data);
  }

  @Get('trial-limits')
  @ApiOperation({ summary: 'Check trial limits' })
  async checkTrialLimits(@CurrentUser() user: any) {
    return this.merchantService.checkTrialLimits(user.tenant.id);
  }

  // ==================== PRODUCTS ====================

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  async getProducts(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.merchantService.getProducts(user.tenant.id, {
      search,
      categoryId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get single product' })
  async getProduct(
    @CurrentUser() user: any,
    @Param('id') productId: string,
  ) {
    return this.merchantService.getProduct(user.tenant.id, productId);
  }

  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  async createProduct(
    @CurrentUser() user: any,
    @Body() data: CreateProductDto,
  ) {
    return this.merchantService.createProduct(user.tenant.id, data);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(
    @CurrentUser() user: any,
    @Param('id') productId: string,
    @Body() data: UpdateProductDto,
  ) {
    return this.merchantService.updateProduct(user.tenant.id, productId, data);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  async deleteProduct(
    @CurrentUser() user: any,
    @Param('id') productId: string,
  ) {
    return this.merchantService.deleteProduct(user.tenant.id, productId);
  }

  @Post('products/:id/duplicate')
  @ApiOperation({ summary: 'Duplicate product' })
  async duplicateProduct(
    @CurrentUser() user: any,
    @Param('id') productId: string,
  ) {
    return this.merchantService.duplicateProduct(user.tenant.id, productId);
  }

  // ==================== CATEGORIES ====================

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories(@CurrentUser() user: any) {
    return this.merchantService.getCategories(user.tenant.id);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get single category' })
  async getCategory(
    @CurrentUser() user: any,
    @Param('id') categoryId: string,
  ) {
    return this.merchantService.getCategory(user.tenant.id, categoryId);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create category' })
  async createCategory(
    @CurrentUser() user: any,
    @Body() data: CreateCategoryDto,
  ) {
    return this.merchantService.createCategory(user.tenant.id, data);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(
    @CurrentUser() user: any,
    @Param('id') categoryId: string,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.merchantService.updateCategory(user.tenant.id, categoryId, data);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(
    @CurrentUser() user: any,
    @Param('id') categoryId: string,
  ) {
    return this.merchantService.deleteCategory(user.tenant.id, categoryId);
  }

  // ==================== ORDERS ====================

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  async getOrders(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.merchantService.getOrders(user.tenant.id, {
      search,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get single order' })
  async getOrder(
    @CurrentUser() user: any,
    @Param('id') orderId: string,
  ) {
    return this.merchantService.getOrder(user.tenant.id, orderId);
  }

  @Patch('orders/:id')
  @ApiOperation({ summary: 'Update order' })
  async updateOrder(
    @CurrentUser() user: any,
    @Param('id') orderId: string,
    @Body() data: UpdateOrderDto,
  ) {
    return this.merchantService.updateOrder(user.tenant.id, orderId, data);
  }
}
