# Audit Logging Implementation Guide

## Overview

This document provides a comprehensive guide for implementing audit logging across all controller operations in the PrepExcellence API.

## Audit Log Architecture

### Core Components

1. **AuditLog Model** - Prisma model that stores audit trail
2. **createAuditLogFromRequest** - Utility function that extracts request metadata
3. **AuditAction Enum** - Predefined actions: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT, PUBLISH, UNPUBLISH, ENROLL, CHANGE_STATUS

### When to Add Audit Logs

Audit logs should be added to ALL operations that:
- **Create** new entities
- **Update** existing entities
- **Delete** entities
- **Change status** (publish, unpublish, activate, deactivate, approve, reject)
- **Enroll** users in courses/programs
- **Authentication** events (login, logout)

## Implementation Pattern

### Step 1: Import Required Dependencies

```typescript
import { AuditAction } from "@/generated/enums";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
```

### Step 2: Add Audit Log After Successful Operation

```typescript
// Example: CREATE operation
const entity = await prisma.entity.create({ data });

// Audit log
const currentUser = req.user as UserWithRoleAndPermissions | undefined;
await createAuditLogFromRequest(req, {
	action: AuditAction.CREATE,
	module: "EntityName",
	entityId: entity.id,
	description: `Entity created: ${entity.name}`,
	performedById: currentUser?.id,
});
```

### Step 3: Choose Appropriate AuditAction

| Operation | AuditAction |
|-----------|------------|
| Create new record | `AuditAction.CREATE` |
| Update existing record | `AuditAction.UPDATE` |
| Delete record | `AuditAction.DELETE` |
| User login | `AuditAction.LOGIN` |
| User logout | `AuditAction.LOGOUT` |
| Approve something | `AuditAction.APPROVE` |
| Reject something | `AuditAction.REJECT` |
| Publish content | `AuditAction.PUBLISH` |
| Unpublish content | `AuditAction.UNPUBLISH` |
| Enroll in course | `AuditAction.ENROLL` |
| Activate/Deactivate/Status changes | `AuditAction.CHANGE_STATUS` |

## Controller-Specific Implementation

### User Controllers ✅ IMPLEMENTED

**File:** `apps/api/src/apps/user/controllers.ts`

**Implemented Operations:**
- ✅ User registration (CREATE)
- ✅ User login (LOGIN)
- ✅ User logout (LOGOUT)
- ✅ User update (UPDATE)
- ✅ User activation/deactivation (CHANGE_STATUS)
- ✅ User deletion (DELETE)
- ✅ Student creation (CREATE)
- ✅ Student update (UPDATE)

### Role Controllers ✅ IMPLEMENTED

**File:** `apps/api/src/apps/role/controllers.ts`

**Implemented Operations:**
- ✅ Role creation (CREATE)
- ✅ Role update (UPDATE)
- ✅ Role deletion (DELETE)

### Coaching Domain - TO IMPLEMENT

#### Course Controller
**File:** `apps/api/src/apps/coaching/course.controller.ts`

**Methods requiring audit logging:**
```typescript
// CREATE
export const createCourse = asyncHandler(async (req, res) => {
	// ... create course ...
	await createAuditLogFromRequest(req, {
		action: AuditAction.CREATE,
		module: "CoachingCourse",
		entityId: course.id,
		description: `Course created: ${course.title}`,
		performedById: req.user?.id,
	});
});

// UPDATE
export const updateCourse = asyncHandler(async (req, res) => {
	// ... update course ...
	await createAuditLogFromRequest(req, {
		action: AuditAction.UPDATE,
		module: "CoachingCourse",
		entityId: id,
		description: `Course updated: ${course.title}`,
		performedById: req.user?.id,
	});
});

// DELETE
export const deleteCourse = asyncHandler(async (req, res) => {
	// ... delete course ...
	await createAuditLogFromRequest(req, {
		action: AuditAction.DELETE,
		module: "CoachingCourse",
		entityId: id,
		description: `Course deleted: ${course.title}`,
		performedById: req.user?.id,
	});
});

// PUBLISH/UNPUBLISH
export const publishCourse = asyncHandler(async (req, res) => {
	// ... publish course ...
	await createAuditLogFromRequest(req, {
		action: AuditAction.PUBLISH,
		module: "CoachingCourse",
		entityId: id,
		description: `Course published: ${course.title}`,
		performedById: req.user?.id,
	});
});
```

#### Module Controller
**File:** `apps/api/src/apps/coaching/module.controller.ts`

**Methods:** `createModule`, `updateModule`, `deleteModule`

