import { ZCuid } from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validateId } from "@/middleware/validate";
import * as attendanceController from "./attendance.controller";

const router = Router({ mergeParams: true });

router.post(
	"/:courseId/schedules/classes/:scheduledClassId/attendance",
	validateId(z.object({ scheduledClassId: ZCuid })),
	authenticate,
	attendanceController.markAttendance,
);
router.post(
	"/:courseId/schedules/classes/:scheduledClassId/attendance/bulk",
	validateId(z.object({ scheduledClassId: ZCuid })),
	authenticate,
	attendanceController.markBulkAttendance,
);
router.get(
	"/:courseId/schedules/classes/:scheduledClassId/attendance",
	validateId(z.object({ scheduledClassId: ZCuid })),
	attendanceController.getAttendanceByClass,
);
router.get("/attendance/student", attendanceController.getStudentAttendance);
router.get("/attendance/student/stats", attendanceController.getStudentStats);
router.get(
	"/:courseId/attendance/stats",
	attendanceController.getCourseAttendanceStats,
);

export default router;
