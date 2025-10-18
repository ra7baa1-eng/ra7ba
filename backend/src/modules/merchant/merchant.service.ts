import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService) {}

  // Get merchant dashboard data
  async getDashboard(tenantId: string) {
    const [tenant, stats] = await Promise.all([
      this.prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          subscription: {
            select: {
              plan: true,
              status: true,
              currentPeriodEnd: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      }),
      this.getStats(tenantId),
    ]);

    return {
      tenant,
      stats,
    };
  }

  // Get merchant statistics
  async getStats(tenantId: string) {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.count({ where: { tenantId } }),
      this.prisma.order.count({ 
        where: { tenantId, status: 'PENDING' } 
      }),
      this.prisma.order.count({ 
        where: { tenantId, status: 'DELIVERED' } 
      }),
      this.prisma.order.aggregate({
        where: { 
          tenantId,
          status: { in: ['DELIVERED', 'CONFIRMED', 'SHIPPED'] },
        },
        _sum: { total: true },
      }),
      this.prisma.order.findMany({
        where: { tenantId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            select: {
              productName: true,
              quantity: true,
              price: true,
            },
          },
        },
      }),
    ]);

    return {
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
      },
      revenue: {
        total: totalRevenue._sum.total || 0,
      },
      recentOrders,
    };
  }

  // Update store settings
  async updateStoreSettings(
    tenantId: string,
    data: {
      name?: string;
      nameAr?: string;
      description?: string;
      descriptionAr?: string;
      logo?: string;
      banner?: string;
      phone?: string;
      address?: string;
      theme?: any;
      telegramChatId?: string;
      checkoutConfig?: any;
      storeFeatures?: any;
      privacyPolicy?: string;
      termsOfService?: string;
      returnPolicy?: string;
      thankYouMessage?: string;
      thankYouImage?: string;
    },
  ) {
    console.log('🔄 Updating store settings for tenant:', tenantId);
    console.log('📦 Data received:', JSON.stringify(data, null, 2));

    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: data.name,
        nameAr: data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        logo: data.logo,
        banner: data.banner,
        phone: data.phone,
        address: data.address,
        theme: data.theme,
        telegramChatId: data.telegramChatId,
        checkoutConfig: data.checkoutConfig,
        storeFeatures: data.storeFeatures,
        privacyPolicy: data.privacyPolicy,
        termsOfService: data.termsOfService,
        returnPolicy: data.returnPolicy,
        thankYouMessage: data.thankYouMessage,
        thankYouImage: data.thankYouImage,
      },
    });

    console.log('✅ Store updated successfully:', updated.id);
    return updated;
  }

  // Check trial limits
  async checkTrialLimits(tenantId: string): Promise<{
    canAddProduct: boolean;
    canAddOrder: boolean;
    reason?: string;
  }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        status: true,
        orderCount: true,
        productCount: true,
        trialEndsAt: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // If not in trial, no limits
    if (tenant.status !== 'TRIAL') {
      return { canAddProduct: true, canAddOrder: true };
    }

    // Check trial expiry
    if (tenant.trialEndsAt && new Date() > tenant.trialEndsAt) {
      return {
        canAddProduct: false,
        canAddOrder: false,
        reason: 'Trial period has expired',
      };
    }

    // Check limits
    const canAddProduct = tenant.productCount < 10;
    const canAddOrder = tenant.orderCount < 20;

    return {
      canAddProduct,
      canAddOrder,
      reason: !canAddProduct ? 'Trial product limit reached (10 max)' : 
              !canAddOrder ? 'Trial order limit reached (20 max)' : undefined,
    };
  }

  // Increment product count (for trial)
  async incrementProductCount(tenantId: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { productCount: { increment: 1 } },
    });
  }

  // Increment order count (for trial)
  async incrementOrderCount(tenantId: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { orderCount: { increment: 1 } },
    });
  }

  // ==================== PRODUCTS CRUD ====================

  // Get all products for tenant
  async getProducts(tenantId: string, filters?: {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { search, categoryId, isActive, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              nameAr: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single product
  async getProduct(tenantId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // Create product
  async createProduct(tenantId: string, data: any) {
    // Check trial limits
    const limits = await this.checkTrialLimits(tenantId);
    if (!limits.canAddProduct) {
      throw new ForbiddenException(limits.reason);
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = this.generateSlug(data.name);
    }

    const product = await this.prisma.product.create({
      data: {
        ...data,
        tenantId,
      },
      include: {
        category: true,
      },
    });

    // Increment product count
    await this.incrementProductCount(tenantId);

    return product;
  }

  // Update product
  async updateProduct(tenantId: string, productId: string, data: any) {
    // Verify ownership
    const existing = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data,
      include: {
        category: true,
      },
    });
  }

  // Delete product
  async deleteProduct(tenantId: string, productId: string) {
    // Verify ownership
    const existing = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });

    // Decrement product count
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { productCount: { decrement: 1 } },
    });

    return { message: 'Product deleted successfully' };
  }

  // Duplicate product
  async duplicateProduct(tenantId: string, productId: string) {
    const original = await this.getProduct(tenantId, productId);

    const { id, createdAt, updatedAt, ...productData } = original as any;

    return this.createProduct(tenantId, {
      ...productData,
      name: `${productData.name} (نسخة)`,
      nameAr: `${productData.nameAr} (نسخة)`,
      slug: `${productData.slug}-copy-${Date.now()}`,
      isActive: false,
    });
  }

  // ==================== CATEGORIES ====================

  // Get all categories for tenant
  async getCategories(tenantId: string) {
    return this.prisma.category.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get single category
  async getCategory(tenantId: string, categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, tenantId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // Create category
  async createCategory(tenantId: string, data: any) {
    if (!data.slug) {
      data.slug = this.generateSlug(data.name);
    }

    return this.prisma.category.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  // Update category
  async updateCategory(tenantId: string, categoryId: string, data: any) {
    const existing = await this.prisma.category.findFirst({
      where: { id: categoryId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data,
    });
  }

  // Delete category
  async deleteCategory(tenantId: string, categoryId: string) {
    const existing = await this.prisma.category.findFirst({
      where: { id: categoryId, tenantId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    if (existing._count.products > 0) {
      throw new ForbiddenException('Cannot delete category with products. Move or delete products first.');
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: 'Category deleted successfully' };
  }

  // ==================== ORDERS MANAGEMENT ====================

  // Get all orders for tenant
  async getOrders(tenantId: string, filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              price: true,
              subtotal: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single order
  async getOrder(tenantId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameAr: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Update order
  async updateOrder(tenantId: string, orderId: string, data: any) {
    const existing = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data,
    });
  }

  // Helper: Generate slug
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
