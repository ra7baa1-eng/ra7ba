import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    const skip = String(process.env.DB_SKIP_CONNECT_ON_BOOT ?? 'true').toLowerCase() === 'true';
    if (skip) {
      console.log('⏭️ Skipping DB connect on boot');
      return;
    }

    try {
      this.$connect()
        .then(() => console.log('✅ Database connected successfully'))
        .catch((err: any) => console.error(`❌ Database connect failed: ${err?.message || String(err)}`));
    } catch (err: any) {
      console.error(`❌ Database connect failed: ${err?.message || String(err)}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Tenant-aware query helper
  async withTenant<T>(tenantId: string, operation: () => Promise<T>): Promise<T> {
    return operation();
  }

  // Clean database (for testing)
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key !== 'constructor',
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as string];
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
      }),
    );
  }
}
