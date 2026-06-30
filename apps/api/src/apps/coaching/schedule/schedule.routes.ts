import {
	ZCCoachingRecurringScheduleSchema,
	ZCCoachingScheduledClassSchema,
	ZCCoachingScheduleExceptionSchema,
	ZCuid,
	ZQueryParams,
	ZUCoachingRecurringScheduleSchema,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as scheduleController from "./schedule.controller";

const router = Router({ mergeParams: true });
const courseIdSchema = z.object({ courseId: z.cuid("Invalid CUID format"), });

// ── Recurring schedules ──
router.post(
	"/:courseId/schedules/recurring",
	validateId(courseIdSchema),
	authenticate,
	validate(ZCCoachingRecurringScheduleSchema),
	scheduleController.createRecurringSchedule,
);
router.get(
	"/:courseId/schedules/recurring",
	validateId(courseIdSchema),
	validateQuery(ZQueryParams),
	scheduleController.getRecurringSchedules,
);
router.patch(
	"/schedules/recurring/:id",
	validateId(ZCuid),
	authenticate,
	validate(ZUCoachingRecurringScheduleSchema),
	scheduleController.updateRecurringSchedule,
);
router.delete(
	"/schedules/recurring/:id",
	validateId(ZCuid),
	authenticate,
	scheduleController.deleteRecurringSchedule,
);

// ── Schedule exceptions ──
router.post(
	"/:courseId/schedules/exceptions",
	validateId(courseIdSchema),
	authenticate,
	validate(ZCCoachingScheduleExceptionSchema),
	scheduleController.createScheduleException,
);
router.get(
	"/:courseId/schedules/exceptions",
	validateId(courseIdSchema),
	validateQuery(ZQueryParams),
	scheduleController.getScheduleExceptions,
);
router.delete(
	"/schedules/exceptions/:id",
	validateId(ZCuid),
	authenticate,
	scheduleController.deleteScheduleException,
);

// ── Scheduled classes ──
router.post(
	"/:courseId/schedules/classes",
	validateId(courseIdSchema),
	authenticate,
	validate(ZCCoachingScheduledClassSchema),
	scheduleController.createScheduledClass,
);
router.get(
	"/:courseId/schedules/classes",
	validateId(courseIdSchema),
	validateQuery(ZQueryParams),
	scheduleController.getScheduledClasses,
);
router.get(
	"/schedules/classes/:id",
	validateId(ZCuid),
	scheduleController.getScheduledClass,
);
router.patch(
	"/schedules/classes/:id/cancel",
	validateId(ZCuid),
	authenticate,
	validate(z.object({ reason: z.string().optional() })),
	scheduleController.cancelScheduledClass,
);
router.delete(
	"/schedules/classes/:id",
	validateId(ZCuid),
	authenticate,
	scheduleController.deleteScheduledClass,
);

export default router;
