# How to Enable Audit Logging in Your App

## Step 1: Add Audit Middleware to app.ts

Open `apps/api/src/app.ts` and add the audit middleware. Add it **after** your authentication middleware but **before** your routes.

```typescript
// At the top with other imports (around line 24)
import { auditMiddleware } from "./middleware/audit";

// Then in the initializeApp() function, add this line BEFORE your routes
// (around line 52-55, after rateLimiter and before Swagger docs)

	// Rate limiting
	app.use(rateLimiter);

	// 👇 ADD THIS LINE
	app.use(auditMiddleware);

	// Swagger documentation
	const swaggerSpec = swaggerJsdoc(swaggerOptions);
```

### Complete Example of Where to Add:

```typescript
export function initializeApp(): Application {
	const app: Application = express();

	// Security middleware
	app.use(helmet());
	app.use(cors(config.cors));

	// Request parsing
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ extended: true, limit: "10mb" }));

	// Logging
	if (config.nodeEnv !== "test") {
		app.use(
			morgan("combined", {
				stream: { write: (message) => logger.info(message.trim()) },
			}),
		);
	}

	// Metrics middleware
	app.use(metricsService.middleware());

	// Rate limiting
	app.use(rateLimiter);

	// ✨✨✨ ADD AUDIT MIDDLEWARE HERE ✨✨✨
	app.use(auditMiddleware);

	// Swagger documentation
	const swaggerSpec = swaggerJsdoc(swaggerOptions);
	// ... rest of your code
```

---

## Step 2: Test It Works

### Option A: Add to Registration Endpoint

In `apps/api/src/apps/user/controllers.ts`, add audit logging to the register method:

```typescript
// Add this import at the top
import { createAuditLog, getIpAddress, getUserAgent } from "@/utils/auditLog";

// Then in the register method, after creating the user:
const user = await prisma.user.create({
	data: {
		name: data.name,
		email: data.email,
		roleId: roleIns.id,
		password: hashedPassword,
	},
});

// ✨ ADD THIS
await createAuditLog({
	action: "CREATE",
	module: "USER",
	entityId: user.id,
	description: `New user registered: ${user.name} (${user.email}) with role ${roleIns.name}`,
	performedById: user.id,
	ipAddress: getIpAddress(req),
	userAgent: getUserAgent(req),
});

// Continue with token generation...
```

### Option B: Create a Test Endpoint

Add this test endpoint to quickly verify audit logging works:

```typescript
// In apps/api/src/apps/user/controllers.ts
import { createAuditLog, getIpAddress, getUserAgent } from "@/utils/auditLog";

// Add this method to AuthController class
testAudit = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const log = await createAuditLog({
			action: "CREATE",
			module: "TEST",
			description: "Testing audit logging system",
			ipAddress: getIpAddress(req),
			userAgent: getUserAgent(req),
		});

		return res.json({
			success: true,
			message: "Audit log created successfully",
			data: log,
		});
	}
);

// Then add a route in apps/api/src/apps/user/routes.ts
router.post("/test-audit", authController.testAudit);
```

Test it:
```bash
curl -X POST http://localhost:4000/api/v1/test-audit
```

---

## Step 3: Verify in Database

Check that audit logs are being created:

```sql
-- View recent audit logs
SELECT * FROM audit_logs 
ORDER BY "createdAt" DESC 
LIMIT 10;

-- Count logs by action
SELECT action, COUNT(*) as count 
FROM audit_logs 
GROUP BY action 
ORDER BY count DESC;

-- View logs for a specific module
SELECT * FROM audit_logs 
WHERE module = 'USER' 
ORDER BY "createdAt" DESC;
```

Or use Prisma Studio:
```bash
cd apps/api
pnpm prisma studio
```

---

## Step 4: Add to More Endpoints

Start adding audit logging to your important operations. Here are the most critical ones:

### Priority 1 (Do First):
1. **User Registration** - `CREATE` in `USER`
2. **User Login** - `LOGIN` in `AUTH`
3. **User Deletion** - `DELETE` in `USER`

### Priority 2 (Do Next):
4. **User Update** - `UPDATE` in `USER`
5. **Status Changes** - `CHANGE_STATUS` in `USER`
6. **Blog Publish** - `PUBLISH` in `BLOG`

### Priority 3 (Eventually):
7. All other CRUD operations
8. Enrollment operations
9. Payment operations

---

## Quick Reference

### For CREATE operations:
```typescript
await createAuditLog({
  action: "CREATE",
  module: "YOUR_MODULE",
  entityId: created.id,
  description: `Description of what was created`,
  performedById: req.user?.id,
  ipAddress: getIpAddress(req),
  userAgent: getUserAgent(req),
});
```

### For UPDATE operations:
```typescript
await createAuditLog({
  action: "UPDATE",
  module: "YOUR_MODULE",
  entityId: id,
  description: `Description of what was updated`,
  performedById: req.user?.id,
  ipAddress: getIpAddress(req),
  userAgent: getUserAgent(req),
});
```

### For DELETE operations:
```typescript
// Get info before deletion
const item = await prisma.item.findUnique({ where: { id } });

await prisma.item.delete({ where: { id } });

await createAuditLog({
  action: "DELETE",
  module: "YOUR_MODULE",
  entityId: id,
  description: `Description of what was deleted: ${item?.name}`,
  performedById: req.user?.id,
  ipAddress: getIpAddress(req),
  userAgent: getUserAgent(req),
});
```

---

## Troubleshooting

### Audit logs not being created?

1. **Check middleware is added**: Make sure `auditMiddleware` is in app.ts
2. **Check import**: Make sure you imported the audit functions
3. **Check database**: Ensure audit_logs table exists (run migration)
4. **Check errors**: Look at console for any errors
5. **Check function is called**: Add console.log before createAuditLog

### Errors when creating audit logs?

The system is designed to **not throw errors** - it will catch and log them. Check your console/logs for error messages.

---

## Files to Modify

Based on your current setup, you should modify:

1. ✅ `/apps/api/src/app.ts` - Add audit middleware
2. ✅ `/apps/api/src/apps/user/controllers.ts` - Add to user operations
3. Optional: Create `/apps/api/src/apps/auditLog/` - For audit log API

---

## What You Get

Once implemented, you'll be able to:

- ✅ Track all user registrations
- ✅ Monitor login/logout activities
- ✅ See who created/updated/deleted what
- ✅ Investigate security incidents
- ✅ Comply with audit requirements
- ✅ Debug issues by seeing history
- ✅ Generate activity reports

---

## Need Help?

Refer to these files:
- `AUDIT_LOGGING_GUIDE.md` - Complete documentation
- `AUDIT_LOGGING_IMPLEMENTATION_SUMMARY.md` - Overview
- `examples/audit-integration-examples.ts` - All patterns
- `examples/real-world-audit-implementation.ts` - Actual code changes
- `examples/audit-log-routes-and-controllers.ts` - API routes

---

Ready to implement? Start with Step 1 above! 🚀
