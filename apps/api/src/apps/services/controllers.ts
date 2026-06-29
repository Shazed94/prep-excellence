import {
	ZCBlogCategorySchema,
	ZCBlogCommentSchema,
	ZCBlogSchema,
	ZCCategorySchema,
	ZCContactUsSchema,
	ZCFreeSeminarEnrollmentForm,
	ZCFreeSeminarForm,
	ZCTrustedCompanies,
	ZCuid,
	ZNewsletterSubscription,
	ZQueryParams,
	ZUBlogCategorySchema,
	ZUBlogCommentSchema,
	ZUBlogSchema,
	ZUCategorySchema,
	ZUFreeSeminarForm,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";
import type { Prisma } from "@/generated/client";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import emailService from "@/infrastructure/email/email";
import minioService from "@/infrastructure/storage/minio";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
import { toPublicUrl } from "@/utils/storageUrl";
import {
	buildFiltersWithSearch,
	parseQuerySearch,
} from "@/utils/typeSafeFilters";
import config from "../../config";

export class NewsLetterController {
	create = asyncHandler(async (req, res) => {
		const data = ZNewsletterSubscription.parse(req.body);

		const existing = await prisma.newsLetter.findUnique({
			where: { email: data.email },
		});

		const newsLetter = await prisma.newsLetter.upsert({
			where: { email: data.email },
			update: data,
			create: data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: existing ? AuditAction.UPDATE : AuditAction.CREATE,
			module: "NewsLetter",
			entityId: newsLetter.id,
			description: existing
				? `Newsletter subscription updated: ${data.email}`
				: `Newsletter subscription created: ${data.email}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("newsletters:*");

		return res.status(existing ? 200 : 201).json({
			success: true,
			data: newsLetter,
			message: existing
				? "Newsletter updated successfully"
				: "Newsletter submitted successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const skip = (page - 1) * limit;

		const cacheKey = `newsletters:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:userId=${currentUser.id}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Newsletters fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = {
			[sortBy]: orderBy,
		};

		const [newsLetters, total] = await Promise.all([
			prisma.newsLetter.findMany({
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.newsLetter.count(),
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
			JSON.stringify({ data: newsLetters, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: newsLetters,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const newsLetter = await prisma.newsLetter.findUnique({ where: { id } });
		if (!newsLetter) throw AppError.notFound("Newsletter not found");

		return res.status(200).json({
			success: true,
			data: newsLetter,
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const newsLetter = await prisma.newsLetter.findUnique({ where: { id } });
		if (!newsLetter) throw AppError.notFound("Newsletter not found");

		await prisma.newsLetter.delete({ where: { id } });

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "NewsLetter",
			entityId: id,
			description: `Newsletter subscription deleted: ${newsLetter.email}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("newsletters:*");

		return res.status(200).json({
			success: true,
			message: "Newsletter deleted successfully",
		});
	});
}

export class TrustedCompaniesController {
	create = asyncHandler(async (req, res) => {
		const data = ZCTrustedCompanies.parse(req.body);
		const logoFile = req.file; // Multer uploaded file

		// Check if company already exists
		const existing = await prisma.trustedCompanies.findUnique({
			where: { name: data.name },
		});

		if (existing) throw AppError.badRequest("Trusted Company already exists");

		let logoUrl: string | undefined;

		// Upload logo to MinIO if file is provided
		if (logoFile) {
			const logoKey = `trusted-companies/${generateFileName(
				logoFile.originalname,
				"logo_",
			)}`;

			await minioService.uploadFile(
				logoKey,
				logoFile.buffer,
				logoFile.mimetype,
				{
					originalName: logoFile.originalname,
					uploadedAt: new Date().toISOString(),
				},
			);

			// Save only the path (not full URL)
			logoUrl = logoKey;
		}

		// Create trusted company with logo URL
		const trusted = await prisma.trustedCompanies.create({
			data: {
				...data,
				logo: logoUrl || data.logo || "", // Use uploaded logo, provided URL, or empty string
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "TrustedCompanies",
			entityId: trusted.id,
			description: `Trusted company created: ${data.name}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("trustedCompanies:*");

		return res.status(201).json({
			success: true,
			data: trusted,
			message: "Trusted Company submitted successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const skip = (page - 1) * limit;

		const cacheKey = `trustedCompanies:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:userId=${currentUser.id}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Trusted Companies fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [trustedCompanies, total] = await Promise.all([
			prisma.trustedCompanies.findMany({
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.trustedCompanies.count(),
		]);

		// Transform logo paths to full URLs
		const companiesWithFullUrls = trustedCompanies.map((company) => ({
			...company,
			logo: `${config.storage_url.public_url}/${company.logo}`,
		}));

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
			JSON.stringify({ data: companiesWithFullUrls, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: companiesWithFullUrls,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const trustedCompany = await prisma.trustedCompanies.findUnique({
			where: { id },
		});
		if (!trustedCompany) throw AppError.notFound("Trusted Company not found");

		// Transform logo path to full URL
		const companyWithFullUrl = {
			...trustedCompany,
			logo: `${config.storage_url.public_url}/${trustedCompany.logo}`,
		};

		return res.status(200).json({
			success: true,
			data: companyWithFullUrl,
		});
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const data = ZCTrustedCompanies.parse(req.body);
		const logoFile = req.file; // Multer uploaded file

		const duplicate = await prisma.trustedCompanies.findFirst({
			where: {
				name: data.name,
				NOT: { id: id },
			},
		});
		if (duplicate) throw AppError.badRequest("Trusted Company already exists");

		const existing = await prisma.trustedCompanies.findUnique({
			where: { id },
		});
		if (!existing) throw AppError.notFound("Trusted Company not found");

		let logoUrl: string | undefined;

		// Upload new logo to MinIO if file is provided
		if (logoFile) {
			const logoKey = `trusted-companies/${generateFileName(
				logoFile.originalname,
				"logo_",
			)}`;

			await minioService.uploadFile(
				logoKey,
				logoFile.buffer,
				logoFile.mimetype,
				{
					originalName: logoFile.originalname,
					uploadedAt: new Date().toLocaleDateString(),
				},
			);

			// Save only the path (not full URL)
			logoUrl = logoKey;

			// Delete old logo from MinIO if it exists
			if (existing.logo) {
				try {
					const oldLogoKey = existing.logo.split("/").slice(-2).join("/"); // Extract key from URL
					await minioService.deleteFile(oldLogoKey);
				} catch (error) {
					// Log error but don't fail the update
					console.error("Failed to delete old logo:", error);
				}
			}
		}

		const trustedCompany = await prisma.trustedCompanies.update({
			where: { id },
			data: {
				...data,
				logo: logoUrl || data.logo || existing.logo, // Use new upload, provided URL, or keep existing
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "TrustedCompanies",
			entityId: id,
			description: `Trusted company updated: ${data.name}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("trustedCompanies:*");

		return res.status(200).json({
			success: true,
			data: trustedCompany,
			message: "Trusted Company updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const trustedCompany = await prisma.trustedCompanies.findUnique({
			where: { id },
		});
		if (!trustedCompany) throw AppError.notFound("Trusted Company not found");

		await prisma.trustedCompanies.delete({ where: { id } });

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "TrustedCompanies",
			entityId: id,
			description: `Trusted company deleted: ${trustedCompany.name}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("trustedCompanies:*");

		return res.status(200).json({
			success: true,
			message: "Trusted Company deleted successfully",
		});
	});
}

export class FreeSeminarController {
	create = asyncHandler(async (req, res) => {
		const data = ZCFreeSeminarForm.parse(req.body);
		const imageFile = req.file; // Multer uploaded file

		let imageUrl: string | undefined;

		// Upload image to MinIO if file is provided
		if (imageFile) {
			const imageKey = `free-seminars/${generateFileName(
				imageFile.originalname,
				"seminar_",
			)}`;

			await minioService.uploadFile(
				imageKey,
				imageFile.buffer,
				imageFile.mimetype,
				{
					originalName: imageFile.originalname,
					uploadedAt: new Date().toISOString(),
				},
			);
			imageUrl = imageKey;
		}

		const freeSeminar = await prisma.freeSeminar.create({
			data: {
				image: imageUrl || data.image || "",
				title: data.title,
				description: data.description,
				startDate: data.startDate,
				startTime: data.startTime,
				endTime: data.endTime || data.startTime,
				capacity: data.capacity,
				isActive: data.isActive,
				...(data.endDate !== undefined && { endDate: data.endDate }),
			},
			include: {
				_count: { select: { enrollments: true } },
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "FreeSeminar",
			entityId: freeSeminar.id,
			description: `Free seminar created: ${data.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("freeSeminar:*");

		return res.status(201).json({
			success: true,
			data: {
				...freeSeminar,
				image: `${config.storage_url.public_url}/${freeSeminar.image}`,
			},
			message: "Free Seminar submitted successfully",
		});
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const data = ZUFreeSeminarForm.parse(req.body);
		const imageFile = req.file; // Multer uploaded file

		const existing = await prisma.freeSeminar.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Free Seminar not found");

		let imageUrl: string | undefined;

		// Upload new image to MinIO if file is provided
		if (imageFile) {
			const imageKey = `free-seminars/${generateFileName(
				imageFile.originalname,
				"seminar_",
			)}`;

			await minioService.uploadFile(
				imageKey,
				imageFile.buffer,
				imageFile.mimetype,
				{
					originalName: imageFile.originalname,
					uploadedAt: new Date().toISOString(),
				},
			);

			imageUrl = imageKey;

			// Delete old image from MinIO
			if (existing.image) {
				try {
					await minioService.deleteFile(existing.image);
				} catch (error) {
					console.error("Failed to delete old seminar image:", error);
				}
			}
		}

		if (imageUrl?.startsWith("http")) {
			const publicUrl = config.storage_url.public_url;
			imageUrl = imageUrl.replace(`${publicUrl}/`, "");
		} else {
			imageUrl = imageUrl || existing.image;
		}

		const freeSeminar = await prisma.freeSeminar.update({
			where: { id },
			data: {
				...data,
				image: imageUrl || data.image || existing.image,
			},
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "FreeSeminar",
			entityId: freeSeminar.id,
			description: `Free seminar updated: ${data.title || existing.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("freeSeminar:*");

		return res.status(200).json({
			success: true,
			data: {
				...freeSeminar,
				image: `${config.storage_url.public_url}/${freeSeminar.image}`,
			},
			message: "Free Seminar updated successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const skip = (page - 1) * limit;
		const cacheKey = `freeSeminar:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:userId=${currentUser.id}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Free Seminars fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [seminars, total] = await Promise.all([
			prisma.freeSeminar.findMany({
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.freeSeminar.count(),
		]);

		// Transform image paths to full URLs
		const seminarsWithFullUrls = seminars.map((seminar) => ({
			...seminar,
			image: `${config.storage_url.public_url}/${seminar.image}`,
		}));

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
			JSON.stringify({ data: seminarsWithFullUrls, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: seminarsWithFullUrls,
			pagination,
		});
	});

	getAllActive = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;
		const cacheKey = `freeSeminar:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:active=true`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Free Seminars fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [seminars, total] = await Promise.all([
			prisma.freeSeminar.findMany({
				where: { isActive: true },
				include: {
					_count: {
						select: { enrollments: true },
					},
				},
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.freeSeminar.count(),
		]);

		// Transform image paths to full URLs
		const seminarsWithFullUrls = seminars.map((seminar) => ({
			...seminar,
			image: `${config.storage_url.public_url}/${seminar.image}`,
		}));

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
			JSON.stringify({ data: seminarsWithFullUrls, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: seminarsWithFullUrls,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const seminar = await prisma.freeSeminar.findUnique({
			where: { id },
			include: {
				enrollments: true,
				_count: { select: { enrollments: true } },
			},
		});
		if (!seminar) throw AppError.notFound("Free Seminar not found");

		return res.status(200).json({
			success: true,
			data: {
				...seminar,
				image: `${config.storage_url.public_url}/${seminar.image}`,
			},
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const seminar = await prisma.freeSeminar.findUnique({ where: { id } });
		if (!seminar) throw AppError.notFound("Free Seminar not found");

		// Delete image from MinIO
		if (seminar.image) {
			try {
				await minioService.deleteFile(seminar.image);
			} catch (error) {
				console.error("Failed to delete seminar image:", error);
			}
		}

		await prisma.freeSeminar.delete({ where: { id } });

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "FreeSeminar",
			entityId: id,
			description: `Free seminar deleted: ${seminar.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("freeSeminar:*");

		return res.status(200).json({
			success: true,
			message: "Free Seminar deleted successfully",
		});
	});
}

export class FreeSeminarEnrollmentController {
	create = asyncHandler(async (req, res) => {
		const data = ZCFreeSeminarEnrollmentForm.parse(req.body);

		// unique email check for the same seminar
		const existingEnrollment = await prisma.freeSeminarEnrollments.findFirst({
			where: {
				email: data.email,
				seminarId: data.seminarId,
			},
		});

		if (existingEnrollment) {
			throw AppError.badRequest(
				"You have already enrolled for this seminar with this email.",
			);
		}

		const freeSeminar = await prisma.freeSeminarEnrollments.create({
			data: data,
		});

		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "FreeSeminarEnrollment",
			entityId: freeSeminar.id,
			description: `Free seminar enrollment created: ${data.seminarId}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("freeSeminar:*");

		// Fetch the seminar details to send a confirmation email
		const seminar = await prisma.freeSeminar.findUnique({
			where: { id: data.seminarId },
			select: {
				title: true,
				startDate: true,
				endDate: true,
				startTime: true,
				endTime: true,
			},
		});

		if (seminar) {
			// Convert DateTime to HH:MM string format
			const formatTimeFromDate = (date: Date) =>
				`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

			emailService
				.sendSeminarEnrollmentEmail({
					to: data.email,
					studentName: `${data.firstName} ${data.lastName}`,
					seminarTitle: seminar.title ?? "the seminar",
					seminarStartDate: seminar.startDate,
					seminarEndDate: seminar.endDate ?? null,
					seminarStartTime: formatTimeFromDate(seminar.startTime),
					seminarEndTime: seminar.endTime
						? formatTimeFromDate(seminar.endTime)
						: null,
				})
				.catch((err) => {
					console.error("Failed to send seminar enrollment email:", err);
				});
		}

		return res.status(201).json({
			success: true,
			data: freeSeminar,
			message: "Free Seminar Enrollment submitted successfully",
		});
	});
}

export class ContactUsController {
	create = asyncHandler(async (req, res) => {
		const data = ZCContactUsSchema.parse(req.body);

		const contact = await prisma.contactUs.create({
			data: data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "ContactUs",
			entityId: contact.id,
			description: `Contact form submitted: ${data.firstName} ${data.lastName} (${data.email})`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("contactUs:*");

		return res.status(201).json({
			success: true,
			data: contact,
			message: "Contact form submitted successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search } = ZQueryParams.parse(
			req.query,
		);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const skip = (page - 1) * limit;
		const cacheKey = `contactUs:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search}:userId=${currentUser.id}`;

		const cachedData = await cached.get(cacheKey);
		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Contact submissions fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		// Build search filter
		const whereClause = search
			? {
					OR: [
						{ email: { contains: search, mode: "insensitive" as const } },
						{ firstName: { contains: search, mode: "insensitive" as const } },
						{ lastName: { contains: search, mode: "insensitive" as const } },
					],
				}
			: {};

		const [contacts, total] = await Promise.all([
			prisma.contactUs.findMany({
				where: whereClause,
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.contactUs.count({ where: whereClause }),
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
			JSON.stringify({ data: contacts, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: contacts,
			pagination,
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const contact = await prisma.contactUs.findUnique({ where: { id } });
		if (!contact) throw AppError.notFound("Contact submission not found");

		await prisma.contactUs.delete({ where: { id } });

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "ContactUs",
			entityId: id,
			description: `Contact submission deleted: ${contact.firstName} ${contact.lastName}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("contact:*");

		return res.status(200).json({
			success: true,
			message: "Contact submission deleted successfully",
		});
	});
}

export class BlogCategoryController {
	create = asyncHandler(async (req, res) => {
		const data = ZCBlogCategorySchema.parse(req.body);

		const slug = data.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		const existing = await prisma.blogCategory.findFirst({
			where: {
				OR: [{ name: data.name }, { slug }],
			},
		});

		if (existing) {
			throw new AppError("Category with this name already exists", 400);
		}

		const category = await prisma.blogCategory.create({
			data: {
				...data,
				slug,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "BlogCategory",
			entityId: category.id,
			description: `Blog category created: ${data.name}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("blog-categories:*");

		return res.status(201).json({
			success: true,
			data: category,
			message: "Blog category created successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search } = ZQueryParams.parse(
			req.query,
		);

		const skip = (page - 1) * limit;
		const cacheKey = `blog-categories:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			return res.status(200).json({
				success: true,
				...JSON.parse(cachedData),
			});
		}

		const where = parseQuerySearch<Prisma.BlogCategoryWhereInput>(search, [
			"name",
			"slug",
		]);

		const orderClause: Prisma.BlogCategoryOrderByWithRelationInput = {
			[sortBy]: orderBy,
		};

		const [categories, total] = await Promise.all([
			prisma.blogCategory.findMany({
				where,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					_count: {
						select: { blogs: true },
					},
				},
			}),
			prisma.blogCategory.count(),
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
			JSON.stringify({ data: categories, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: categories,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const category = await prisma.blogCategory.findUnique({
			where: { id },
			include: {
				_count: {
					select: { blogs: true },
				},
			},
		});

		if (!category) {
			throw new AppError("Blog category not found", 404);
		}

		return res.status(200).json({
			success: true,
			data: category,
		});
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const data = ZUBlogCategorySchema.parse(req.body);

		const existing = await prisma.blogCategory.findUnique({ where: { id } });
		if (!existing) {
			throw new AppError("Blog category not found", 404);
		}

		let slug = existing.slug;
		if (data.name && data.name !== existing.name) {
			slug = data.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");

			const duplicate = await prisma.blogCategory.findFirst({
				where: {
					slug,
					NOT: { id },
				},
			});

			if (duplicate) {
				throw new AppError("Category with this name already exists", 400);
			}
		}

		const updated = await prisma.blogCategory.update({
			where: { id },
			data: {
				...data,
				slug,
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "BlogCategory",
			entityId: id,
			description: `Blog category updated: ${data.name || existing.name}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("blog-categories:*");

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Blog category updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const category = await prisma.blogCategory.findUnique({
			where: { id },
			include: {
				_count: {
					select: { blogs: true },
				},
			},
		});

		if (!category) {
			throw new AppError("Blog category not found", 404);
		}

		if (category._count.blogs > 0) {
			throw new AppError(
				"Cannot delete category with existing blogs. Please reassign or delete blogs first.",
				400,
			);
		}

		await prisma.blogCategory.delete({ where: { id } });

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "BlogCategory",
			entityId: id,
			description: `Blog category deleted: ${category.name}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("blog-categories:*");

		return res.status(200).json({
			success: true,
			message: "Blog category deleted successfully",
		});
	});
}

export class BlogController {
	create = asyncHandler(async (req, res) => {
		const currentUser = req.user as UserWithRoleAndPermissions;
		const data = ZCBlogSchema.parse(req.body);
		const imageFile = req.file;

		if (!imageFile) {
			throw AppError.badRequest("Blog image is required");
		}

		const baseSlug = data.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		let slug = baseSlug;
		let counter = 1;
		while (await prisma.blog.findUnique({ where: { slug } })) {
			slug = `${baseSlug}-${counter}`;
			counter++;
		}

		let imageUrl: string | undefined;

		if (imageFile) {
			const imageKey = `blogs/${generateFileName(
				imageFile.originalname,
				"blog_",
			)}`;

			await minioService.uploadFile(
				imageKey,
				imageFile.buffer,
				imageFile.mimetype,
				{
					originalName: imageFile.originalname,
					uploadedAt: new Date().toLocaleDateString(),
				},
			);
			imageUrl = imageKey;
		}

		const blog = await prisma.blog.create({
			data: {
				...data,
				slug,
				image: imageUrl || "",
				authorId: currentUser.id,
				publishedAt: data.status === "PUBLISHED" ? new Date() : null,
			},
			include: {
				category: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Blog",
			entityId: blog.id,
			description: `Blog created: ${data.title}`,
			performedById: currentUser.id,
		});

		await invalidateCachePattern("blogs:*");

		return res.status(201).json({
			success: true,
			data: {
				...blog,
				image: process.env.STORAGE_PUBLIC_URL
					? `${process.env.STORAGE_PUBLIC_URL}/${blog.image}`
					: blog.image,
			},
			message: "Blog created successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		console.log("Filters:", filters, page, limit, sortBy, orderBy, search);

		const skip = (page - 1) * limit;

		const cacheKey = `blogs:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}:filters=${JSON.stringify(filters || {})}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			return res.status(200).json({
				success: true,
				...JSON.parse(cachedData),
			});
		}

		// Preprocess publishedAt filter for year-month filtering
		const processedFilters = { ...filters };
		if (
			processedFilters?.publishedAt &&
			typeof processedFilters.publishedAt === "string"
		) {
			const yearMonthMatch =
				processedFilters.publishedAt.match(/^(\d{4})-(\d{2})$/);
			if (yearMonthMatch) {
				const [, year, month] = yearMonthMatch;
				const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
				const endDate = new Date(startDate);
				endDate.setMonth(endDate.getMonth() + 1);

				processedFilters.publishedAt = {
					gte: startDate,
					lt: endDate,
				} as any;
			}
		}

		const ALLOWED_FILTERS: Array<keyof Prisma.BlogWhereInput> = [
			"categoryId",
			"publishedAt",
			"status",
		];
		const where = buildFiltersWithSearch<Prisma.BlogWhereInput>(
			processedFilters,
			ALLOWED_FILTERS,
			search,
			["title", "description"],
		);

		const orderClause: Prisma.BlogOrderByWithRelationInput = {
			[sortBy]: orderBy,
		};

		const [blogs, total] = await Promise.all([
			prisma.blog.findMany({
				where,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					category: true,
					author: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					_count: {
						select: { comments: true },
					},
				},
			}),
			prisma.blog.count({ where }),
		]);

		const blogsWithFullUrls = blogs.map((blog) => ({
			...blog,
			image: `${config.storage_url.public_url}/${blog.image}`,
		}));

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
			JSON.stringify({ data: blogsWithFullUrls, pagination }),
			30, // 30 seconds cache
		);

		return res.status(200).json({
			success: true,
			data: blogsWithFullUrls,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const blog = await prisma.blog.findUnique({
			where: { id },
			include: {
				category: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				comments: {
					where: {
						isPublished: true,
						parentId: null,
					},
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						replies: {
							include: {
								user: {
									select: {
										id: true,
										name: true,
										email: true,
									},
								},
							},
						},
					},
					orderBy: { createdAt: "desc" },
				},
			},
		});

		if (!blog) {
			throw new AppError("Blog not found", 404);
		}

		return res.status(200).json({
			success: true,
			data: {
				...blog,
				image: `${config.storage_url.public_url}/${blog.image}`,
			},
		});
	});

	getBySlug = asyncHandler(async (req, res) => {
		const { slug } = req.params;

		const blog = await prisma.blog.findUnique({
			where: { slug },
			include: {
				category: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				comments: {
					where: {
						isPublished: true,
						parentId: null,
					},
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						replies: {
							include: {
								user: {
									select: {
										id: true,
										name: true,
										email: true,
									},
								},
							},
						},
					},
					orderBy: { createdAt: "desc" },
				},
			},
		});

		if (!blog) {
			throw new AppError("Blog not found", 404);
		}

		return res.status(200).json({
			success: true,
			data: {
				...blog,
				image: `${config.storage_url.public_url}/${blog.image}`,
			},
		});
	});

	getRelated = asyncHandler(async (req, res) => {
		const { slug } = req.params;
		const { limit = 6 } = req.query;

		const blog = await prisma.blog.findUnique({
			where: { slug },
			//   select: { categoryId: true, tags: true },
		});

		if (!blog) return res.status(404).json({ error: "Blog not found" });

		const related = await prisma.blog.findMany({
			where: {
				id: { not: slug },
				categoryId: blog.categoryId,
				status: "PUBLISHED",
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			take: Number(limit),
		});

		const blogsWithFullUrls = related.map((blog) => ({
			...blog,
			image: `${config.storage_url.public_url}/${blog.image}`,
		}));

		return res.status(200).json({ success: true, data: blogsWithFullUrls });
	});

	getFilterValues = asyncHandler(async (_req, res) => {
		const blogs = await prisma.blog.findMany({
			where: {
				publishedAt: { not: null },
			},
			select: {
				tags: true,
				publishedAt: true,
				category: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		const categories = [
			...new Map(
				blogs
					.map((b) => b.category)
					.filter((cat): cat is { id: string; name: string } => cat !== null)
					.map((cat) => [cat.id, cat]),
			).values(),
		];

		const tags = Array.from(new Set(blogs.flatMap((b) => b.tags ?? []))).sort();

		const months = Array.from(
			new Set(
				blogs
					.filter((b) => b.publishedAt)
					.map((b) => {
						const d = b.publishedAt!;
						return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
							2,
							"0",
						)}`;
					}),
			),
		).sort((a, b) => b.localeCompare(a));

		return res.status(200).json({
			success: true,
			data: {
				categories,
				tags,
				months,
			},
		});
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const data = ZUBlogSchema.parse(req.body);
		const imageFile = req.file;

		const existing = await prisma.blog.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Blog not found");

		let imageUrl: string | undefined;

		if (imageFile) {
			const imageKey = `blogs/${generateFileName(
				imageFile.originalname,
				"blog_",
			)}`;

			await minioService.uploadFile(
				imageKey,
				imageFile.buffer,
				imageFile.mimetype,
				{
					originalName: imageFile.originalname,
					uploadedAt: new Date().toISOString(),
				},
			);

			imageUrl = imageKey;

			if (existing.image) {
				try {
					const oldImageKey = existing.image.split("/").slice(-2).join("/");
					await minioService.deleteFile(oldImageKey);
				} catch (error) {
					console.error("Failed to delete old image:", error);
				}
			}
		}

		let slug = existing.slug;
		if (data.title && data.title !== existing.title) {
			const baseSlug = data.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");

			slug = baseSlug;
			let counter = 1;
			while (
				await prisma.blog.findFirst({
					where: { slug, NOT: { id } },
				})
			) {
				slug = `${baseSlug}-${counter}`;
				counter++;
			}
		}

		let publishedAt = existing.publishedAt;
		if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
			publishedAt = new Date();
		}

		const updated = await prisma.blog.update({
			where: { id },
			data: {
				...data,
				slug,
				image: imageUrl || existing.image,
				publishedAt,
			},
			include: {
				category: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		// Audit log
		const statusChanged = data.status && data.status !== existing.status;
		await createAuditLogFromRequest(req, {
			action:
				statusChanged && data.status === "PUBLISHED"
					? AuditAction.PUBLISH
					: statusChanged && data.status === "DRAFT"
						? AuditAction.UNPUBLISH
						: AuditAction.UPDATE,
			module: "Blog",
			entityId: id,
			description: `Blog ${statusChanged ? (data.status === "PUBLISHED" ? "published" : "unpublished") : "updated"}: ${data.title || existing.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("blogs:*");

		return res.status(200).json({
			success: true,
			data: {
				...updated,
				image: toPublicUrl(updated.image) || updated.image,
			},
			message: "Blog updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const blog = await prisma.blog.findUnique({ where: { id } });
		if (!blog) {
			throw new AppError("Blog not found", 404);
		}

		if (blog.image) {
			try {
				await minioService.deleteFile(process.env.MINIO_BUCKET_NAME as string);
			} catch (error) {
				console.error("Failed to delete blog image:", error);
			}
		}

		await prisma.blog.delete({ where: { id } });

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "Blog",
			entityId: id,
			description: `Blog deleted: ${blog.title}`,
			performedById: req.user?.id,
		});

		await invalidateCachePattern("blogs:*");

		return res.status(200).json({
			success: true,
			message: "Blog deleted successfully",
		});
	});
}

export class BlogCommentController {
	create = asyncHandler(async (req, res) => {
		const currentUser = req.user as UserWithRoleAndPermissions;
		const data = ZCBlogCommentSchema.parse(req.body);

		// Verify blog exists
		const blog = await prisma.blog.findUnique({
			where: { id: data.blogId },
		});

		if (!blog) {
			throw AppError.notFound("Blog not found");
		}

		// Verify parent comment exists if parentId is provided
		if (data.parentId) {
			const parentComment = await prisma.blogComment.findUnique({
				where: { id: data.parentId },
			});

			if (!parentComment) {
				throw AppError.notFound("Parent comment not found");
			}

			// Ensure parent belongs to the same blog
			if (parentComment.blogId !== data.blogId) {
				throw AppError.badRequest(
					"Parent comment does not belong to this blog",
				);
			}
		}

		const comment = await prisma.blogComment.create({
			data: {
				...data,
				userId: currentUser.id,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "BlogComment",
			entityId: comment.id,
			description: data.parentId
				? `Blog comment reply created on blog ${data.blogId}`
				: `Blog comment created on blog ${data.blogId}`,
			performedById: currentUser.id,
		});

		await invalidateCachePattern("blog-comments:*");
		await invalidateCachePattern("blogs:*");

		return res.status(201).json({
			success: true,
			data: comment,
			message: "Comment created successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;
		const cacheKey = `blog-comments:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}:filters=${JSON.stringify(filters) || ""}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Comments fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS: Array<keyof Prisma.BlogCommentWhereInput> = [
			"blogId",
			"userId",
			"isPublished",
		];
		const where = buildFiltersWithSearch<Prisma.BlogCommentWhereInput>(
			filters,
			ALLOWED_FILTERS,
			search,
			["content"],
		);

		const orderClause: Prisma.BlogCommentOrderByWithRelationInput = {
			[sortBy]: orderBy,
		};

		const [comments, total] = await Promise.all([
			prisma.blogComment.findMany({
				where,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					blog: {
						select: {
							id: true,
							title: true,
							slug: true,
						},
					},
					_count: {
						select: { replies: true },
					},
				},
			}),
			prisma.blogComment.count({ where }),
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
			JSON.stringify({ data: comments, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: comments,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const comment = await prisma.blogComment.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				blog: {
					select: {
						id: true,
						title: true,
						slug: true,
					},
				},
				replies: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
					},
					orderBy: { createdAt: "desc" },
				},
			},
		});

		if (!comment) {
			throw AppError.notFound("Comment not found");
		}

		return res.status(200).json({
			success: true,
			data: comment,
		});
	});

	getByBlogId = asyncHandler(async (req, res) => {
		const { blogId } = req.params;
		const { page = 1, limit = 20 } = req.query;

		const skip = (Number(page) - 1) * Number(limit);

		const [comments, total] = await Promise.all([
			prisma.blogComment.findMany({
				where: {
					blogId,
					parentId: null, // Only top-level comments
					isPublished: true,
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: Number(limit),
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					replies: {
						where: { isPublished: true },
						include: {
							user: {
								select: {
									id: true,
									name: true,
									email: true,
								},
							},
						},
						orderBy: { createdAt: "asc" },
					},
				},
			}),
			prisma.blogComment.count({
				where: {
					blogId,
					parentId: null,
					isPublished: true,
				},
			}),
		]);

		const totalPages = Math.ceil(total / Number(limit));

		const pagination = {
			total,
			page: Number(page),
			limit: Number(limit),
			totalPages,
			hasNext: Number(page) < totalPages,
			hasPrev: Number(page) > 1,
		};

		return res.status(200).json({
			success: true,
			data: comments,
			pagination,
		});
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const currentUser = req.user as UserWithRoleAndPermissions;
		const data = ZUBlogCommentSchema.parse(req.body);

		const existing = await prisma.blogComment.findUnique({ where: { id } });
		if (!existing) {
			throw AppError.notFound("Comment not found");
		}

		// Only allow the comment author or admin to update
		if (
			existing.userId !== currentUser.id &&
			!currentUser.role?.name.includes("ADMIN")
		) {
			throw AppError.forbidden("You can only update your own comments");
		}

		const updated = await prisma.blogComment.update({
			where: { id },
			data,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "BlogComment",
			entityId: id,
			description: "Blog comment updated",
			performedById: currentUser.id,
		});

		await invalidateCachePattern("blog-comments:*");
		await invalidateCachePattern("blogs:*");

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Comment updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const comment = await prisma.blogComment.findUnique({
			where: { id },
			include: {
				_count: {
					select: { replies: true },
				},
			},
		});

		if (!comment) {
			throw AppError.notFound("Comment not found");
		}

		// Only allow the comment author or admin to delete
		if (
			comment.userId !== currentUser.id &&
			!currentUser.role?.name.includes("ADMIN")
		) {
			throw AppError.forbidden("You can only delete your own comments");
		}

		// Delete comment and all replies (cascade)
		await prisma.blogComment.delete({ where: { id } });

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "BlogComment",
			entityId: id,
			description: `Blog comment deleted (with ${comment._count.replies} replies)`,
			performedById: currentUser.id,
		});

		await invalidateCachePattern("blog-comments:*");
		await invalidateCachePattern("blogs:*");

		return res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
		});
	});
}

export class CategoryController {
	create = asyncHandler(async (req, res) => {
		const currentUser = req.user as UserWithRoleAndPermissions;
		const data = ZCCategorySchema.parse(req.body);

		const categoryIns = await prisma.category.findUnique({
			where: { id: data.name },
		});

		if (categoryIns) {
			throw AppError.conflict("A category with this name already exists");
		}

		const category = await prisma.category.create({
			data: data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "Category",
			entityId: category.id,
			description: `Category created: ${data.name}`,
			performedById: currentUser.id,
		});

		await invalidateCachePattern("categories:*");

		return res.status(201).json({
			success: true,
			data: category,
			message: "Category created successfully",
		});
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const currentUser = req.user as UserWithRoleAndPermissions;
		const data = ZUCategorySchema.parse(req.body);

		const existing = await prisma.category.findUnique({ where: { id } });
		if (existing) {
			throw AppError.conflict("A category with this name already exists");
		}

		const updated = await prisma.category.update({
			where: { id },
			data,
		});

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.UPDATE,
			module: "Category",
			entityId: id,
			description: `Category updated: ${data.name}`,
			performedById: currentUser.id,
		});
		await invalidateCachePattern("categories:*");

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Category updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const category = await prisma.category.findUnique({
			where: { id },
		});

		if (!category) {
			throw AppError.notFound("Category not found");
		}

		await prisma.category.delete({ where: { id } });

		await createAuditLogFromRequest(req, {
			action: AuditAction.DELETE,
			module: "Category",
			entityId: id,
			description: `Category deleted: ${category.name}`,
			performedById: currentUser.id,
		});

		await invalidateCachePattern("categories:*");

		return res.status(200).json({
			success: true,
			message: "Category deleted successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;
		const cacheKey = `categories:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}:filters=${JSON.stringify(filters) || ""}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Categories fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS: Array<keyof Prisma.CategoryWhereInput> = ["name"];
		const where = buildFiltersWithSearch<Prisma.CategoryWhereInput>(
			filters,
			ALLOWED_FILTERS,
			search,
			["name"],
		);

		const orderClause: Prisma.CategoryOrderByWithRelationInput = {
			[sortBy]: orderBy,
		};

		const [categories, total] = await Promise.all([
			prisma.category.findMany({
				where,
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.category.count({ where }),
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
			JSON.stringify({ data: categories, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: categories,
			pagination,
		});
	});

	getAllActive = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);

		const skip = (page - 1) * limit;
		const cacheKey = `categories:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${
			search || ""
		}:filters=${JSON.stringify(filters) || ""}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Categories fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS: Array<keyof Prisma.CategoryWhereInput> = ["name"];
		const where = buildFiltersWithSearch<Prisma.CategoryWhereInput>(
			filters,
			ALLOWED_FILTERS,
			search,
			["name"],
		);

		const orderClause: Prisma.CategoryOrderByWithRelationInput = {
			[sortBy]: orderBy,
		};

		const [categories, total] = await Promise.all([
			prisma.category.findMany({
				where,
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.category.count({ where }),
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
			JSON.stringify({ data: categories, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: categories,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const category = await prisma.category.findUnique({
			where: { id },
		});

		if (!category) {
			throw AppError.notFound("Category not found");
		}

		return res.status(200).json({
			success: true,
			data: category,
		});
	});
}
