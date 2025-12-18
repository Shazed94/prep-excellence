import {
	createLMSDiscussionSchema,
	updateLMSDiscussionSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import type { UserWithRoleAndPermissions } from "@/utils/permission";

export const createDiscussion = asyncHandler(
	async (req: Request, res: Response) => {
		const validated = createLMSDiscussionSchema.parse(req.body);
		const user = req.user as UserWithRoleAndPermissions;

		const lesson = await prisma.lMSLesson.findUnique({
			where: { id: validated.lessonId },
		});
		if (!lesson) {
			throw new AppError("Lesson not found", 404);
		}

		if (validated.parentId) {
			const parentDiscussion = await prisma.lMSDiscussion.findUnique({
				where: { id: validated.parentId },
			});
			if (!parentDiscussion) {
				throw new AppError("Parent discussion not found", 404);
			}
			if (parentDiscussion.lessonId !== validated.lessonId) {
				throw new AppError(
					"Parent discussion must belong to the same lesson",
					400,
				);
			}
		}

		const discussion = await prisma.lMSDiscussion.create({
			data: {
				content: validated.content,
				lessonId: validated.lessonId,
				authorId: user.id,
				parentId: validated.parentId || null,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
				replies: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
					orderBy: { createdAt: "asc" },
				},
			},
		});

		res.status(201).json({
			success: true,
			data: discussion,
			message: "Discussion posted successfully",
		});
	},
);

export const getLessonDiscussions = asyncHandler(
	async (req: Request, res: Response) => {
		const { id: lessonId } = ZCuid.parse(req.params.lessonId);
		const { page = 1, limit = 20 } = ZQueryParams.parse(req.query);

		const lesson = await prisma.lMSLesson.findUnique({
			where: { id: lessonId },
		});
		if (!lesson) {
			throw new AppError("Lesson not found", 404);
		}

		const skip = (page - 1) * limit;

		const [discussions, total] = await Promise.all([
			prisma.lMSDiscussion.findMany({
				where: {
					lessonId,
					parentId: null,
				},
				include: {
					author: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
					replies: {
						include: {
							author: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
							replies: {
								include: {
									author: {
										select: {
											id: true,
											name: true,
											email: true,
											image: true,
										},
									},
								},
								orderBy: { createdAt: "asc" },
							},
						},
						orderBy: { createdAt: "asc" },
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.lMSDiscussion.count({
				where: {
					lessonId,
					parentId: null,
				},
			}),
		]);

		res.status(200).json({
			success: true,
			data: discussions,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		});
	},
);

export const getDiscussionById = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params.id);

		const discussion = await prisma.lMSDiscussion.findUnique({
			where: { id },
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
				replies: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
						replies: {
							include: {
								author: {
									select: {
										id: true,
										name: true,
										email: true,
										image: true,
									},
								},
							},
							orderBy: { createdAt: "asc" },
						},
					},
					orderBy: { createdAt: "asc" },
				},
			},
		});

		if (!discussion) {
			throw new AppError("Discussion not found", 404);
		}

		res.status(200).json({
			success: true,
			data: discussion,
		});
	},
);

export const updateDiscussion = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params.id);
		const validated = updateLMSDiscussionSchema.parse(req.body);
		const user = req.user as UserWithRoleAndPermissions;

		const discussion = await prisma.lMSDiscussion.findUnique({
			where: { id },
		});

		if (!discussion) {
			throw new AppError("Discussion not found", 404);
		}

		if (discussion.authorId !== user.id) {
			throw new AppError("You can only edit your own posts", 403);
		}

		const updated = await prisma.lMSDiscussion.update({
			where: { id },
			data: {
				content: validated.content,
				isEdited: true,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
			},
		});

		res.status(200).json({
			success: true,
			data: updated,
			message: "Discussion updated successfully",
		});
	},
);

export const deleteDiscussion = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = ZCuid.parse(req.params.id);
		const user = req.user as UserWithRoleAndPermissions;

		const discussion = await prisma.lMSDiscussion.findUnique({
			where: { id },
		});

		if (!discussion) {
			throw new AppError("Discussion not found", 404);
		}

		if (discussion.authorId !== user.id) {
			throw new AppError("You can only delete your own posts", 403);
		}

		await prisma.lMSDiscussion.delete({
			where: { id },
		});

		res.status(200).json({
			success: true,
			message: "Discussion deleted successfully",
		});
	},
);
