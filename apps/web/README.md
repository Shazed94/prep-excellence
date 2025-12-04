# PrepExcellence Web Application

> Modern, type-safe frontend for the PrepExcellence learning management platform.

## 🎨 Design

**Figma**: [PrepExcellence UI/UX Design](https://www.figma.com/design/OcMrEdOdylkjgk7bXv9lyb/PrepExcellence?node-id=820-2230&p=f)

## 🚀 Quick Start

```bash
# From monorepo root
nx serve web

# Or from this directory
pnpm dev
```

The application will be available at `http://localhost:5173`

## 📦 Tech Stack

- **Framework**: Vite + React 18
- **Routing**: TanStack Router (File-based)
- **State Management**: TanStack Store + Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui + Tailwind CSS
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Testing Library
- **Linting/Formatting**: Biome
- **Type Safety**: TypeScript + T3 Env

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── {domain}/       # Domain-specific components
├── integrations/        # API integration hooks
│   └── {domain}/       # Domain-specific hooks (TanStack Query)
├── routes/             # File-based routes (TanStack Router)
├── store/              # Global state (Zustand stores)
├── lib/                # Utilities and helpers
├── validations/        # Client-side validation schemas
├── types/              # TypeScript type definitions
└── env.ts              # Environment variables (T3 Env)
```

## 🔧 Development

### Running Tests

```bash
nx test web           # Run tests
nx test web --watch   # Watch mode
nx test web --coverage # With coverage
```

### Linting & Formatting

```bash
nx lint web           # Lint code
nx format web         # Format code
```

### Building

```bash
nx build web          # Production build
```

## 📝 Environment Variables

Environment variables are type-safe using T3 Env. Add variables to `src/env.ts`:

```typescript
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url(),
  },
  runtimeEnv: import.meta.env,
});
```

**Usage**:
```typescript
import { env } from "@/env";
console.log(env.VITE_API_URL);
```


## 🎯 Key Features

### Routing (TanStack Router)
File-based routing with type-safe navigation and automatic route generation.

**Adding a new route**:
```bash
# Create a new file in src/routes/
src/routes/courses.tsx  # Creates /courses route
src/routes/courses/$id.tsx  # Creates /courses/:id route
```

**Navigation**:
```tsx
import { Link } from "@tanstack/react-router";

<Link to="/courses" search={{ filter: 'active' }}>Courses</Link>
```

### Data Fetching (TanStack Query)
All API calls use TanStack Query hooks located in `src/integrations/{domain}/hooks.ts`.

**Example**:
```tsx
// src/integrations/user/hooks.ts
export function useGetUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/users/${id}`);
      return response.data;
    },
  });
}

// Usage in component
const { data, isLoading } = useGetUser(userId);
```

### Forms (React Hook Form + Zod)
Forms use shared validators from `@prepexcellence/shared-validators` for type safety.

**Example**:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@prepexcellence/shared-validators';

const form = useForm({
  resolver: zodResolver(createUserSchema),
});
```

### UI Components (shadcn/ui)
Add new components using:

```bash
pnpx shadcn@latest add button
pnpx shadcn@latest add form
pnpx shadcn@latest add dialog
```

Components are installed to `src/components/ui/` and can be customized.

## 🔗 API Integration

The app connects to the backend API (`apps/api`) running at `http://localhost:3000` (configurable via `VITE_API_URL`).

API client is configured in `src/lib/api-client.ts` with automatic authentication header injection.

## 📚 Development Guidelines

See [AGENTS.md](../../AGENTS.md) in the monorepo root for:
- Full-stack feature implementation patterns
- API endpoint creation workflow
- Type-safe development practices
- Best practices and conventions

## 🔐 Authentication

Authentication state is managed in `src/store/useAuth.ts` using Zustand. The auth token is stored in localStorage and automatically attached to API requests.

## 📖 Further Reading

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [React Hook Form Docs](https://react-hook-form.com)
