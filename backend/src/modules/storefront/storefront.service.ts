import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class StorefrontService {
  constructor(private prisma: PrismaService) {}

  // Get store by subdomain
  async getStoreBySubdomain(subdomain: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { subdomain },
      select: {
        id: true,
        name: true,
        nameAr: true,
        subdomain: true,
        description: true,
        descriptionAr: true,
        logo: true,
        banner: true,
        phone: true,
        address: true,
        theme: true,
        status: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Store not found');
    }

    if (tenant.status !== 'ACTIVE') {
      throw new BadRequestException('Store is not active');
    }

    return tenant;
  }

  // Get store products
  async getStoreProducts(subdomain: string, filters?: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    const tenant = await this.getStoreBySubdomain(subdomain);
    const { search, categoryId, page = 1, limit = 20, sortBy = 'createdAt' } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId: tenant.id,
      isActive: true,
      stock: { gt: 0 },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const orderBy: any = {};
    if (sortBy === 'price-asc') {
      orderBy.price = 'asc';
    } else if (sortBy === 'price-desc') {
      orderBy.price = 'desc';
    } else if (sortBy === 'name') {
      orderBy.name = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          nameAr: true,
          description: true,
          descriptionAr: true,
          price: true,
          comparePrice: true,
          images: true,
          slug: true,
          stock: true,
          isFeatured: true,
          badges: true,
          freeShipping: true,
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
        orderBy,
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
  async getProduct(subdomain: string, productSlug: string) {
    const tenant = await this.getStoreBySubdomain(subdomain);

    const product = await this.prisma.product.findFirst({
      where: {
        tenantId: tenant.id,
        slug: productSlug,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get related products
    const relatedProducts = await this.prisma.product.findMany({
      where: {
        tenantId: tenant.id,
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        price: true,
        images: true,
        slug: true,
      },
      take: 4,
    });

    return {
      ...product,
      relatedProducts,
    };
  }

  // Get store categories
  async getStoreCategories(subdomain: string) {
    const tenant = await this.getStoreBySubdomain(subdomain);

    return this.prisma.category.findMany({
      where: {
        tenantId: tenant.id,
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        slug: true,
        image: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                stock: { gt: 0 },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Get featured products
  async getFeaturedProducts(subdomain: string) {
    const tenant = await this.getStoreBySubdomain(subdomain);

    return this.prisma.product.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
        isFeatured: true,
        stock: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        price: true,
        comparePrice: true,
        images: true,
        slug: true,
        badges: true,
        freeShipping: true,
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Create order
  async createOrder(subdomain: string, orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    wilaya: string;
    commune: string;
    address: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    notes?: string;
  }) {
    const tenant = await this.getStoreBySubdomain(subdomain);

    // Calculate order total
    const productIds = orderData.items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        tenantId: tenant.id,
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Some products not found or inactive');
    }

    // Check stock
    for (const item of orderData.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.nameAr}`);
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = orderData.items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      const price = Number(product.price);
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      return {
        productName: product.name,
        productNameAr: product.nameAr,
        quantity: item.quantity,
        price: price,
        subtotal: itemSubtotal,
        product: {
          connect: { id: product.id },
        },
      };
    });

    const shippingFee = 600; // Default shipping fee
    const total = subtotal + shippingFee;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        tenantId: tenant.id,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        wilaya: orderData.wilaya,
        commune: orderData.commune,
        address: orderData.address,
        notes: orderData.notes,
        subtotal,
        shippingFee,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Decrement stock
    for (const item of orderData.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    // Increment order count
    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: { orderCount: { increment: 1 } },
    });

    return order;
  }
}
