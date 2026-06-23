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

# Build web app (NX will automatically build dependencies first)
RUN pnpm nx build @prepexcellence/web

# Production stage — serve static files with nginx
FROM nginx:alpine AS runner

# Copy built static files
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Nginx default port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]