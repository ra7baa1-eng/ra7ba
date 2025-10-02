import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MerchantService } from '../merchant/merchant.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private merchantService: MerchantService,
  ) {}

  // Create product
  async create(tenantId: string, data: any) {
    // Check trial limits
    const limits = await this.merchantService.checkTrialLimits(tenantId);
    if (!limits.canAddProduct) {
      throw new ForbiddenException(limits.reason);
    }

    const product = await this.prisma.product.create({
      data: {
        ...data,
        tenantId,
        slug: this.generateSlug(data.name),
      },
    });

    // Increment product count for trial
    await this.merchantService.incrementProductCount(tenantId);

    return product;
  }

  // Get all products for tenant
  async findAll(tenantId: string, query?: any) {
    const where: any = { tenantId };

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query?.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get product by ID
  async findOne(id: string, tenantId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // Update product
  async update(id: string, tenantId: string, data: any) {
    const product = await this.findOne(id, tenantId);

    if (data.name && data.name !== product.name) {
      data.slug = this.generateSlug(data.name);
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // Delete product
  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  // Get products for storefront (public)
  async getStoreProducts(tenantId: string, query?: any) {
    const where: any = { 
      tenantId,
      isActive: true,
    };

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
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
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // Get product by slug (public)
  async getBySlug(slug: string, tenantId: string) {
    const product = await this.prisma.product.findFirst({
      where: { 
        slug, 
        tenantId,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // Helper: Generate slug
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Math.random().toString(36).substring(7);
  }
}
