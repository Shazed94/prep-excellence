# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Copy monorepo root files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.json ./

# Copy shared packages
COPY packages ./packages

# Copy API app
COPY apps/api ./apps/api

# Install all dependencies for build
ARG DATABASE_URL="postgresql://postgresql:password@localhost/db?schema=public"
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm install --frozen-lockfile

# Build API (NX will automatically build dependencies first)
RUN pnpm nx build @prepexcellence/api

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy workspace structure for proper module resolution
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

# Set working directory to API app
WORKDIR /app/apps/api

EXPOSE 8000

CMD ["node", "dist/server.js"]
