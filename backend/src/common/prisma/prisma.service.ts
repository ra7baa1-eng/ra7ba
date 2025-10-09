import { Injectable } from '@nestjs/common';

// Lightweight stub to satisfy legacy Prisma imports at compile-time.
// All properties are "any"; do not use in runtime. Migrate code to Supabase progressively.
@Injectable()
export class PrismaService {
  // Allow arbitrary property access like prisma.tenant.findMany(...)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
