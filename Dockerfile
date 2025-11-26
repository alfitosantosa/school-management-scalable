# FROM node:18-bullseye AS base

# WORKDIR /src

# COPY package.json .

# RUN npm install

# COPY . .

# RUN npx prisma migrate deploy 
# RUN npx prisma generate

# CMD npm run dev



# ============================
# BASE
# ============================
FROM node:20-bullseye AS base
WORKDIR /app

# ============================
# INSTALL DEPENDENCIES
# ============================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install

# ============================
# BUILD NEXT.JS + PRISMA
# ============================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ============================
# RUNTIME
# ============================
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Jalankan migrate saat container start
RUN npx prisma migrate deploy

EXPOSE 3000
CMD ["npm", "start"]
