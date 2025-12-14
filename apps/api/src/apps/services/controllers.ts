import {
	ZCFreeSeminarForm,
	ZCollegeAdmissionsGuidanceForm,
	ZCTrustedCompanies,
	ZCuid,
	ZNewsletterSubscription,
	ZQueryParams,
} from "@prepexcellence/shared-validators";

import type { Request, Response } from "express";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
import { toPublicUrl } from "@/utils/storageUrl";

export class GuidanceController {
	create = asyncHandler(async (req, res) => {
		const data = ZCollegeAdmissionsGuidanceForm.parse(req.body);

		const guidance = await prisma.guidance.upsert({
			where: { email: data.email },
			update: data,
			create: data,
		});

		return res.status(201).json({
			success: true,
			data: guidance,
			message: "Guidance created successfully",
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
		const currentUser = req.user as UserWithRoleAndPermissions;

		const skip = (page - 1) * limit;

		const cacheKey = `users:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:userId=${currentUser.id}`;

		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Users fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [users, total] = await Promise.all([
			prisma.guidance.findMany({
				orderBy: orderClause,
				skip,
				take: limit,
			}),
			prisma.guidance.count(),
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

		await cached.set(cacheKey, JSON.stringify({ data: users, pagination }), 60);

		return res.status(200).json({
			success: true,
			data: users,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const guidance = await prisma.guidance.findUnique({ where: { id } });
		if (!guidance) throw AppError.notFound("Guidance not found");

		return res.status(200).json({ success: true, data: guidance });
	});

	update = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);
		const data = ZCollegeAdmissionsGuidanceForm.parse(req.body);

		const existing = await prisma.guidance.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Guidance not found");

		const updated = await prisma.guidance.update({
			where: { id },
			data,
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Guidance updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const guidance = await prisma.guidance.findUnique({ where: { id } });
		if (!guidance) throw AppError.notFound("Guidance not found");

		await prisma.guidance.delete({ where: { id } });

		return res.status(200).json({
			success: true,
			message: "Guidance deleted successfully",
		});
	});
}

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
			const logoKey = `trusted-companies/${generateFileName(logoFile.originalname, "logo_")}`;

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
			logo: toPublicUrl(company.logo) || company.logo,
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
			logo: toPublicUrl(trustedCompany.logo) || trustedCompany.logo,
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
			const logoKey = `trusted-companies/${generateFileName(logoFile.originalname, "logo_")}`;

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

		return res.status(200).json({
			success: true,
			message: "Trusted Company deleted successfully",
		});
	});
}

export class FreeSeminarController {
	create = asyncHandler(async (req, res) => {
		const data = ZCFreeSeminarForm.parse(req.body);

		const existing = await prisma.freeSeminar.findUnique({
			where: { studentEmail: data.studentEmail },
		});

		const seminar = await prisma.freeSeminar.upsert({
			where: { studentEmail: data.studentEmail },
			update: data,
			create: data,
		});

		return res.status(existing ? 200 : 201).json({
			success: true,
			data: seminar,
			message: existing
				? "Free Seminar updated successfully"
				: "Free Seminar submitted successfully",
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
			JSON.stringify({ data: seminars, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: seminars,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const seminar = await prisma.freeSeminar.findUnique({ where: { id } });
		if (!seminar) throw AppError.notFound("Free Seminar not found");

		return res.status(200).json({
			success: true,
			data: seminar,
		});
	});

	delete = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const seminar = await prisma.freeSeminar.findUnique({ where: { id } });
		if (!seminar) throw AppError.notFound("Free Seminar not found");

		await prisma.freeSeminar.delete({ where: { id } });

		return res.status(200).json({
			success: true,
			message: "Free Seminar deleted successfully",
		});
	});
}
