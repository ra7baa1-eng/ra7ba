const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const schemaPath = path.resolve(__dirname, '..', 'prisma', 'schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.warn('[postinstall] prisma/schema.prisma not found. Skipping migrate deploy.');
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.log('[postinstall] DATABASE_URL not set. Skipping Prisma steps.');
  process.exit(0);
}

try {
  // Ensure client is generated
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Apply migrations
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // Optionally run seed (idempotent) when explicitly enabled
  if (String(process.env.RUN_SEED_ON_DEPLOY).toLowerCase() === 'true') {
    execSync('npx prisma db seed', { stdio: 'inherit' });
  }
} catch (error) {
  process.exit(error.status ?? 1);
}
