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
    const maxRetries = parseInt(process.env.DB_CONNECT_RETRIES || '10', 10);
    const delayMs = parseInt(process.env.DB_CONNECT_RETRY_DELAY_MS || '3000', 10);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        console.log('✅ Database connected successfully');
        return;
      } catch (err: any) {
        const message = err?.message || String(err);
        console.error(`❌ Database connect attempt ${attempt}/${maxRetries} failed: ${message}`);
        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, delayMs));
        } else {
          console.error('❌ Could not connect to the database after retries. Continuing to boot.');
          return;
        }
      }
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
