import {
	ZCuid,
	ZDifficulty,
	ZDomain,
	ZQueryParams,
	ZSkill,
	ZSubject,
	ZTestType,
} from "@prepexcellence/shared-validators";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";

export class TestTypeController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `testType:*`;
		invalidateCachePattern(cacheKey);
		const data = ZTestType.parse(req.body); // Validate using Zod schema

		const testType = await prisma.testType.create({
			data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "TestType",
			entityId: testType.id,
			description: `Created test type: ${testType.name}`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: testType,
			message: "Test Type created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy, search } = ZQueryParams.parse(
			req.query,
		);
		const skip = (page - 1) * limit;

		const cacheKey = `testType:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}`;
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

		// Build search filter
		const whereClause = search
			? {
					OR: [
						{ name: { contains: search, mode: "insensitive" as const } },
						{ description: { contains: search, mode: "insensitive" as const } },
					],
				}
			: {};

		const [testTypes, total] = await Promise.all([
			prisma.testType.findMany({
				where: whereClause,
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.testType.count({ where: whereClause }),
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
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const testType = await prisma.testType.findUnique({
			where: { id },
		});
		if (!testType) throw AppError.notFound("Test Type not found");

		return res.status(200).json({
			success: true,
			data: testType,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `testType:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const data = ZTestType.parse(req.body);
		const existing = await prisma.testType.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Test Type not found");
		const updated = await prisma.testType.update({
			where: { id },
			data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "TestType",
			entityId: updated.id,
			description: `Updated test type: ${updated.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Test Type updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `testType:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const existing = await prisma.testType.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Test Type not found");
		await prisma.testType.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "TestType",
			entityId: existing.id,
			description: `Deleted test type: ${existing.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			message: "Test Type deleted successfully",
		});
	});
}

export class SubjectController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `subject:*`;
		invalidateCachePattern(cacheKey);
		const { testTypeIds, ...rest } = ZSubject.parse(req.body);

		const subject = await prisma.subject.create({
			data: {
				...rest,
				testType: testTypeIds?.length
					? { connect: testTypeIds.map((id) => ({ id })) }
					: undefined,
			},
			include: { testType: true },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Subject",
			entityId: subject.id,
			description: `Created subject: ${subject.name}`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: subject,
			message: "Subject created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;

		const cacheKey = `subject:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}:filters=${JSON.stringify(filters || {})}`;
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

		// Build where clause with search and testTypeId filter
		const whereClause: any = {};

		if (search) {
			whereClause.OR = [
				{ name: { contains: search, mode: "insensitive" as const } },
				{ description: { contains: search, mode: "insensitive" as const } },
			];
		}

		// Filter by testTypeId (many-to-many relation)
		if (filters?.testTypeId) {
			whereClause.testType = {
				some: { id: filters.testTypeId },
			};
		}

		const [subjects, total] = await Promise.all([
			prisma.subject.findMany({
				where: whereClause,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					testType: true,
				},
			}),
			prisma.subject.count({ where: whereClause }),
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
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const subject = await prisma.subject.findUnique({
			where: { id },
			include: {
				testType: true,
			},
		});
		if (!subject) throw AppError.notFound("Subject not found");

		return res.status(200).json({
			success: true,
			data: subject,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `subject:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const { testTypeIds, ...rest } = ZSubject.parse(req.body);
		const existing = await prisma.subject.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Subject not found");
		const updated = await prisma.subject.update({
			where: { id },
			data: {
				...rest,
				testType: { set: testTypeIds?.map((id) => ({ id })) || [] },
			},
			include: {
				testType: true,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Subject",
			entityId: updated.id,
			description: `Updated subject: ${updated.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Subject updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `subject:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const existing = await prisma.subject.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Subject not found");
		await prisma.subject.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "Subject",
			entityId: existing.id,
			description: `Deleted subject: ${existing.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			message: "Subject deleted successfully",
		});
	});
}

export class DifficultyController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `difficulty:*`;
		invalidateCachePattern(cacheKey);
		const data = ZDifficulty.parse(req.body); // Validate using Zod schema

		const difficulty = await prisma.difficulty.create({
			data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Difficulty",
			entityId: difficulty.id,
			description: `Created difficulty: ${difficulty.name}`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: difficulty,
			message: "Difficulty created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;

		const cacheKey = `difficulty:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}`;
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

		const whereClause: any = {};

		if (search) {
			whereClause.OR = [
				{ name: { contains: search, mode: "insensitive" as const } },
				{ description: { contains: search, mode: "insensitive" as const } },
			];
		}
		if (filters?.testTypeId) {
			whereClause.testType = {
				some: { id: filters.testTypeId },
			};
		}

		const [difficulties, total] = await Promise.all([
			prisma.difficulty.findMany({
				where: whereClause,
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.difficulty.count({ where: whereClause }),
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
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const difficulty = await prisma.difficulty.findUnique({
			where: { id },
		});
		if (!difficulty) throw AppError.notFound("Difficulty not found");

		return res.status(200).json({
			success: true,
			data: difficulty,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `difficulty:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const data = ZDifficulty.parse(req.body);
		const existing = await prisma.difficulty.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Difficulty not found");
		const updated = await prisma.difficulty.update({
			where: { id },
			data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Difficulty",
			entityId: updated.id,
			description: `Updated difficulty: ${updated.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Difficulty updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `difficulty:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const existing = await prisma.difficulty.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Difficulty not found");
		await prisma.difficulty.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "Difficulty",
			entityId: existing.id,
			description: `Deleted difficulty: ${existing.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			message: "Difficulty deleted successfully",
		});
	});
}

export class DomainController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `domain:*`;
		invalidateCachePattern(cacheKey);
		const { subjectIds, ...rest } = ZDomain.parse(req.body);

		const domain = await prisma.domain.create({
			data: {
				...rest,
				domain: subjectIds?.length
					? { connect: subjectIds.map((id) => ({ id })) }
					: undefined,
			},
			include: { domain: true },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Domain",
			entityId: domain.id,
			description: `Created domain: ${domain.name}`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: domain,
			message: "Domain created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;

		const cacheKey = `domain:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}; filters=${JSON.stringify(filters || {})}`;
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

		const whereClause: any = {};

		if (search) {
			whereClause.OR = [
				{ name: { contains: search, mode: "insensitive" as const } },
				{ description: { contains: search, mode: "insensitive" as const } },
			];
		}
		if (filters?.subjectId) {
			whereClause.domain = {
				some: { id: filters.subjectId },
			};
		}

		const [domains, total] = await Promise.all([
			prisma.domain.findMany({
				where: whereClause,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					domain: true,
				},
			}),
			prisma.domain.count({ where: whereClause }),
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
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const domain = await prisma.domain.findUnique({
			where: { id },
			include: {
				domain: true,
			},
		});
		if (!domain) throw AppError.notFound("Domain not found");

		return res.status(200).json({
			success: true,
			data: domain,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `domain:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const { subjectIds, ...rest } = ZDomain.parse(req.body);
		const existing = await prisma.domain.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Domain not found");
		const updated = await prisma.domain.update({
			where: { id },
			data: {
				...rest,
				domain: { set: subjectIds?.map((id) => ({ id })) || [] },
			},
			include: {
				domain: true,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Domain",
			entityId: updated.id,
			description: `Updated domain: ${updated.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Domain updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `domain:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const existing = await prisma.domain.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Domain not found");
		await prisma.domain.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "Domain",
			entityId: existing.id,
			description: `Deleted domain: ${existing.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			message: "Domain deleted successfully",
		});
	});
}

export class SkillController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `skill:*`;
		invalidateCachePattern(cacheKey);
		const { domainIds, ...rest } = ZSkill.parse(req.body);

		const skill = await prisma.skill.create({
			data: {
				...rest,
				domain: domainIds?.length
					? { connect: domainIds.map((id) => ({ id })) }
					: undefined,
			},
			include: { domain: true },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Skill",
			entityId: skill.id,
			description: `Created skill: ${skill.name}`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: skill,
			message: "Skill created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;

		const cacheKey = `skill:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}:filters=${JSON.stringify(filters || {})}`;
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

		const whereClause: any = {};
		if (search) {
			whereClause.OR = [
				{ name: { contains: search, mode: "insensitive" as const } },
				{ description: { contains: search, mode: "insensitive" as const } },
			];
		}
		if (filters?.domainId) {
			whereClause.domain = {
				some: { id: filters.domainId },
			};
		}

		console.log(filters?.domainId, "domainId");

		const [skills, total] = await Promise.all([
			prisma.skill.findMany({
				where: whereClause,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					domain: true,
				},
			}),
			prisma.skill.count({ where: whereClause }),
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
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const skill = await prisma.skill.findUnique({
			where: { id },
			include: {
				domain: true,
			},
		});
		if (!skill) throw AppError.notFound("Skill not found");

		return res.status(200).json({
			success: true,
			data: skill,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `skill:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const { domainIds, ...rest } = ZSkill.parse(req.body);
		const existing = await prisma.skill.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Skill not found");
		const updated = await prisma.skill.update({
			where: { id },
			data: {
				...rest,
				domain: { set: domainIds?.map((id) => ({ id })) || [] },
			},
			include: {
				domain: true,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Skill",
			entityId: updated.id,
			description: `Updated skill: ${updated.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Skill updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `skill:*`;
		invalidateCachePattern(cacheKey);
		const { id } = ZCuid.parse(req.params);
		const existing = await prisma.skill.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Skill not found");
		await prisma.skill.delete({
			where: { id },
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "Skill",
			entityId: existing.id,
			description: `Deleted skill: ${existing.name}`,
			performedById: req.user?.id,
		});

		return res.status(200).json({
			success: true,
			message: "Skill deleted successfully",
		});
	});
}
