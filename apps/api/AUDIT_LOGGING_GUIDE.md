# Audit Logging System - Quick Reference Guide

## Overview

The audit logging system tracks all important actions in your application for security, compliance, and debugging purposes.

## Setup

### 1. Prisma Schema (Already Done ✓)

The `AuditLog` model in your Prisma schema tracks:
- **action**: What was done (CREATE, UPDATE, DELETE, etc.)
- **module**: Which part of the system (USER, BLOG, LMS, etc.)
- **entityId**: The ID of the affected record
- **description**: Human-readable details
- **ipAddress**: Where the action came from
- **userAgent**: Browser/client information
- **performedById**: Who did it

### 2. Add Audit Middleware to App

In `apps/api/src/app.ts`, add the audit middleware after authentication:

```typescript
import { auditMiddleware } from "./middleware/audit";

// ... other middleware

// Add audit middleware (should be after authentication middleware)
app.use(auditMiddleware);

// Routes
app.use("/api/users", userRouter);
// ... other routes
```

### 3. Integration in Controllers

Import the audit utilities:

```typescript
import { createAuditLogFromRequest } from "@/utils/auditLog";
import type { AuditRequest } from "@/middleware/audit";
```

## Common Patterns

### CREATE Operations

```typescript
const user = await prisma.user.create({ data: userData });

await createAuditLogFromRequest(req, {
  action: "CREATE",
  module: "USER",
  entityId: user.id,
  description: `User created: ${user.name}`,
  performedById: req.user?.id,
});
```

### UPDATE Operations

```typescript
const updated = await prisma.user.update({ where: { id }, data });

await createAuditLogFromRequest(req, {
  action: "UPDATE",
  module: "USER",
  entityId: id,
  description: `User updated: ${updated.name}`,
  performedById: req.user?.id,
});
```

### DELETE Operations

```typescript
const user = await prisma.user.findUnique({ where: { id } });
await prisma.user.delete({ where: { id } });

await createAuditLogFromRequest(req, {
  action: "DELETE",
  module: "USER",
  entityId: id,
  description: `User deleted: ${user?.name}`,
  performedById: req.user?.id,
});
```

### STATUS CHANGES

```typescript
await prisma.user.update({ where: { id }, data: { isActive } });

await createAuditLogFromRequest(req, {
  action: "CHANGE_STATUS",
  module: "USER",
  entityId: id,
  description: `User ${isActive ? "activated" : "deactivated"}`,
  performedById: req.user?.id,
});
```

### PUBLISH/UNPUBLISH

```typescript
const blog = await prisma.blog.update({ where: { id }, data: { isPublished } });

await createAuditLogFromRequest(req, {
  action: isPublished ? "PUBLISH" : "UNPUBLISH",
  module: "BLOG",
  entityId: id,
  description: `Blog ${isPublished ? "published" : "unpublished"}: ${blog.title}`,
  performedById: req.user?.id,
});
```

## Module Names Convention

Use uppercase module names that match your domain:

- `USER` - User management
- `STUDENT` - Student operations
- `TEACHER` - Teacher operations
- `BLOG` - Blog/CMS
- `LMS_COURSE` - LMS courses
- `LMS_ENROLLMENT` - LMS enrollments
- `COACHING_COURSE` - Coaching courses
- `ONETOONE_SESSION` - 1-on-1 sessions
- `PAYMENT` - Payment operations
- `AUTH` - Authentication (login/logout)

## Available Actions

From the `AuditAction` enum:
- `CREATE` - Creating new records
- `UPDATE` - Updating existing records
- `DELETE` - Deleting records
- `LOGIN` - User login
- `LOGOUT` - User logout
- `APPROVE` - Approving content/requests
- `REJECT` - Rejecting content/requests
- `PUBLISH` - Publishing content
- `UNPUBLISH` - Unpublishing content
- `ENROLL` - Student enrollments
- `CHANGE_STATUS` - Status changes (active/inactive)

## Best Practices

### ✅ DO:
- Log all data modifications (CREATE, UPDATE, DELETE)
- Include meaningful descriptions
- Log authentication events (LOGIN, LOGOUT)
- Log status changes and approvals
- Use consistent module naming
- Capture user information when available
- Log before returning response

### ❌ DON'T:
- Log sensitive data (passwords, tokens, credit cards)
- Log every GET request (too noisy)
- Block the main flow if audit logging fails
- Include unnecessary details in descriptions
- Use inconsistent module names

## Querying Audit Logs

### Get logs with filters

```typescript
import { getAuditLogs } from "@/utils/auditLog";

const result = await getAuditLogs({
  module: "USER",
  action: "DELETE",
  performedById: userId,
  startDate: new Date("2025-01-01"),
  page: 1,
  limit: 50,
});
```

### Get entity history

```typescript
import { getEntityAuditHistory } from "@/utils/auditLog";

const history = await getEntityAuditHistory("USER", userId);
// Returns all actions performed on this user
```

### Get user activity

```typescript
import { getUserActivity } from "@/utils/auditLog";

const activity = await getUserActivity(userId, 100);
// Returns last 100 actions performed by this user
```

## Error Handling

The audit logging system is designed to **never break your main flow**. If audit logging fails, it logs the error but doesn't throw an exception.

```typescript
// This will catch and log errors without affecting your response
await createAuditLogFromRequest(req, {
  action: "CREATE",
  module: "USER",
  entityId: user.id,
  description: "User created",
  performedById: req.user?.id,
});
```

## Testing

When writing tests, you can verify audit logs were created:

```typescript
const auditLog = await prisma.auditLog.findFirst({
  where: {
    action: "CREATE",
    module: "USER",
    entityId: createdUser.id,
  },
});

expect(auditLog).toBeDefined();
expect(auditLog?.description).toContain("User created");
```

## Performance Considerations

- Audit logs are created asynchronously (use `await` but don't block)
- Use batch operations for bulk actions
- Index fields (module, entityId, performedById) are already indexed
- Consider archiving old logs periodically

## Migration

To add audit logging to existing endpoints:

1. Import audit utilities
2. Add audit log call after successful operation
3. Choose appropriate action and module
4. Add meaningful description
5. Test the endpoint

Example:

```typescript
// Before
export const createUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  return res.json({ data: user });
});

// After
import { createAuditLogFromRequest } from "@/utils/auditLog";

export const createUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  
  await createAuditLogFromRequest(req, {
    action: "CREATE",
    module: "USER",
    entityId: user.id,
    description: `User created: ${user.name}`,
    performedById: req.user?.id,
  });
  
  return res.json({ data: user });
});
```

## Compliance & Security

This audit logging system helps with:
- **GDPR Compliance**: Track data access and modifications
- **Security Audits**: Investigate suspicious activities
- **Debugging**: Understand what happened and when
- **User Activity**: Monitor user behavior patterns
- **Legal Requirements**: Maintain audit trails

## Next Steps

1. Add audit middleware to your app.ts
2. Start with high-priority endpoints (user creation, deletion)
3. Gradually add to other CRUD operations
4. Build admin dashboard to view audit logs
5. Set up alerts for suspicious patterns
