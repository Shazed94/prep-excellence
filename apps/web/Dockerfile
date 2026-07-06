# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Copy monorepo root files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.json ./

# Copy shared packages
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

# Install all dependencies for build
RUN pnpm install --frozen-lockfile

# Build web app using vite directly (Nitro/TanStack Start outputs to .output/)
# Larger heap: the vite/nitro SSR build exceeds Node's default on CI runners
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN cd apps/web && pnpm build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Create user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nitrojs

# Copy built application
COPY --from=builder --chown=nitrojs:nodejs /app/apps/web/.output ./

USER nitrojs

EXPOSE 3000

CMD ["node", "server/index.mjs"]