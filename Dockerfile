# ==========================================
# PRODUCTION-READY DOCKERFILE - OPTIMIZED & LIGHTWEIGHT
# ==========================================

# Stage 1: Dependencies
FROM oven/bun:canary AS deps
WORKDIR /app

# Install only essential system dependencies
RUN apk add --no-cache \
    curl \
    openssl \
    && rm -rf /var/cache/apk/* /tmp/*

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies with production optimizations
RUN bun install --frozen-lockfile \
    && rm -rf /tmp/* \
    && rm -rf ~/.bun/install/cache \
    && rm -rf ~/.cache

# ==========================================
# Stage 2: Builder
FROM oven/bun:latest-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    openssl \
    && rm -rf /var/cache/apk/* /tmp/*

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    SKIP_ENV_VALIDATION=1 \
    NODE_OPTIONS="--no-warnings=ExperimentalWarning"

# Generate Prisma client and build Next.js
RUN bunx prisma generate \
    && bun run build \
    && rm -rf /tmp/* \
    && rm -rf .next/cache \
    && rm -rf node_modules/.cache \
    && rm -rf ~/.bun \
    && find . -name "*.map" -type f -delete \
    && find . -name "*.test.*" -type f -delete \
    && find . -name "*.spec.*" -type f -delete

# ==========================================
# Stage 3: Production Runner (Minimal)
FROM oven/bun:latest-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Install runtime dependencies only
RUN apk add --no-cache \
    curl \
    openssl \
    && rm -rf /var/cache/apk/* /tmp/*

# Create non-root user
RUN addgroup --system --gid 1001 bun \
    && adduser --system --uid 1001 appuser

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock* ./

# Copy standalone build
COPY --from=builder --chown=appuser:bun /app/.next/standalone ./
COPY --from=builder --chown=appuser:bun /app/.next/static ./.next/static

# Copy Prisma for runtime migrations
COPY --from=builder --chown=appuser:bun /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/pg ./node_modules/pg

# Clean up unnecessary files and caches
RUN rm -rf /tmp/* \
    && rm -rf ~/.cache \
    && rm -rf ~/.bun \
    && apk del apk-tools

# Switch to non-root user
USER appuser

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start with migration then server
CMD ["sh", "-c", "bunx prisma migrate deploy && bun server.js"]