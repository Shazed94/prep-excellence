import {
	ZBulkAttendanceSchema,
	ZCuid,
	ZMarkAttendanceSchema,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as attendanceController from "./attendance.controller";

const router = Router({ mergeParams: true });
const courseIdSchema = z.object({ courseId: ZCuid });

router.post(
	"/:courseId/schedules/classes/:scheduledClassId/attendance",
	validateId(courseIdSchema),
	validateId(z.object({ scheduledClassId: ZCuid })),
	authenticate,
	validate(ZMarkAttendanceSchema),
	attendanceController.markAttendance,
);
router.post(
	"/:courseId/schedules/classes/:scheduledClassId/attendance/bulk",
	validateId(courseIdSchema),
	validateId(z.object({ scheduledClassId: ZCuid })),
	authenticate,
	validate(ZBulkAttendanceSchema),
	attendanceController.markBulkAttendance,
);
router.get(
	"/:courseId/schedules/classes/:scheduledClassId/attendance",
	validateId(courseIdSchema),
	validateId(z.object({ scheduledClassId: ZCuid })),
	attendanceController.getAttendanceByClass,
);
router.get(
	"/attendance/student",
	validateQuery(ZQueryParams),
	attendanceController.getStudentAttendance,
);
router.get(
	"/attendance/student/stats",
	validateQuery(ZQueryParams),
	attendanceController.getStudentStats,
);
router.get(
	"/:courseId/attendance/stats",
	validateId(courseIdSchema),
	attendanceController.getCourseAttendanceStats,
);

export default router;
