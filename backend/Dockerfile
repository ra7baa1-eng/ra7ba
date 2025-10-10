# Use Node.js 18 Alpine
FROM node:18-alpine

# Install necessary dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Skip Prisma generation (no schema; using Supabase + Prisma stubs)

# Build application
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port (Render uses PORT env variable)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/api || exit 1

# Start application
CMD ["npm", "run", "start:prod"]
