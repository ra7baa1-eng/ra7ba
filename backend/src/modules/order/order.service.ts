import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MerchantService } from '../merchant/merchant.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private merchantService: MerchantService,
  ) {}

  // Create order (Customer checkout)
  async create(tenantId: string, data: {
    items: Array<{ productId: string; quantity: number }>;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    wilaya: string;
    commune?: string;
    address: string;
    postalCode?: string;
    customerNotes?: string;
  }) {
    // Check trial limits
    const limits = await this.merchantService.checkTrialLimits(tenantId);
    if (!limits.canAddOrder) {
      throw new ForbiddenException(limits.reason);
    }

    // Get products and calculate total
    const productIds = data.items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        tenantId,
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Some products not found');
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = data.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }      
      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: product.id,
        productName: product.name,
        productNameAr: product.nameAr,
        productImage: product.thumbnail,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal,
      };
    });

    // Get delivery fee for wilaya
    const wilayaData = await this.prisma.wilaya.findFirst({
      where: { nameAr: data.wilaya },
    });

    const deliveryFee = wilayaData ? Number(wilayaData.deliveryFee) : 500; // Default 500 DZD
    const total = subtotal + deliveryFee;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        tenantId,
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        wilaya: data.wilaya,
        commune: data.commune,
        address: data.address,
        postalCode: data.postalCode,
        customerNotes: data.customerNotes,
        subtotal,
        deliveryFee,
        total,
        status: OrderStatus.PENDING,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Increment order count for trial
    await this.merchantService.incrementOrderCount(tenantId);

    return order;
  }

  // Get merchant orders
  async findAll(tenantId: string, query?: any) {
    const where: any = { tenantId };

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerPhone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            productNameAr: true,
            quantity: true,
            price: true,
            subtotal: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get order by ID
  async findOne(id: string, tenantId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Update order status
  async updateStatus(id: string, tenantId: string, status: OrderStatus, notes?: string) {
    await this.findOne(id, tenantId);

    const updateData: any = { status };

    if (notes) {
      updateData.merchantNotes = notes;
    }

    // Set timestamps based on status
    if (status === OrderStatus.CONFIRMED) {
      updateData.confirmedAt = new Date();
    } else if (status === OrderStatus.SHIPPED) {
      updateData.shippedAt = new Date();
    } else if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
    });
  }

  // Assign delivery company
  async assignDelivery(
    id: string,
    tenantId: string,
    data: { deliveryCompany: string; trackingNumber?: string },
  ) {
    await this.findOne(id, tenantId);

    return this.prisma.order.update({
      where: { id },
      data: {
        deliveryCompany: data.deliveryCompany as any,
        trackingNumber: data.trackingNumber,
      },
    });
  }

  // Track order (Public - by order number)
  async trackOrder(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        confirmedAt: true,
        shippedAt: true,
        deliveredAt: true,
        deliveryCompany: true,
        trackingNumber: true,
        customerName: true,
        wilaya: true,
        commune: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
