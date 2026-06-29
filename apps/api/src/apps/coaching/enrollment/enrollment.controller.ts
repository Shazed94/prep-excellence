import type { Request, Response } from "express";
import { enrollmentService } from "@/apps/shared/services/enrollment.service";
import prisma from "@/infrastructure/database/connection";
import { asyncHandler } from "@/utils/asyncHandler";
import type { UserWithRoleAndPermissions } from "@/utils/permission";

export const enrollStudent = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user as UserWithRoleAndPermissions;
		const courseId = req.params.courseId;

		const course = await prisma.course.findFirst({
			where: { id: courseId, courseType: "COACHING" },
		});
		if (!course) {
			res
				.status(404)
				.json({ success: false, message: "Coaching course not found" });
			return;
		}

		const enrollment = await enrollmentService.enroll({
			courseId,
			studentId: user.id,
			courseType: "COACHING",
		});
		res.status(201).json({ success: true, data: enrollment });
	},
);

export const getEnrollments = asyncHandler(
	async (req: Request, res: Response) => {
		const courseId = req.params.courseId;
		const { page, limit } = req.query as any;
		const enrollments = await enrollmentService.list({
			courseId,
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 20,
		});
		res.status(200).json({ success: true, ...enrollments });
	},
);

export const getMyEnrollments = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user as UserWithRoleAndPermissions;
		const { page, limit, status } = req.query as any;

		const enrollments = await enrollmentService.list({
			studentId: user.id,
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 20,
			status: status,
		});

		const coachingEnrollments = {
			...enrollments,
			data: enrollments.data.filter(
				(e: any) => e.course?.courseType === "COACHING",
			),
		};
		res.status(200).json({ success: true, ...coachingEnrollments });
	},
);

export const updateEnrollmentStatus = asyncHandler(
	async (req: Request, res: Response) => {
		const { status } = req.body;
		const enrollment = await enrollmentService.updateStatus(
			req.params.id,
			status,
		);
		res.status(200).json({ success: true, data: enrollment });
	},
);

export const cancelEnrollment = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user as UserWithRoleAndPermissions;
		await enrollmentService.cancel(req.params.courseId, user.id);
		res.status(200).json({ success: true, message: "Enrollment cancelled" });
	},
);

export const checkEnrollment = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user as UserWithRoleAndPermissions;
		const isEnrolled = await enrollmentService.isEnrolled(
			req.params.courseId,
			user.id,
		);
		res.status(200).json({ success: true, data: { isEnrolled } });
	},
);
