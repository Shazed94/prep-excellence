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
RUN npm install -g @tanstack/cli

# Build web app (NX will automatically build dependencies first)
RUN pnpm nx build @prepexcellence/web

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000


EXPOSE 3000

CMD ["pnpm", "start"]