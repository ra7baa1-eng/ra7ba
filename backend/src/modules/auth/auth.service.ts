import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@/shims/prisma-client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // Register new merchant
  async registerMerchant(dto: {
    email: string;
    password: string;
    name: string;
    phone: string;
    storeName: string;
    storeNameAr: string;
    subdomain: string;
  }) {
    try {
      // Basic validation before DB work
      if (!dto.email || !dto.password || !dto.name || !dto.phone || !dto.storeName || !dto.storeNameAr || !dto.subdomain) {
        throw new BadRequestException('Missing required fields');
      }

      // Check if email exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Check if subdomain exists (select minimal fields to avoid DB column drift)
      const existingTenant = await this.prisma.tenant.findUnique({
        where: { subdomain: dto.subdomain },
        select: { id: true },
      });

      if (existingTenant) {
        throw new ConflictException('Subdomain already taken');
      }

      // Validate subdomain format (alphanumeric, lowercase, hyphens only)
      if (!/^[a-z0-9-]+$/.test(dto.subdomain)) {
        throw new BadRequestException('Invalid subdomain format');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // Create user and tenant in transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            phone: dto.phone,
            role: UserRole.MERCHANT,
          },
        });

        // Create tenant with 7-day trial
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);

        const tenant = await tx.tenant.create({
          data: {
            subdomain: dto.subdomain,
            name: dto.storeName,
            nameAr: dto.storeNameAr,
            ownerId: user.id,
            status: 'TRIAL',
            trialEndsAt,
          },
        });

        // Create trial subscription
        await tx.subscription.create({
          data: {
            tenantId: tenant.id,
            status: 'TRIAL',
            plan: 'STANDARD',
          },
        });

        return { user, tenant };
      });

      // Generate tokens
      const tokens = await this.generateTokens(result.user.id, result.user.role);

      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        tenant: {
          id: result.tenant.id,
          subdomain: result.tenant.subdomain,
          name: result.tenant.name,
        },
        ...tokens,
      };
    } catch (err: any) {
      // Add strong logging to pinpoint root cause on Render
      // eslint-disable-next-line no-console
        message: err?.message,
        code: err?.code,
        meta: err?.meta,
      });

      // Map common DB errors (Prisma codes if present) to user-friendly HTTP errors
      const code = (err && (err.code as string)) || '';
      if (code === 'P2002') {
        // Unique constraint failed
        const target = (err.meta && (err.meta as any).target) || [];
        if (Array.isArray(target) && target.includes('email')) {
          throw new ConflictException('Email already exists');
        }
        if (Array.isArray(target) && target.includes('subdomain')) {
          throw new ConflictException('Subdomain already taken');
        }
        throw new ConflictException('Duplicate value');
      }
      if (code === 'P2003') {
        // Foreign key constraint failed
        throw new BadRequestException('Invalid reference data');
      }

      // Fallback
      throw new InternalServerErrorException('Registration failed');
    }
{{ ... }}

  // Login
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: {
          select: {
            id: true,
            subdomain: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant: user.tenant,
      },
      ...tokens,
    };
  }

  // Refresh token
  async refreshToken(refreshToken: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    const tokens = await this.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.role,
    );

    // Delete old refresh token
    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    return tokens;
  }

  // Logout
  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  // Generate JWT tokens
  private async generateTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.config.get('JWT_REFRESH_SECRET') ||
        'Ra7ba_R3fr3sh_S3cr3t_2024_Change_This_Now!',
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // Validate user (for strategies)
  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        tenant: {
          select: {
            id: true,
            subdomain: true,
            status: true,
          },
        },
      },
    });
  }
}
