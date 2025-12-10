# ==========================================
# PRODUCTION-READY DOCKERFILE FOR NEXT.JS + BUN
# Optimized for: Fast reload, Caching, Lightweight
# ==========================================

# Stage 1: Dependencies (Cached layer)
FROM oven/bun:1.1-alpine AS deps
WORKDIR /app

# Copy only package files for optimal caching
COPY package.json bun.lock* ./

# Install all dependencies with frozen lockfile
RUN bun install 

# ==========================================
# Stage 2: Build
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage (cached)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build the application WITHOUT turbopack (Turbopack has issues with Bun in Docker)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN bunx next build

# ==========================================
# Stage 3: Production runner (Lightweight)
FROM oven/bun:1.1-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only required production files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy standalone build (if output: 'standalone' in next.config)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the server with Bun
CMD ["bun", "server.js"]