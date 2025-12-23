# Audit Logging Quick Reference

## 🎯 Quick Start

### 1. Import Dependencies
```typescript
import { AuditAction } from "@/generated/enums";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
```

### 2. Add After Successful Operation
```typescript
// After your database operation
await createAuditLogFromRequest(req, {
	action: AuditAction.CREATE,        // Choose appropriate action
	module: "EntityName",              // Entity type (User, Course, etc.)
	entityId: entity.id,               // ID of affected entity
	description: `Entity created: ${entity.name}`, // Human-readable description
	performedById: req.user?.id,       // Who performed the action
});
```

## 📋 Audit Actions Reference

| Action | When to Use | Example |
|--------|-------------|---------|
| `AuditAction.CREATE` | Creating new records | User registration, Course creation |
| `AuditAction.UPDATE` | Modifying existing records | Profile update, Course edit |
| `AuditAction.DELETE` | Removing records | User deletion, Course removal |
| `AuditAction.LOGIN` | User authentication | Successful login |
| `AuditAction.LOGOUT` | User sign-out | User logout |
| `AuditAction.PUBLISH` | Publishing content | Publishing a course |
| `AuditAction.UNPUBLISH` | Unpublishing content | Unpublishing a course |
| `AuditAction.APPROVE` | Approving requests | Approving refund, enrollment |
| `AuditAction.REJECT` | Rejecting requests | Rejecting refund, enrollment |
| `AuditAction.ENROLL` | Enrollment actions | Enrolling in course |
| `AuditAction.CHANGE_STATUS` | Status changes | Activating/deactivating user |

## 💡 Common Patterns

### Pattern 1: CREATE Operation
```typescript
create = asyncHandler(async (req, res) => {
	const data = ZCreateSchema.parse(req.body);
	
	const entity = await prisma.entity.create({ data });
	
	// Audit log
	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "Entity",
		entityId: entity.id,
		description: `Entity created: ${entity.name}`,
		performedById: req.user?.id,
	});
	
	res.status(201).json({ success: true, data: entity });
});
```

### Pattern 2: UPDATE Operation
```typescript
update = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const data = ZUpdateSchema.parse(req.body);
	const currentUser = req.user as UserWithRoleAndPermissions;
	
	const entity = await prisma.entity.update({ 
		where: { id }, 
		data 
	});
	
	// Audit log
	await createAuditLogFromRequest(req, {
		action: AuditAction.UPDATE,
		module: "Entity",
		entityId: id,
		description: `Entity updated: ${entity.name}`,
		performedById: currentUser.id,
	});
	
	res.json({ success: true, data: entity });
});
```

### Pattern 3: DELETE Operation
```typescript
delete = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const currentUser = req.user as UserWithRoleAndPermissions;
	
	// Get entity details BEFORE deletion
	const entity = await prisma.entity.findUnique({ 
		where: { id },
		select: { id: true, name: true }
	});
	if (!entity) throw AppError.notFound("Entity not found");
	
	await prisma.entity.delete({ where: { id } });
	
	// Audit log
	await createAuditLogFromRequest(req, {
		action: AuditAction.DELETE,
		module: "Entity",
		entityId: id,
		description: `Entity deleted: ${entity.name}`,
		performedById: currentUser.id,
	});
	
	res.json({ success: true, message: "Entity deleted" });
});
```

### Pattern 4: STATUS CHANGE (Publish/Unpublish)
```typescript
publish = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { isPublished } = req.body;
	
	const entity = await prisma.entity.update({
		where: { id },
		data: { 
			isPublished,
			publishedAt: isPublished ? new Date() : null 
		}
	});
	
	// Audit log with dynamic action
	await createAuditLogFromRequest(req, {
		action: isPublished ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
		module: "Entity",
		entityId: id,
		description: `Entity ${isPublished ? 'published' : 'unpublished'}: ${entity.name}`,
		performedById: req.user?.id,
	});
	
	res.json({ success: true, data: entity });
});
```

### Pattern 5: AUTHENTICATION
```typescript
login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	
	const user = await prisma.user.findUnique({ where: { email } });
	// ... validate password ...
	
	// Audit log
	await createAuditLogFromRequest(req, {
		action: AuditAction.LOGIN,
		module: "User",
		entityId: user.id,
		description: `User logged in: ${user.email}`,
		performedById: user.id,
	});
	
	// Generate tokens and respond
	res.json({ success: true, data: { user, tokens } });
});

logout = asyncHandler(async (req, res) => {
	const currentUser = req.user as UserWithRoleAndPermissions | undefined;
	
	if (currentUser) {
		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.LOGOUT,
			module: "User",
			entityId: currentUser.id,
			description: `User logged out: ${currentUser.email}`,
			performedById: currentUser.id,
		});
	}
	
	res.json({ success: true, message: "Logout successful" });
});
```

