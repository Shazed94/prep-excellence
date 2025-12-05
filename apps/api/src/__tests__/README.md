# Test Organization

This directory contains all tests organized in a dependency hierarchy to ensure reliable execution order.

## Test Structure

```
__tests__/
├── setup/                 # Global setup and teardown
│   ├── globalSetup.ts         # Creates and seeds test DB before all tests
│   └── globalTeardown.ts      # Drops test DB after all tests
├── 01-infrastructure/     # Test foundational services first
│   ├── 01-database.spec.ts    # PostgreSQL connection tests
│   └── 02-redis.spec.ts       # Redis cache tests
├── 02-utils/              # Test utility functions
│   └── 01-permission.spec.ts  # Permission checker utilities
├── 03-middleware/         # Test middleware components
│   └── 01-authorize.spec.ts   # Authorization middleware
└── 04-apps/              # Test application features
    ├── 01-user.spec.ts        # User & Auth API tests
    └── 02-role.spec.ts        # Role & Permission API tests
```

## Execution Order

Tests are executed sequentially in numerical order:
1. **Global Setup**: Drops/recreates test DB → Runs migrations → Seeds data
2. **Infrastructure** (01-*): Database → Redis → Other services
3. **Utils** (02-*): Utility functions and helpers
4. **Middleware** (03-*): Request processing middleware
5. **Apps** (04-*): API endpoints and business logic
6. **Global Teardown**: Drops test DB and cleans up

## Why This Order?

1. **Database first**: Ensures the database connection works before any test tries to use it
2. **Redis second**: Validates cache layer before utilities that depend on it
3. **Utils third**: Permission checks and helpers are tested before middleware uses them
4. **Middleware fourth**: Authorization is tested before API endpoints that require it
5. **Apps last**: API endpoints are integration tests that depend on all of the above

## Global Setup & Cleanup

The test suite uses Vitest's `globalSetup` and `globalTeardown` hooks to manage the test database lifecycle:

### Global Setup (`setup/globalSetup.ts`)
Runs **once before all tests**:
1. Drops and recreates the test database
2. Runs all Prisma migrations
3. Seeds the database with initial data using `src/utils/seed.ts`

### Global Teardown (`setup/globalTeardown.ts`)
Runs **once after all tests**:
1. Drops the test database to ensure a clean state for next test run

### Per-Test Setup (`vitest.setup.ts`)
Runs **before each test file**:
- Sets `NODE_ENV=test` to ensure test database is used
- Loads environment variables

## Running Tests

```bash
# Run all tests in order
pnpm test

# Run specific layer
pnpm test src/__tests__/01-infrastructure
pnpm test src/__tests__/02-utils
pnpm test src/__tests__/03-middleware
pnpm test src/__tests__/04-apps

# Run with coverage
pnpm test:coverage
```

## Adding New Tests

When adding new tests, follow the naming convention:
1. Choose the appropriate directory (01-infrastructure, 02-utils, 03-middleware, 04-apps)
2. Use a numbered prefix to control execution order within that directory
3. Use `.spec.ts` extension
4. Use `describe.sequential()` for tests that modify database state

Example:
```typescript
// src/__tests__/02-utils/02-logger.spec.ts
import { describe, it, expect } from "vitest";

describe.sequential("Logger Utility", () => {
    it("should log messages", () => {
        // test code
    });
});
```
