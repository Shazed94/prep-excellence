import { ZDifficulty, ZDomain, ZSkill, ZSubject, ZTestType } from '@prepexcellence/shared-validators';
import prisma from "@/infrastructure/database/connection";
import { asyncHandler } from "@/utils/asyncHandler";
import { ZCuid, ZQueryParams } from '@prepexcellence/shared-validators';
import cached from '@/infrastructure/cache/cache';
import { AppError } from '@/utils/AppError';

export class TestTypeController {
    create = asyncHandler(async (req, res) =>{
        const data = ZTestType.parse(req.body); // Validate using Zod schema

        const testType = await prisma.testType.create({
            data
        });

        return res.status(201).json({
            success: true,
            data: testType,
            message: "Test Type created successfully",
        });
    })

    getAll = asyncHandler(async (req, res) =>{
        const {page, limit, sortBy, orderBy} = ZQueryParams.parse(req.query);
        const skip = (page - 1) * limit;

        const cacheKey = `testType:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;
        const cachedData = await cached.get(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return res.status(200).json({
                success: true,
                message: "Test Types fetched successfully (from cache)",
                data: parsed.data,
                pagination: parsed.pagination,
            });
        }
        const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

        const [testTypes, total] = await Promise.all([
            prisma.testType.findMany({
                orderBy: orderClause,
                skip,
                take: limit,
            }),
            prisma.testType.count(),
        ]);

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };

        await cached.set(
            cacheKey,
            JSON.stringify({ data: testTypes, pagination }),
            60,
        );

        return res.status(200).json({
            success: true,
            data: testTypes,
            pagination,
        });
    })

    getById =asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);

        const testType = await prisma.testType.findUnique({
            where: { id },
        });
        if (!testType) throw AppError.notFound("Test Type not found");

        return res.status(200).json({
            success: true,
            data: testType,
        });
    })

    update = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const data = ZTestType.parse(req.body);
        const existing = await prisma.testType.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Test Type not found");
        const updated = await prisma.testType.update({
            where: { id },
            data,
        });

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Test Type updated successfully",
        });
    })

    delete = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const existing = await prisma.testType.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Test Type not found");
        await prisma.testType.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Test Type deleted successfully",
        });
    })
}

export class SubjectController {
    create = asyncHandler(async (req, res) =>{
        const data = ZSubject.parse(req.body); // Validate using Zod schema

        const subject = await prisma.subject.create({
            data
        });

        return res.status(201).json({
            success: true,
            data: subject,
            message: "Subject created successfully",
        });
    })

    getAll = asyncHandler(async (req, res) =>{
        const {page, limit, sortBy, orderBy} = ZQueryParams.parse(req.query);
        const skip = (page - 1) * limit;

        const cacheKey = `subject:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;
        const cachedData = await cached.get(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return res.status(200).json({
                success: true,
                message: "Subjects fetched successfully (from cache)",
                data: parsed.data,
                pagination: parsed.pagination,
            });
        }
        const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

        const [subjects, total] = await Promise.all([
            prisma.subject.findMany({
                orderBy: orderClause,
                skip,
                take: limit,
            }),
            prisma.subject.count(),
        ]);

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };

        await cached.set(
            cacheKey,
            JSON.stringify({ data: subjects, pagination }),
            60,
        );

        return res.status(200).json({
            success: true,
            data: subjects,
            pagination,
        });
    })

    getById =asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);

        const subject = await prisma.subject.findUnique({
            where: { id },
        });
        if (!subject) throw AppError.notFound("Subject not found");

        return res.status(200).json({
            success: true,
            data: subject,
        });
    })

    update = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const data = ZSubject.parse(req.body);
        const existing = await prisma.subject.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Subject not found");
        const updated = await prisma.subject.update({
            where: { id },
            data,
        });

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Subject updated successfully",
        });
    })

    delete = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const existing = await prisma.subject.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Subject not found");
        await prisma.subject.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
        });
    })
}

export class DifficultyController {
    create = asyncHandler(async (req, res) =>{
        const data = ZDifficulty.parse(req.body); // Validate using Zod schema

        const difficulty = await prisma.difficulty.create({
            data
        });

        return res.status(201).json({
            success: true,
            data: difficulty,
            message: "Difficulty created successfully",
        });
    })

