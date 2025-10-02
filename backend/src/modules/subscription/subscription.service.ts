import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SubscriptionPlan, PaymentStatus } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  // Get subscription plans
  getPlans() {
    return [
      {
        id: 'standard',
        name: 'Standard',
        nameAr: 'خطة قياسية',
        price: 1350,
        currency: 'DZD',
        interval: 'month',
        features: [
          'Unlimited products',
          'Unlimited orders',
          'Basic analytics',
          'Email support',
        ],
        featuresAr: [
          'منتجات غير محدودة',
          'طلبات غير محدودة',
          'تحليلات أساسية',
          'دعم عبر البريد الإلكتروني',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        nameAr: 'خطة احترافية',
        price: 2500,
        currency: 'DZD',
        interval: 'month',
        features: [
          'Everything in Standard',
          'Advanced analytics',
          'Priority support',
          'Custom domain',
          'API access',
        ],
        featuresAr: [
          'كل ميزات الخطة القياسية',
          'تحليلات متقدمة',
          'دعم ذو أولوية',
          'نطاق مخصص',
          'الوصول إلى API',
        ],
      },
    ];
  }

  // Get current subscription
  async getCurrentSubscription(tenantId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        tenant: {
          select: {
            status: true,
            trialEndsAt: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  // Submit payment (Upload proof for BaridiMob)
  async submitPayment(
    tenantId: string,
    data: {
      plan: SubscriptionPlan;
      amount: number;
      baridimobRef?: string;
      paymentProof: string; // File URL
    },
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: data.amount,
        baridimobRef: data.baridimobRef,
        paymentProof: data.paymentProof,
        status: PaymentStatus.PENDING,
      },
    });

    // Update subscription to pending payment
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: data.plan,
        status: 'PENDING_PAYMENT',
      },
    });

    return {
      message: 'Payment submitted successfully. Waiting for admin approval.',
      messageAr: 'تم إرسال الدفع بنجاح. في انتظار موافقة المدير.',
      payment,
    };
  }

  // Get payment history
  async getPaymentHistory(tenantId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.payment.findMany({
      where: { subscriptionId: subscription.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Calculate plan prices
  calculatePlanPrice(plan: SubscriptionPlan): number {
    const prices = {
      STANDARD: 1350,
      PRO: 2500,
    };
    return prices[plan];
  }
}