### Pattern 6: APPROVE/REJECT
```typescript
approve = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const currentUser = req.user as UserWithRoleAndPermissions;
	
	const entity = await prisma.entity.update({
		where: { id },
		data: { status: "APPROVED", approvedBy: currentUser.id }
	});
	
	// Audit log
	await createAuditLogFromRequest(req, {
		action: AuditAction.APPROVE,
		module: "Entity",
		entityId: id,
		description: `Entity approved: ${entity.name}`,
		performedById: currentUser.id,
	});
	
	res.json({ success: true, data: entity });
});
```

### Pattern 7: Anonymous Operations
```typescript
create = asyncHandler(async (req, res) => {
	const data = req.body;
	const currentUser = req.user as UserWithRoleAndPermissions | undefined;
	
	const entity = await prisma.entity.create({ data });
	
	// Audit log - performedById can be undefined for public operations
	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "Entity",
		entityId: entity.id,
		description: `Entity created: ${entity.name}`,
		performedById: currentUser?.id, // Will be undefined if not authenticated
	});
	
	res.status(201).json({ success: true, data: entity });
});
```

## 🔍 Querying Audit Logs

### API Endpoints

```bash
# Get all logs
GET /api/v1/audit-logs?page=1&limit=20

# Filter by module
GET /api/v1/audit-logs?module=User

# Filter by action
GET /api/v1/audit-logs?action=CREATE

# Filter by user
GET /api/v1/audit-logs?performedById=user-id

# Filter by date range
GET /api/v1/audit-logs?startDate=2025-01-01T00:00:00Z&endDate=2025-12-31T23:59:59Z

# Get entity history
GET /api/v1/audit-logs/entity/:entityId

# Get my audit logs
GET /api/v1/audit-logs/me
```

### Database Queries

```sql
-- Recent logs
SELECT * FROM audit_logs ORDER BY "createdAt" DESC LIMIT 50;

-- User activity
SELECT * FROM audit_logs WHERE "performedById" = 'user-id';

-- Entity history
SELECT * FROM audit_logs WHERE "entityId" = 'entity-id';

-- Action summary
SELECT action, COUNT(*) FROM audit_logs GROUP BY action;
```

## ✅ Checklist

Before committing your code with audit logging:

- [ ] Imported `AuditAction` from `@/generated/enums`
- [ ] Imported `createAuditLogFromRequest` from `@/utils/auditLog`
- [ ] Added audit log AFTER successful operation (not before)
- [ ] Used correct `AuditAction` for the operation type
- [ ] Provided correct `module` name (entity type)
- [ ] Included `entityId` when applicable
- [ ] Wrote descriptive `description` with entity name/identifier
- [ ] Passed `performedById` (can be undefined for anonymous)
- [ ] Tested the operation and verified audit log is created
- [ ] Checked database to confirm audit log entry exists

## 🚫 Common Mistakes

### ❌ Don't: Log before operation
```typescript
// WRONG - logs even if operation fails
await createAuditLogFromRequest(req, { ... });
const entity = await prisma.entity.create({ data });
```

### ✅ Do: Log after successful operation
```typescript
// CORRECT - only logs if operation succeeds
const entity = await prisma.entity.create({ data });
await createAuditLogFromRequest(req, { ... });
```

### ❌ Don't: Use generic descriptions
```typescript
description: "Entity updated"  // Too generic
```

### ✅ Do: Include entity details
```typescript
description: `Course updated: ${course.title}`  // Clear and specific
```

### ❌ Don't: Forget to handle errors
```typescript
// No error handling - audit log might fail silently
await createAuditLogFromRequest(req, { ... });
```

### ✅ Do: Let it fail gracefully
```typescript
// The createAuditLog function already handles errors internally
// It logs errors to console but doesn't throw
await createAuditLogFromRequest(req, { ... });
```

## 📖 Reference Files

- **Implementation Guide:** `apps/api/COMPREHENSIVE_AUDIT_LOGGING_GUIDE.md`
- **Implementation Status:** `AUDIT_LOGGING_IMPLEMENTATION_STATUS.md`
- **Example Implementation:** `apps/api/src/apps/user/controllers.ts`
- **Audit Utility:** `apps/api/src/utils/auditLog.ts`

## 🎓 Learning by Example

Check these files for complete implementations:
1. **User Operations:** `apps/api/src/apps/user/controllers.ts`
2. **Role Management:** `apps/api/src/apps/role/controllers.ts`
3. **Course Management:** `apps/api/src/apps/coaching/course.controller.ts`
