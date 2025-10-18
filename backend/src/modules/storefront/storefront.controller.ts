import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StorefrontService } from './storefront.service';

@ApiTags('storefront')
@Controller('store/:subdomain')
export class StorefrontController {
  constructor(private storefrontService: StorefrontService) {}

  @Get()
  @ApiOperation({ summary: 'Get store info' })
  async getStore(@Param('subdomain') subdomain: string) {
    return this.storefrontService.getStoreBySubdomain(subdomain);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get store products' })
  async getProducts(
    @Param('subdomain') subdomain: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.storefrontService.getStoreProducts(subdomain, {
      search,
      categoryId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
    });
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Get single product' })
  async getProduct(
    @Param('subdomain') subdomain: string,
    @Param('slug') slug: string,
  ) {
    return this.storefrontService.getProduct(subdomain, slug);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get store categories' })
  async getCategories(@Param('subdomain') subdomain: string) {
    return this.storefrontService.getStoreCategories(subdomain);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  async getFeaturedProducts(@Param('subdomain') subdomain: string) {
    return this.storefrontService.getFeaturedProducts(subdomain);
  }

  @Post('orders')
  @ApiOperation({ summary: 'Create order' })
  async createOrder(
    @Param('subdomain') subdomain: string,
    @Body() orderData: any,
  ) {
    return this.storefrontService.createOrder(subdomain, orderData);
  }
}
