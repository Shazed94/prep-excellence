<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

# Development Patterns

## Full-Stack Feature Implementation Pattern

When implementing new features (e.g., API endpoints, forms, etc.), follow this structured workflow to ensure type safety and consistency across the monorepo:

### 1. Schema Definition (shared-validators)
**Location**: `packages/shared-validators/src/`

Start by defining validation schemas using a validation library (e.g., Zod):

```typescript
// packages/shared-validators/src/user.schema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  // ... other fields
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

**Export from index**: Ensure the schema is exported from `packages/shared-validators/src/index.ts`

---

### 2. Backend Implementation (api)

#### 2.1 Controller
**Location**: `apps/api/src/apps/{domain}/controller.ts`

Create the controller that uses the shared validator:

```typescript
// apps/api/src/apps/user/controller.ts
import { createUserSchema } from '@prepexcellence/shared-validators';

export async function createUser(req: Request, res: Response) {
  const validated = createUserSchema.parse(req.body);
  // ... business logic
  return res.json(result);
}
```

#### 2.2 Route
**Location**: `apps/api/src/apps/{domain}/routes.ts`

Register the route with proper HTTP method:

```typescript
// apps/api/src/apps/user/routes.ts
import { Router } from 'express';
import { createUser } from './controller';

const router = Router();
router.post('/users', createUser);

export default router;
```

#### 2.3 Mount Route
**Location**: `apps/api/src/app.ts`

Mount the domain routes in the main app:

```typescript
import userRoutes from './apps/user/routes';

app.use('/api', userRoutes);
```

---

### 3. Frontend Implementation (web)

#### 3.1 API Hook (TanStack Query)
**Location**: `apps/web/src/integrations/{domain}/hooks.ts`

Create type-safe hooks using TanStack React Query:

```typescript
// apps/web/src/integrations/user/hooks.ts
import { useMutation } from '@tanstack/react-query';
import { createUserSchema, type CreateUserInput } from '@prepexcellence/shared-validators';
import { apiClient } from '@/lib/api-client';

export function useCreateUser() {
  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const validated = createUserSchema.parse(data);
      const response = await apiClient.post('/api/users', validated);
      return response.data;
    },
    onSuccess: () => {
      // invalidate queries, show toast, etc.
    },
  });
}
```

#### 3.2 Form Component (shadcn + react-hook-form)
**Location**: `apps/web/src/components/{domain}/`

Create the form using shadcn components and react-hook-form with Zod resolver:

```typescript
// apps/web/src/components/user/create-user-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserInput } from '@prepexcellence/shared-validators';
import { useCreateUser } from '@/integrations/user/hooks';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function CreateUserForm() {
  const createUser = useCreateUser();
  
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    createUser.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* ... other fields */}
        <Button type="submit" disabled={createUser.isPending}>
          Create User
        </Button>
      </form>
    </Form>
  );
}
```

---

### 4. Type Safety Flow

```
shared-validators (source of truth)
    ↓
    ├─→ Backend (api)
    │   ├─→ Controller validates input
    │   ├─→ Route defines endpoint
    │   └─→ Returns typed response
    │
    └─→ Frontend (web)
        ├─→ Hook uses schema for validation
        ├─→ Form uses schema with react-hook-form
        └─→ Full type safety from input to API call
```

---

## Key Principles

1. **Single Source of Truth**: All validation schemas live in `shared-validators`
2. **Type Safety**: Use TypeScript throughout, leveraging `z.infer<>` for types
3. **Validation at Boundaries**: Validate at API entry (backend) and form submission (frontend)
4. **Separation of Concerns**: 
   - Validators = data structure
   - Controllers = business logic
   - Routes = HTTP routing
   - Hooks = data fetching/mutations
   - Components = UI and user interaction
5. **Reusability**: Shared validators ensure backend and frontend validate the same way

---

## Example: Complete POST Endpoint Flow

```
User fills form → 
  react-hook-form validates with Zod schema → 
    TanStack Query hook sends request → 
      API route receives request → 
        Controller validates again with same schema → 
          Business logic executes → 
            Response sent back → 
              Hook receives response → 
                UI updates
```

This pattern ensures consistency, type safety, and maintainability across the entire stack.