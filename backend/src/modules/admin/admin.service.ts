import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { PaymentStatus, SubscriptionStatus, TenantStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Get all tenants with pagination
  async getAllTenants(page = 1, limit = 10, status?: TenantStatus) {
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return {
      data: tenants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get pending payment approvals
  async getPendingPayments() {
    return this.prisma.payment.findMany({
      where: { status: PaymentStatus.PENDING },
      include: {
        subscription: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                subdomain: true,
                owner: {
                  select: {
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Approve payment
  async approvePayment(paymentId: string, adminId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        subscription: {
          include: { tenant: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Calculate subscription period (1 month)
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    // Update payment, subscription, and tenant in transaction
    return this.prisma.$transaction(async (tx) => {
      // Approve payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.APPROVED,
          approvedBy: adminId,
          approvedAt: new Date(),
        },
      });

      // Update subscription
      await tx.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart,
          currentPeriodEnd,
        },
      });

      // Update tenant status
      await tx.tenant.update({
        where: { id: payment.subscription.tenantId },
        data: {
          status: TenantStatus.ACTIVE,
        },
      });

      return { message: 'Payment approved successfully' };
    });
  }

  // Reject payment
  async rejectPayment(paymentId: string, adminId: string, reason: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.REJECTED,
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: reason,
      },
    });

    return { message: 'Payment rejected' };
  }

  // Platform statistics
  async getPlatformStats() {
    const [
      totalTenants,
      activeTenants,
      trialTenants,
      suspendedTenants,
      totalOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { status: TenantStatus.ACTIVE } }),
      this.prisma.tenant.count({ where: { status: TenantStatus.TRIAL } }),
      this.prisma.tenant.count({ where: { status: TenantStatus.SUSPENDED } }),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.APPROVED },
        _sum: { amount: true },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          tenant: {
            select: { name: true, subdomain: true },
          },
        },
      }),
    ]);

    return {
      tenants: {
        total: totalTenants,
        active: activeTenants,
        trial: trialTenants,
        suspended: suspendedTenants,
      },
      orders: {
        total: totalOrders,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
      },
      recentOrders,
    };
  }

  // Suspend tenant
  async suspendTenant(tenantId: string, reason: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: TenantStatus.SUSPENDED },
    });

    return { message: 'Tenant suspended successfully' };
  }

  // Activate tenant
  async activateTenant(tenantId: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: TenantStatus.ACTIVE },
    });

    return { message: 'Tenant activated successfully' };
  }
}