    getAll = asyncHandler(async (req, res) =>{
        const {page, limit, sortBy, orderBy} = ZQueryParams.parse(req.query);
        const skip = (page - 1) * limit;

        const cacheKey = `difficulty:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;
        const cachedData = await cached.get(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return res.status(200).json({
                success: true,
                message: "Difficulties fetched successfully (from cache)",
                data: parsed.data,
                pagination: parsed.pagination,
            });
        }
        const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

        const [difficulties, total] = await Promise.all([
            prisma.difficulty.findMany({
                orderBy: orderClause,
                skip,
                take: limit,
            }),
            prisma.difficulty.count(),
        ]);

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };

        await cached.set(
            cacheKey,
            JSON.stringify({ data: difficulties, pagination }),
            60,
        );

        return res.status(200).json({
            success: true,
            data: difficulties,
            pagination,
        });
    })

    getById =asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);

        const difficulty = await prisma.difficulty.findUnique({
            where: { id },
        });
        if (!difficulty) throw AppError.notFound("Difficulty not found");

        return res.status(200).json({
            success: true,
            data: difficulty,
        });
    })

    update = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const data = ZDifficulty.parse(req.body);
        const existing = await prisma.difficulty.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Difficulty not found");
        const updated = await prisma.difficulty.update({
            where: { id },
            data,
        });

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Difficulty updated successfully",
        });
    })

    delete = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const existing = await prisma.difficulty.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Difficulty not found");
        await prisma.difficulty.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Difficulty deleted successfully",
        });
    })
}

export class DomainController {
    create = asyncHandler(async (req, res) =>{
        const data = ZDomain.parse(req.body); // Validate using Zod schema

        const domain = await prisma.domain.create({
            data
        });

        return res.status(201).json({
            success: true,
            data: domain,
            message: "Domain created successfully",
        });
    })

    getAll = asyncHandler(async (req, res) =>{
        const {page, limit, sortBy, orderBy} = ZQueryParams.parse(req.query);
        const skip = (page - 1) * limit;

        const cacheKey = `domain:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;
        const cachedData = await cached.get(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return res.status(200).json({
                success: true,
                message: "Domains fetched successfully (from cache)",
                data: parsed.data,
                pagination: parsed.pagination,
            });
        }
        const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

        const [domains, total] = await Promise.all([
            prisma.domain.findMany({
                orderBy: orderClause,
                skip,
                take: limit,
            }),
            prisma.domain.count(),
        ]);

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };

        await cached.set(
            cacheKey,
            JSON.stringify({ data: domains, pagination }),
            60,
        );

        return res.status(200).json({
            success: true,
            data: domains,
            pagination,
        });
    })

    getById =asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);

        const domain = await prisma.domain.findUnique({
            where: { id },
        });
        if (!domain) throw AppError.notFound("Domain not found");

        return res.status(200).json({
            success: true,
            data: domain,
        });
    })

    update = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const data = ZDomain.parse(req.body);
        const existing = await prisma.domain.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Domain not found");
        const updated = await prisma.domain.update({
            where: { id },
            data,
        });

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Domain updated successfully",
        });
    })

    delete = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const existing = await prisma.domain.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Domain not found");
        await prisma.domain.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Domain deleted successfully",
        });
    })
}

export class SkillController {
    create = asyncHandler(async (req, res) =>{
        const data = ZSkill.parse(req.body); // Validate using Zod schema

        const skill = await prisma.skill.create({
            data
        });

        return res.status(201).json({
            success: true,
            data: skill,
            message: "Skill created successfully",
        });
    })

    getAll = asyncHandler(async (req, res) =>{
        const {page, limit, sortBy, orderBy} = ZQueryParams.parse(req.query);
        const skip = (page - 1) * limit;

        const cacheKey = `skill:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;
        const cachedData = await cached.get(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return res.status(200).json({
                success: true,
                message: "Skills fetched successfully (from cache)",
                data: parsed.data,
                pagination: parsed.pagination,
            });
        }
        const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

        const [skills, total] = await Promise.all([
            prisma.skill.findMany({
                orderBy: orderClause,
                skip,
                take: limit,
            }),
            prisma.skill.count(),
        ]);

        const totalPages = Math.ceil(total / limit);
        const pagination = {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };

        await cached.set(
            cacheKey,
            JSON.stringify({ data: skills, pagination }),
            60,
        );

        return res.status(200).json({
            success: true,
            data: skills,
            pagination,
        });
    })

    getById =asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);

        const skill = await prisma.skill.findUnique({
            where: { id },
        });
        if (!skill) throw AppError.notFound("Skill not found");

        return res.status(200).json({
            success: true,
            data: skill,
        });
    })

    update = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const data = ZSkill.parse(req.body);
        const existing = await prisma.skill.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Skill not found");
        const updated = await prisma.skill.update({
            where: { id },
            data,
        });

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Skill updated successfully",
        });
    })

    delete = asyncHandler(async (req, res) =>{
        const { id } = ZCuid.parse(req.params);
        const existing = await prisma.skill.findUnique({ where: { id } });
        if (!existing) throw AppError.notFound("Skill not found");
        await prisma.skill.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
        });
    })
}
