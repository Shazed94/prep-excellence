import { ZCuid } from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validateId } from "@/middleware/validate";
import * as scheduleController from "./schedule.controller";

const router = Router({ mergeParams: true });
const courseIdSchema = z.object({ courseId: ZCuid });

// ── Recurring schedules ──
router.post(
	"/:courseId/schedules/recurring",
	validateId(courseIdSchema),
	authenticate,
	scheduleController.createRecurringSchedule,
);
router.get(
	"/:courseId/schedules/recurring",
	validateId(courseIdSchema),
	scheduleController.getRecurringSchedules,
);
router.patch(
	"/schedules/recurring/:id",
	validateId(ZCuid),
	authenticate,
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
	scheduleController.createScheduleException,
);
router.get(
	"/:courseId/schedules/exceptions",
	validateId(courseIdSchema),
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
	scheduleController.createScheduledClass,
);
router.get(
	"/:courseId/schedules/classes",
	validateId(courseIdSchema),
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
	scheduleController.cancelScheduledClass,
);
router.delete(
	"/schedules/classes/:id",
	validateId(ZCuid),
	authenticate,
	scheduleController.deleteScheduledClass,
);

export default router;