#### Enrollment Controller
**File:** `apps/api/src/apps/coaching/enrollment.controller.ts`

**Methods:** `createEnrollment`, `submitAssignment`, `gradeSubmission`, `recordAttendance`

#### Content Controller
**File:** `apps/api/src/apps/coaching/content.controller.ts`

**Methods:** `createContent`, `uploadVideo`, `startLiveSession`, `endLiveSession`, `updateContent`, `deleteContent`

### LMS Domain - TO IMPLEMENT

#### Course Controller
**File:** `apps/api/src/apps/lms/course.controller.ts`

**Methods:** `createCourse`, `updateCourse`, `deleteCourse`, `publishCourse`, `unpublishCourse`

#### Module Controller
**File:** `apps/api/src/apps/lms/module.controller.ts`

**Methods:** `createModule`, `updateModule`, `deleteModule`

#### Lesson Controller
**File:** `apps/api/src/apps/lms/lesson.controller.ts`

**Methods:** `createLesson`, `uploadVideo`, `selectThumbnail`, `updateLesson`, `deleteLesson`

#### Quiz Controller
**File:** `apps/api/src/apps/lms/quiz.controller.ts`

**Methods:** `createQuiz`, `addQuestion`, `updateQuestion`, `deleteQuestion`, `updateQuiz`, `deleteQuiz`, `startAttempt`, `submitAnswer`, `submitQuiz`

#### Progress Controller
**File:** `apps/api/src/apps/lms/progress.controller.ts`

**Methods:** `updateProgress`

#### Review Controller
**File:** `apps/api/src/apps/lms/review.controller.ts`

**Methods:** `createReview`, `updateReview`, `deleteReview`

#### Discussion Controller
**File:** `apps/api/src/apps/lms/discussion.controller.ts`

**Methods:** `createDiscussion`, `updateDiscussion`, `deleteDiscussion`

#### Enrollment Controller
**File:** `apps/api/src/apps/lms/enrollment.controller.ts`

**Methods:** `createEnrollment`

### OneToOne Domain - TO IMPLEMENT

#### Teacher Controller
**File:** `apps/api/src/apps/onetoone/teacher.controller.ts`

**Methods:** `createProfile`, `updateProfile`, `addSpecialization`, `deleteSpecialization`

#### Session Controller
**File:** `apps/api/src/apps/onetoone/session.controller.ts`

**Methods:** `bookSession`, `startSession`, `endSession`, `cancelSession`, `createReview`

#### Availability Controller
**File:** `apps/api/src/apps/onetoone/availability.controller.ts`

**Methods:** `createAvailability`, `deleteAvailability`

#### Recording Controller
**File:** `apps/api/src/apps/onetoone/recording.controller.ts`

**Methods:** `deleteExpiredRecordings`

### Payment Domain - TO IMPLEMENT

#### Payment Controller
**File:** `apps/api/src/apps/payment/payment.controller.ts`

**Methods:** `createPayment`, `updatePaymentStatus`

#### Refund Controller
**File:** `apps/api/src/apps/payment/refund.controller.ts`

**Methods:** `createRefund`, `approveRefund`, `rejectRefund`

### SAT Practice Domain - TO IMPLEMENT

#### SAT Practice Controller
**File:** `apps/api/src/apps/satPractice/sat-practice.controller.ts`

**Methods:** `createTestType`, `updateTestType`, `deleteTestType`, `createSubject`, `updateSubject`, `deleteSubject`, `createDifficulty`, `updateDifficulty`, `deleteDifficulty`, `createDomain`, `updateDomain`, `deleteDomain`, `createSkill`, `updateSkill`, `deleteSkill`, `publishTest`

#### Question Material Controller
**File:** `apps/api/src/apps/satPractice/question-material.controller.ts`

**Methods:** `createQuestion`, `createQuestionBank`, `updateQuestion`, `deleteQuestion`, `createSATPractice`, `updateSATPractice`, `deleteSATPractice`

#### Student Attempt Controller
**File:** `apps/api/src/apps/satPractice/student-attempt.controller.ts`

**Methods:** `startAttempt`, `submitMCQ`, `submitText`, `completeModule`, `navigateToNext`, `submitAttempt`

#### Teacher Grading Controller
**File:** `apps/api/src/apps/satPractice/teacher-grading.controller.ts`

**Methods:** `gradeAnswer`, `updateGrade`, `gradeMultiple`, `recalculateScore`

### Services Domain - TO IMPLEMENT

#### Services Controller
**File:** `apps/api/src/apps/services/controllers.ts`

