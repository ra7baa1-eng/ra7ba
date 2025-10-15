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
    },
  ) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data,
    });
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
}
