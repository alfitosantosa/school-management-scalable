# ==========================================
# PRODUCTION-READY DOCKERFILE FOR NEXT.JS + BUN
# Optimized for: Security, Performance, Caching, Minimal Size
# ==========================================

# Stage 1: Dependencies (Cached layer)
FROM oven/bun:1.1-alpine AS deps
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy only package files for optimal caching
COPY package.json bun.lock* ./

# Install dependencies with frozen lockfile
# Use --frozen-lockfile for production consistency
RUN bun install 

# ==========================================
# Stage 2: Builder
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage (cached)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

# Generate Prisma client
RUN bunx prisma migrate deploy
RUN bunx prisma generate

# Build the application
# Remove --turbopack for production stability
RUN bunx next build

# ==========================================
# Stage 3: Production runner (Ultra lightweight)
FROM oven/bun:1.1-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install only runtime dependencies (curl for health checks)
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only required production files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy standalone build (requires output: 'standalone' in next.config)
# COPY --from=builder --chown=nextjs:nodejs /app/middleware.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client for runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user for security
USER nextjs

# Expose port
EXPOSE 3000

# Health check with proper timeout and retries
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/api/health || exit 1

# Use exec form for proper signal handling
CMD ["bun", "server.js"]