**Multiple Controllers in one file:**
- GuidanceController: `create`, `update`, `delete`
- NewsLetterController: `create`, `delete`
- TrustedCompaniesController: `create`, `update`, `delete`
- FreeSeminarController: `create`, `delete`
- TutorRequestRegistrationController: `create`, `delete`
- CollegeEssayReviewController: `create`, `delete`
- ContactUsController: `create`, `delete`
- BlogCategoryController: `create`, `update`, `delete`
- BlogController: `create`, `update`, `delete`
- BlogCommentController: `create`, `update`, `delete`

## Best Practices

### 1. Descriptive Messages

Always provide clear, actionable descriptions:
```typescript
// ✅ Good
description: `Course "${course.title}" published by ${user.name}`

// ❌ Bad
description: `Course published`
```

### 2. Include Entity Context

Always include the entity ID and name/identifier:
```typescript
entityId: entity.id,
description: `Entity updated: ${entity.name}`,
```

### 3. Handle Anonymous Operations

For operations that might not have an authenticated user:
```typescript
const currentUser = req.user as UserWithRoleAndPermissions | undefined;
await createAuditLogFromRequest(req, {
	// ...
	performedById: currentUser?.id, // Will be undefined for anonymous
});
```

### 4. Audit After Success

Place audit logging AFTER the successful operation:
```typescript
// ✅ Correct order
const entity = await prisma.entity.create({ data });
await createAuditLogFromRequest(req, { ... });

// ❌ Wrong order - might log failed operations
await createAuditLogFromRequest(req, { ... });
const entity = await prisma.entity.create({ data });
```

### 5. Bulk Operations

For bulk operations, log each item or summarize:
```typescript
// Option 1: Log each item
for (const item of items) {
	await createAuditLogFromRequest(req, {
		action: AuditAction.DELETE,
		module: "Item",
		entityId: item.id,
		description: `Item deleted: ${item.name}`,
		performedById: currentUser.id,
	});
}

// Option 2: Summarize
await createAuditLogFromRequest(req, {
	action: AuditAction.DELETE,
	module: "Item",
	description: `Bulk delete: ${items.length} items deleted`,
	performedById: currentUser.id,
});
```

## Verification

### Check Audit Logs

```sql
-- View recent audit logs
SELECT * FROM audit_logs 
ORDER BY "createdAt" DESC 
LIMIT 50;

-- Audit logs for specific user
SELECT * FROM audit_logs 
WHERE "performedById" = 'user-id'
ORDER BY "createdAt" DESC;

-- Audit logs for specific entity
SELECT * FROM audit_logs 
WHERE "entityId" = 'entity-id'
ORDER BY "createdAt" DESC;

-- Count audit logs by action
SELECT action, COUNT(*) as count
FROM audit_logs 
GROUP BY action
ORDER BY count DESC;
```

### API Endpoints

Once audit log controller is implemented:

```bash
# Get all audit logs (requires AUDIT.VIEW_LOGS permission)
GET /api/v1/audit-logs?page=1&limit=20

# Get audit logs for specific entity
GET /api/v1/audit-logs/entity/:entityId

# Get your own audit logs
GET /api/v1/audit-logs/me

# Filter audit logs
GET /api/v1/audit-logs?module=User&action=CREATE&startDate=2025-01-01
```

## Implementation Checklist

- [x] User authentication operations (login, logout, register)
- [x] User CRUD operations
- [x] Student CRUD operations
- [x] Role CRUD operations
- [x] Audit log controller and routes created
- [ ] Coaching course operations
- [ ] Coaching module operations
- [ ] Coaching enrollment operations
- [ ] Coaching content operations
- [ ] LMS course operations
- [ ] LMS module operations
- [ ] LMS lesson operations
- [ ] LMS quiz operations
- [ ] LMS progress operations
- [ ] LMS review operations
- [ ] LMS discussion operations
- [ ] OneToOne teacher operations
- [ ] OneToOne session operations
- [ ] OneToOne availability operations
- [ ] Payment operations
- [ ] Refund operations
- [ ] SAT practice operations
- [ ] Question bank operations
- [ ] Student attempt operations
- [ ] Teacher grading operations
- [ ] Services domain operations (Blog, Contact, Newsletter, etc.)

## Summary

This audit logging system provides:
- ✅ Complete audit trail of all system changes
- ✅ User accountability (who did what, when)
- ✅ Security monitoring and compliance
- ✅ Debugging and troubleshooting support
- ✅ Historical data analysis
- ✅ IP address and user agent tracking

Follow the patterns demonstrated in User and Role controllers to implement audit logging across all remaining controllers.
