import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const raw = process.env.DB_URL_OVERRIDE || process.env.DATABASE_URL || '';
    let finalUrl = raw;
    try {
      const u = new URL(raw);
      const forceDirect = String(process.env.DB_FORCE_DIRECT ?? 'true').toLowerCase() === 'true';
      if (forceDirect) {
        u.port = '5432';
        u.searchParams.delete('pgbouncer');
        u.searchParams.delete('connection_limit');
        u.searchParams.set('sslmode', 'require');
        finalUrl = u.toString();
      }
    } catch (_) {}

    try {
      const u = new URL(finalUrl);
      console.log(`🗄️ Prisma datasource -> host: ${u.hostname}, port: ${u.port || '(default)'}`);
    } catch {}

    super({
      log: ['error', 'warn'],
      datasources: { db: { url: finalUrl } },
    });

    const maxQueryRetries = parseInt(process.env.DB_QUERY_RETRIES || '10', 10);
    const queryRetryDelayMs = parseInt(process.env.DB_QUERY_RETRY_DELAY_MS || '2000', 10);
    this.$use(async (params, next) => {
      let lastErr: any;
      for (let attempt = 1; attempt <= maxQueryRetries; attempt++) {
        try {
          return await next(params);
        } catch (err: any) {
          lastErr = err;
          const msg = err?.message || String(err);
          const code = err?.code || err?.errorCode || err?.name;
          const isTransient =
            code === 'P1001' ||
            code === 'PrismaClientInitializationError' ||
            msg.includes("Can't reach database server") ||
            msg.includes('ECONN') ||
            msg.includes('ENETUNREACH') ||
            msg.includes('ETIMEDOUT');
          if (isTransient && attempt < maxQueryRetries) {
            await new Promise((res) => setTimeout(res, queryRetryDelayMs));
            continue;
          }
          throw err;
        }
      }
      throw lastErr;
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
