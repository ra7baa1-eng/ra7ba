# Builder stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Increase Node memory limit during build on low-RAM instances
ENV NODE_OPTIONS=--max-old-space-size=512

# Copy package files and install deps
COPY backend/package*.json ./
RUN npm ci

# Copy source and build
COPY backend/ ./
# Skip Prisma generation (no schema; using Supabase + Prisma stubs)
RUN npm run build
# Prune dev dependencies to keep only production deps in node_modules
RUN npm prune --production

# Runtime stage
FROM node:18-alpine

# Install runtime tools (curl for healthcheck)
RUN apk add --no-cache curl

# Environment
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=512

WORKDIR /app

# Copy production artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001 \
  && chown -R nestjs:nodejs /app
USER nestjs

# Expose port (Render/Koyeb uses PORT env variable)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/api || exit 1

# Start application
CMD ["npm", "run", "start:prod"]
