import type { Request } from "express";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export interface CreateModuleInput {
	title: string;
	description?: string;
	orderIndex: number;
	duration?: number;
}

export interface UpdateModuleInput {
	title?: string;
	description?: string;
	orderIndex?: number;
	duration?: number;
	isActive?: boolean;
}

class LMSModuleService {
	async create(courseId: string, data: CreateModuleInput, req: Request) {
		const course = await prisma.course.findUnique({
			where: { id: courseId },
			select: { id: true, courseType: true, title: true },
		});
		if (!course) throw AppError.notFound("Course not found");
		if (course.courseType !== "LMS") {
			throw AppError.badRequest("Not an LMS course");
		}

		const existing = await prisma.courseModule.findUnique({
			where: {
				courseId_orderIndex: { courseId, orderIndex: data.orderIndex },
			},
		});
		if (existing) {
			throw AppError.badRequest(
				`Module with orderIndex ${data.orderIndex} already exists`,
			);
		}

		const module = await prisma.courseModule.create({
			data: { ...data, courseId, unlockAtPercent: 0 },
			include: { lessons: true },
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "LMSModule",
			entityId: module.id,
			description: `Module created: ${data.title} in course ${course.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern(`lms:course:${courseId}`);
		return module;
	}

	async list(courseId: string) {
		const modules = await prisma.courseModule.findMany({
			where: { courseId, isActive: true },
			orderBy: { orderIndex: "asc" },
			include: {
				lessons: {
					where: { isActive: true, isPublished: true },
					orderBy: { orderIndex: "asc" },
					select: {
						id: true,
						title: true,
						orderIndex: true,
						lessonType: true,
						isPublished: true,
						videoContent: {
							select: { id: true, duration: true, status: true },
						},
					},
				},
				_count: { select: { lessons: true } },
			},
		});
		return modules;
	}

	async update(id: string, data: UpdateModuleInput, req: Request) {
		const mod = await prisma.courseModule.findUnique({ where: { id } });
		if (!mod) throw AppError.notFound("Module not found");

		if (data.orderIndex !== undefined && data.orderIndex !== mod.orderIndex) {
			const existing = await prisma.courseModule.findUnique({
				where: {
					courseId_orderIndex: {
						courseId: mod.courseId,
						orderIndex: data.orderIndex,
					},
				},
			});
			if (existing && existing.id !== id) {
				throw AppError.badRequest(
					`Module with orderIndex ${data.orderIndex} already exists`,
				);
			}
		}

		const updated = await prisma.courseModule.update({
			where: { id },
			data,
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "LMSModule",
			entityId: id,
			description: `Module updated: ${updated.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`lms:course:${mod.courseId}`);
		return updated;
	}

	async delete(id: string, req: Request) {
		const mod = await prisma.courseModule.findUnique({ where: { id } });
		if (!mod) throw AppError.notFound("Module not found");

		await prisma.courseModule.update({
			where: { id },
			data: { isActive: false },
		});
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "LMSModule",
			entityId: id,
			description: `Module deleted: ${mod.title}`,
			performedById: req.user?.id,
		});
		await invalidateCachePattern(`lms:course:${mod.courseId}`);
	}
}

export const lmsModuleService = new LMSModuleService();
