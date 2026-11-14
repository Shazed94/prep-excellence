# PrepExcellence Monorepo

> Complete Learning Management Platform - A production-ready NX monorepo for web and API applications.

## 🎨 Design Resources

**Figma Design**: [PrepExcellence UI/UX Design](https://www.figma.com/design/OcMrEdOdylkjgk7bXv9lyb/PrepExcellence?node-id=820-2230&p=f)

The Figma file contains all UI/UX designs, component specifications, and design system guidelines for the platform.

**Project Proposal**: See [PROPOSAL.md](./PROPOSAL.md) for the complete project scope, phase-wise breakdown, and feature deliverables.

## 🏗️ Project Structure

```
prepexcellence/
├── apps/
│   ├── web/              # Frontend React application (Vite + TanStack)
│   ├── api/              # Backend Express.js API (Node.js + Prisma)
│   └── video-processor/  # Video processing microservice (Go + FFmpeg)
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   └── shared-validators # Shared Zod validation schemas
├── .github/
│   └── workflows/        # CI/CD pipelines
├── nx.json               # NX workspace configuration
├── package.json          # Root package.json
└── pnpm-workspace.yaml   # PNPM workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- pnpm 10.11.0+
- PostgreSQL (for API)
- Redis (for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/trodad-intl/prepexcellence.git
cd prepexcellence

# Install dependencies
pnpm install
```

### Development

```bash
# Run both web and API in development mode
pnpm dev

# Run specific app
nx serve web       # Frontend only
nx serve api       # Backend only (needs DB setup first)

# Run multiple apps
nx run-many --target=dev --projects=web,api
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
nx build web
nx build api

# Build only affected apps (smart builds)
nx affected:build --base=main
```

### Testing

```bash
# Test all apps
pnpm test

# Test specific app
nx test web
nx test api

# Test only affected apps
nx affected:test --base=main
```

### Linting & Formatting

```bash
# Lint all apps
pnpm lint

# Format frontend (Biome)
nx format web

# Format backend (Prettier)
nx format api
```

## 📦 Apps

### Web (`apps/web`)

Frontend application built with:
- **Framework**: Vite + React 19
- **Routing**: TanStack Router
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **UI**: Radix UI + Tailwind CSS
- **Testing**: Vitest

**Scripts:**
```bash
nx dev web           # Start dev server on port 3000
nx build web         # Build for production
nx test web          # Run tests
nx lint web          # Lint code
```

### API (`apps/api`)

Backend application built with:
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **Caching**: Redis
- **Queue**: RabbitMQ
- **Storage**: MinIO/S3
- **Testing**: Vitest

**Scripts:**
```bash
nx dev api           # Start dev server with nodemon
nx build api         # Build TypeScript
nx test api          # Run tests
nx migrate api       # Run Prisma migrations
```

### Video Processor (`apps/video-processor`)

Video processing microservice built with:
- **Language**: Go 1.25
- **Processing**: FFmpeg (HLS/m3u8 generation)
- **Queue**: RabbitMQ consumer + producer (callbacks)
- **Storage**: MinIO/S3
- **Features**: 
  - HLS adaptive bitrate streaming (like YouTube)
  - Multiple resolutions (1080p, 720p, 480p, 360p)
  - Chunked segments for smooth playback
  - Automatic raw video cleanup
  - Callback notifications to API

**Documentation**:
- Full flow: `apps/video-processor/VIDEO_PROCESSING_FLOW.md`
- Architecture summary: `VIDEO_ARCHITECTURE_SUMMARY.md`

**Scripts:**
```bash
cd apps/video-processor
go run main.go       # Run locally
docker-compose up video-processor  # Run with Docker
```

## 📚 Shared Packages

### `@prepexcellence/shared-types`

Shared TypeScript types used across web and API:
- User types
- API response types
- Course types (for future phases)
- Pagination types

**Usage:**
```typescript
import { User, ApiResponse } from '@prepexcellence/shared-types';
```

### `@prepexcellence/shared-validators`

Shared Zod validation schemas:
- Authentication (login, register)
- User updates
- Pagination
- CUID validation

**Usage:**
```typescript
import { ZLogin, ZRegister } from '@prepexcellence/shared-validators';
```

## 🔧 NX Commands

### Affected Commands (Smart CI/CD)

NX only runs tasks on projects affected by your changes:

```bash
# Build only affected projects
nx affected:build --base=main

# Test only affected projects
nx affected:test --base=main

# Lint only affected projects
nx affected:lint --base=main

# See what's affected
nx affected:graph --base=main
```

### Dependency Graph

```bash
# Visualize project dependencies
nx graph

# Show affected projects
nx affected:graph --base=main
```

### Caching

NX caches task results for faster builds:

```bash
# Clear NX cache
nx reset

# See cache statistics
nx view-logs
```

## 🐳 Docker

### Build Docker Images

```bash
# Build web image
docker build -t prepexcellence-web -f apps/web/Dockerfile apps/web

# Build API image
docker build -t prepexcellence-api -f apps/api/Dockerfile apps/api

# Build video processor image
docker build -t prepexcellence-video-processor -f apps/video-processor/Dockerfile apps/video-processor
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d web api video-processor

# View logs
docker-compose logs -f video-processor
```

## 🚢 Deployment

### Phase 1-4: Manual Deployment

1. **Build applications:**
   ```bash
   nx build web
   nx build api
   ```

2. **Deploy to VPS:**
   ```bash
   # Web (static files)
   rsync -avz apps/web/dist/ user@server:/var/www/prepexcellence

   # API (Node.js app)
   rsync -avz apps/api/dist/ user@server:/opt/prepexcellence-api
   ```

### Phase 5: Kubernetes Deployment

CI/CD pipeline automatically:
1. Runs tests on affected projects
2. Builds affected projects
3. Creates Docker images
4. Pushes to GitHub Container Registry
5. Deploys to Kubernetes cluster

## 📋 Project Phases

This monorepo supports the 5-phase development plan:

- ✅ **Phase 1**: Marketing Website (Current)
- 🔄 **Phase 2**: LMS Platform (Next)
- 📅 **Phase 3**: Coaching Management System
- 📅 **Phase 4**: One-to-One Coaching Platform
- 📅 **Phase 5**: Kubernetes Deployment & Monitoring

### Adding New Apps

```bash
# Generate new React app
nx generate @nx/react:app lms-web

# Generate new Node.js app
nx generate @nx/node:app video-processor

# Generate new library
nx generate @nx/js:library ui-components
```

## 🔍 VS Code Extensions

Recommended extensions for this monorepo:

- **Nx Console**: Visual UI for NX commands
- **Prisma**: Prisma ORM support
- **Biome**: Linting & formatting for web
- **Prettier**: Formatting for API

## 📈 Performance

### Build Optimization

- **Local Cache**: NX caches task results locally
- **Distributed Cache**: Optional NX Cloud for team caching
- **Affected Commands**: Only build/test changed code
- **Parallel Execution**: Run tasks across projects in parallel

### Example Metrics

Without NX:
- Full build: ~3-5 minutes
- Full test: ~2-3 minutes

With NX (affected only):
- Affected build: ~30-60 seconds
- Affected test: ~15-30 seconds

## 🤝 Contributing

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches

### Commit Convention

```bash
feat(web): add user authentication
fix(api): resolve database connection issue
chore(deps): update dependencies
docs: update README
```

## 📝 Environment Variables

### Web App (`apps/web/.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### API App (`apps/api/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/prepexcellence
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 🆘 Troubleshooting

### Common Issues

**1. Prisma generation fails:**
```bash
cd apps/api
pnpm prisma generate
```

**2. Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**3. Clear all caches:**
```bash
nx reset
rm -rf node_modules
pnpm install
```

**4. TypeScript path errors:**
```bash
# Rebuild all
pnpm build
```

## 📞 Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Built with ❤️ using NX Monorepo**
