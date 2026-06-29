import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
import { coachingCourseService } from "./course.service";

export const createCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const bodyData = { ...req.body };
		if (bodyData.price) bodyData.price = Number(bodyData.price);
		if (bodyData.discount) bodyData.discount = Number(bodyData.discount);
		if (bodyData.duration) bodyData.duration = Number(bodyData.duration);

		if (typeof bodyData.tags === "string") {
			try {
				bodyData.tags = JSON.parse(bodyData.tags);
			} catch {
				bodyData.tags = [];
			}
		}
		if (typeof bodyData.requirements === "string") {
			try {
				bodyData.requirements = JSON.parse(bodyData.requirements);
			} catch {
				bodyData.requirements = [];
			}
		}
		if (typeof bodyData.whatYouLearn === "string") {
			try {
				bodyData.whatYouLearn = JSON.parse(bodyData.whatYouLearn);
			} catch {
				bodyData.whatYouLearn = [];
			}
		}

		const user = req.user as UserWithRoleAndPermissions;
		const course = await coachingCourseService.create(bodyData, user.id, req);
		res.status(201).json({ success: true, data: course });
	},
);

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
	const { page, limit, sortBy, orderBy, search, filters } = req.query as any;
	const result = await coachingCourseService.list({
		page: page ? Number(page) : 1,
		limit: limit ? Number(limit) : 10,
		sortBy: sortBy as string,
		orderBy: orderBy as "asc" | "desc",
		search: search as string,
		filters: filters ? JSON.parse(filters as string) : undefined,
		isPublished: true,
	});
	res.status(200).json({ success: true, ...result });
});

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
	const course = await coachingCourseService.getById(req.params.id);
	res.status(200).json({ success: true, data: course });
});

export const updateCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const course = await coachingCourseService.update(
			req.params.id,
			req.body,
			req,
		);
		res.status(200).json({ success: true, data: course });
	},
);

export const publishCourse = asyncHandler(
	async (req: Request, res: Response) => {
		const { isPublished } = req.body;
		if (typeof isPublished !== "boolean") {
			throw AppError.badRequest("isPublished must be a boolean");
		}
		const course = await coachingCourseService.publish(
			req.params.id,
			isPublished,
			req,
		);
		res.status(200).json({ success: true, data: course });
	},
);

export const deleteCourse = asyncHandler(
	async (req: Request, res: Response) => {
		await coachingCourseService.delete(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Course deleted successfully" });
	},
);
