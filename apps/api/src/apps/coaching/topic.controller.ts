import {
    createCoachingTopicSchema,
    updateCoachingTopicSchema,
    ZCuid,
    ZQueryParams,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere } from "@/utils/filters";
import { toPublicUrl } from "@/utils/storageUrl";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";



export const createModuleTopic = asyncHandler(
    async (req: Request, res: Response) => {
        const { moduleId } = req.params;
        const validated = createCoachingTopicSchema.parse(req.body);

        const lesson = await prisma.coachingTopic.create({
            data: {
                ...validated,
                moduleId,
            },
        });

        await invalidateCachePattern(`coachingTopic:${moduleId}:*`);

        // Audit log
        await createAuditLogFromRequest(req, {
            action: AuditAction.CREATE,
            module: "CoachingTopic",
            entityId: lesson.id,
            description: `Created topic "${validated.title}" in module ${moduleId}`,
            performedById: req.user?.id,
        });

        res.status(201).json({
            success: true,
            data: lesson,
        });
    },
);



export const updateModuleTopic = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = ZCuid.parse(req.params);
        const validated = updateCoachingTopicSchema.parse(req.body);

        const lesson = await prisma.coachingTopic.update({
            where: { id },
            data: validated,
        });
        await invalidateCachePattern(`coachingTopic:${lesson.moduleId}:*`);
        await createAuditLogFromRequest(req, {
            action: AuditAction.UPDATE,
            module: "CoachingTopic",
            entityId: id,
            description: `Updated topic "${validated.title || lesson.title}" in module ${lesson.moduleId}`,
            performedById: req.user?.id,
        });
        res.json({
            success: true,
            data: lesson,
        });
    },
);



export const deleteModuleTopic = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = ZCuid.parse(req.params);

        const topic = await prisma.coachingTopic.findUnique({ where: { id } });
        if (topic) {
       
            await prisma.coachingTopic.delete({
                where: { id },
            });
            await invalidateCachePattern(`coachingTopic:${topic.moduleId}:*`);
            await createAuditLogFromRequest(req, {
                action: AuditAction.DELETE,
                module: "CoachingTopic",
                entityId: id,
                description: `Deleted topic from module ${topic.moduleId}`,
                performedById: req.user?.id,
            });
        }
        res.json({
            success: true,
            message: "Topic deleted successfully",
        });
    },
);



export const getModuleTopic = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = ZCuid.parse(req.params);

        const topic = await prisma.coachingTopic.findUnique({
            where: { id },
        });

        if (!topic) {
            throw new AppError("Topic not found", 404);
        }

        res.json({
            success: true,
            data: topic,
        });
    },
);




export const getModuleTopics = asyncHandler(async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    ZCuid.parse({ id: moduleId });
    const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
        req.query,
    );
    const studentId = filters?.studentId;

    const skip = (page - 1) * limit;

    const cacheKey = `lessons:${moduleId}:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}:studentId=${studentId || "anon"}`;

    const cachedData = await cached.get(cacheKey);
    if (cachedData) {
        const parsed = JSON.parse(cachedData);
        return res.status(200).json({
            success: true,
            message: "Lessons fetched successfully (from cache)",
            data: parsed.data,
            pagination: parsed.pagination,
        });
    }

    const ALLOWED_FILTERS = ["contentType", "videoStatus"];
    const where = buildWhere(filters, ALLOWED_FILTERS);
    where.moduleId = moduleId;

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const orderClause: Record<string, "asc" | "desc"> =
        sortBy === "orderIndex" ? { orderIndex: "asc" } : { [sortBy]: orderBy };

    const [lessons, total] = await Promise.all([
        prisma.lMSLesson.findMany({
            where,
            skip,
            take: limit,
            orderBy: orderClause,
        }),
        prisma.lMSLesson.count({ where }),
    ]);

    // If studentId provided, check unlock status based on previous lesson completion
    let processedLessons = lessons;
    if (studentId) {
        const progress = await prisma.lMSProgress.findMany({
            where: {
                studentId: studentId as string,
            },
            select: {
                lessonId: true,
                isCompleted: true,
            },
        });

        const completedLessonIds = new Set(
            progress.filter((p) => p.isCompleted).map((p) => p.lessonId),
        );

        processedLessons = lessons.map((lesson, index) => {
            // First lesson is always unlocked
            if (index === 0) {
                return { ...lesson, isUnlocked: true };
            }

            // Check if previous lesson is completed
            const previousLesson = lessons[index - 1];
            const isPreviousCompleted = completedLessonIds.has(previousLesson.id);

            return { ...lesson, isUnlocked: isPreviousCompleted };
        });
    }

    const totalPages = Math.ceil(total / limit);
    const pagination = {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };

    const data = processedLessons.map((lesson) => ({
        ...lesson,
        masterPlaylistUrl: lesson.masterPlaylistUrl
            ? toPublicUrl(lesson.masterPlaylistUrl)
            : null,
        thumbnailUrl: lesson.thumbnailUrl ? toPublicUrl(lesson.thumbnailUrl) : null,
    }));

    await cached.set(cacheKey, JSON.stringify({ data, pagination }), 60);

    return res.json({
        success: true,
        data,
        pagination,
    });
});
