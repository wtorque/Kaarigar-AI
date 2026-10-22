# Multi-stage Dockerfile for Kaarigar AI Backend
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

# Install package dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# -------------------------------------------------------------
# Production Runner Stage
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup -S kaarigar && adduser -S kaarigar -G kaarigar

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

# Create uploads directory with non-root ownership
RUN mkdir -p /app/uploads && chown -R kaarigar:kaarigar /app

USER kaarigar

EXPOSE 4000

CMD ["node", "dist/server.js"]
