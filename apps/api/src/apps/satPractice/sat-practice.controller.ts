import {
	ZCuid,
	ZModule,
	ZModuleUpdate,
	ZQueryParams,
	ZQuestionBank,
	ZQuestionBankUpdate,
	ZSATPracticeFilters,
	ZSATPracticeUpdate,
	ZSection,
	ZSectionUpdate,
} from "@prepexcellence/shared-validators";
import type { Prisma } from "@/generated/client";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildFiltersWithSearch } from "@/utils/typeSafeFilters";

// ==================== QUESTION BANK CONTROLLER ====================
export class QuestionBankController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `questionBank:*`;
		invalidateCachePattern(cacheKey);

		const data = ZQuestionBank.parse(req.body);
		const { options, ...questionData } = data;

		// Create question with options in a transaction
		const questionBank = await prisma.$transaction(async (tx) => {
			const question = await tx.questionBank.create({
				data: {
					...questionData,
					options: {
						create: options.map((opt, idx) => ({
							...opt,
							orderIndex: opt.orderIndex ?? idx,
						})),
					},
				},
				include: {
					options: { orderBy: { orderIndex: "asc" } },
					testType: true,
					subject: true,
					difficulty: true,
					domain: true,
					skill: true,
				},
			});

			return question;
		});

		return res.status(201).json({
			success: true,
			data: questionBank,
			message: "Question created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy, search, filters } =
			ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;

		const cacheKey = `questionBank:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;
		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "Questions fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const ALLOWED_FILTERS: Array<keyof Prisma.QuestionBankWhereInput> = [
			"testTypeId",
			"subjectId",
			"difficultyId",
			"domainId",
			"skillId",
			"optionType",
		];
		const where = buildFiltersWithSearch<Prisma.QuestionBankWhereInput>(
			filters,
			ALLOWED_FILTERS,
			search,
			["content"],
		);

		if (filters?.isUsed !== undefined) {
			if (filters.isUsed === "false") {
				where.AND = [
					{ moduleQuestionsSetOne: { none: {} } },
					{ moduleQuestionsSetTwo: { none: {} } },
				];
			}
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [questions, total] = await Promise.all([
			prisma.questionBank.findMany({
				where,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					options: { orderBy: { orderIndex: "asc" } },
					testType: true,
					subject: true,
					difficulty: true,
					domain: true,
					skill: true,
				},
			}),
			prisma.questionBank.count({ where }),
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
			JSON.stringify({ data: questions, pagination }),
			60,
		);

		return res.status(200).json({
			success: true,
			data: questions,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const question = await prisma.questionBank.findUnique({
			where: { id },
			include: {
				options: { orderBy: { orderIndex: "asc" } },
				testType: true,
				subject: true,
				difficulty: true,
				domain: true,
				skill: true,
			},
		});

		if (!question) throw AppError.notFound("Question not found");

		return res.status(200).json({
			success: true,
			data: question,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `questionBank:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);
		const data = ZQuestionBankUpdate.parse(req.body);
		const { options, ...questionData } = data;

		const existing = await prisma.questionBank.findUnique({
			where: { id },
		});
		if (!existing) throw AppError.notFound("Question not found");

		const updated = await prisma.$transaction(async (tx) => {
			// Update question
			await tx.questionBank.update({
				where: { id },
				data: questionData,
			});

			// Update options if provided
			if (options) {
				// Delete existing options
				await tx.options.deleteMany({
					where: { questionBankId: id },
				});

				// Create new options
				await tx.options.createMany({
					data: options.map((opt, idx) => ({
						...opt,
						questionBankId: id,
						orderIndex: opt.orderIndex ?? idx,
					})),
				});
			}

			return tx.questionBank.findUnique({
				where: { id },
				include: {
					options: { orderBy: { orderIndex: "asc" } },
					testType: true,
					subject: true,
					difficulty: true,
					domain: true,
					skill: true,
				},
			});
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Question updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `questionBank:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);

		const existing = await prisma.questionBank.findUnique({
			where: { id },
		});
		if (!existing) throw AppError.notFound("Question not found");

		await prisma.questionBank.delete({
			where: { id },
		});

		return res.status(200).json({
			success: true,
			message: "Question deleted successfully",
		});
	});
}

// ==================== SAT PRACTICE TEST CONTROLLER ====================
export class SATPracticeController {
	upsert = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const data = ZSATPracticeUpdate.parse(req.body);
		const { id, sections, ...testData } = data;

		const satPractice = await prisma.$transaction(async (tx) => {
			const test = await tx.sATPractice.upsert({
				where: { id: id ?? "" },
				create: testData,
				update: testData,
			});

			if (sections && sections.length > 0) {
				const existingSections = await tx.section.findMany({
					where: { satPracticeId: test.id },
					include: { modules: true },
				});

				const existingSectionIds = existingSections.map((s) => s.id);
				const providedSectionIds = sections
					.filter((s) => s.id)
					.map((s) => s.id as string);

				// Delete sections not in the payload
				const sectionsToDelete = existingSectionIds.filter(
					(sId: string) => !providedSectionIds.includes(sId),
				);
				if (sectionsToDelete.length > 0) {
					await tx.section.deleteMany({
						where: { id: { in: sectionsToDelete } },
					});
				}

				// Upsert sections
				for (const sectionData of sections) {
					const {
						modules: modulesList,
						id: sectionId,
						...sectionFields
					} = sectionData;

					const section = await tx.section.upsert({
						where: { id: sectionId ?? "" },
						create: {
							...sectionFields,
							satPracticeId: test.id,
						},
						update: sectionFields,
					});

					// Handle modules if provided
					if (modulesList && modulesList.length > 0) {
						// Fetch existing modules
						const existingModules = await tx.module.findMany({
							where: { sectionId: section.id },
						});

						const existingModuleIds = existingModules.map((m) => m.id);
						const providedModuleIds = modulesList
							.filter((m) => m.id)
							.map((m) => m.id as string);

						// Delete modules not in the payload
						const modulesToDelete = existingModuleIds.filter(
							(mId: string) => !providedModuleIds.includes(mId),
						);
						if (modulesToDelete.length > 0) {
							await tx.module.deleteMany({
								where: { id: { in: modulesToDelete } },
							});
						}

						// Upsert modules
						for (const moduleData of modulesList) {
							const {
								id: moduleId,
								questionsSetOneIds,
								questionsSetTwoIds,
								...moduleFields
							} = moduleData;

							await tx.module.upsert({
								where: { id: moduleId ?? "" },
								create: {
									...moduleFields,
									sectionId: section.id,
									...(questionsSetOneIds && {
										questionsSetOne: {
											connect: questionsSetOneIds.map((qId) => ({ id: qId })),
										},
									}),
									...(questionsSetTwoIds && {
										questionsSetTwo: {
											connect: questionsSetTwoIds.map((qId) => ({ id: qId })),
										},
									}),
								},
								update: {
									...moduleFields,
									...(questionsSetOneIds && {
										questionsSetOne: {
											set: questionsSetOneIds.map((qId) => ({ id: qId })),
										},
									}),
									...(questionsSetTwoIds && {
										questionsSetTwo: {
											set: questionsSetTwoIds.map((qId) => ({ id: qId })),
										},
									}),
								},
							});
						}
					}
				}
			}

			// Return the complete test with all relations
			return tx.sATPractice.findUnique({
				where: { id: test.id },
				include: {
					testType: true,
					subject: true,
					difficulty: true,
					section: {
						include: {
							modules: {
								include: {
									questionsSetOne: {
										include: { options: { orderBy: { orderIndex: "asc" } } },
									},
									questionsSetTwo: {
										include: { options: { orderBy: { orderIndex: "asc" } } },
									},
								},
								orderBy: { orderIndex: "asc" },
							},
						},
						orderBy: { orderIndex: "asc" },
					},
				},
			});
		});

		const isUpdate = !!id;

		return res.status(isUpdate ? 200 : 201).json({
			success: true,
			data: satPractice,
			message: `SAT Practice test ${isUpdate ? "updated" : "created"} successfully`,
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy, search } = ZQueryParams.parse(
			req.query,
		);
		const filters = ZSATPracticeFilters.parse(req.query);
		const skip = (page - 1) * limit;

		const cacheKey = `satPractice:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;
		const cachedData = await cached.get(cacheKey);

		if (cachedData) {
			const parsed = JSON.parse(cachedData);
			return res.status(200).json({
				success: true,
				message: "SAT Practice tests fetched successfully (from cache)",
				data: parsed.data,
				pagination: parsed.pagination,
			});
		}

		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const ALLOWED_FILTERS: Array<keyof Prisma.SATPracticeWhereInput> = [
			"testTypeId",
			"subjectId",
			"difficultyId",
			"status",
		];
		const where = buildFiltersWithSearch<Prisma.SATPracticeWhereInput>(
			filters,
			ALLOWED_FILTERS,
			search,
			["name"],
		);

		const [tests, total] = await Promise.all([
			prisma.sATPractice.findMany({
				where,
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					testType: true,
					subject: true,
					difficulty: true,
					section: {
						include: {
							modules: { orderBy: { orderIndex: "asc" } },
						},
						orderBy: { orderIndex: "asc" },
					},
				},
			}),
			prisma.sATPractice.count({ where }),
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

		await cached.set(cacheKey, JSON.stringify({ data: tests, pagination }), 60);

		return res.status(200).json({
			success: true,
			data: tests,
			pagination,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const test = await prisma.sATPractice.findUnique({
			where: { id },
			include: {
				testType: true,
				subject: true,
				difficulty: true,
				section: {
					include: {
						modules: {
							include: {
								questionsSetOne: {
									include: { options: { orderBy: { orderIndex: "asc" } } },
								},
								questionsSetTwo: {
									include: { options: { orderBy: { orderIndex: "asc" } } },
								},
							},
							orderBy: { orderIndex: "asc" },
						},
					},
					orderBy: { orderIndex: "asc" },
				},
			},
		});

		if (!test) throw AppError.notFound("SAT Practice test not found");

		return res.status(200).json({
			success: true,
			data: test,
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);

		const existing = await prisma.sATPractice.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("SAT Practice test not found");

		await prisma.sATPractice.delete({ where: { id } });

		return res.status(200).json({
			success: true,
			message: "SAT Practice test deleted successfully",
		});
	});

	// Publish test
	publish = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);

		const test = await prisma.sATPractice.findUnique({
			where: { id },
			include: {
				section: {
					include: { modules: true },
				},
			},
		});

		if (!test) throw AppError.notFound("SAT Practice test not found");

		// Validate test has sections and modules
		if (!test.section || test.section.length === 0) {
			throw AppError.badRequest("Cannot publish test without sections");
		}

		for (const section of test.section) {
			if (!section.modules || section.modules.length === 0) {
				throw AppError.badRequest(`Section "${section.name}" has no modules`);
			}
		}

		const updated = await prisma.sATPractice.update({
			where: { id },
			data: { status: "PUBLISHED" },
			include: {
				testType: true,
				subject: true,
				difficulty: true,
			},
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "SAT Practice test published successfully",
		});
	});
}

// ==================== SECTION CONTROLLER ====================
export class SectionController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { satPracticeId } = req.params;
		const data = ZSection.parse(req.body);
		const { modules, ...sectionData } = data;

		const section = await prisma.$transaction(async (tx) => {
			const sec = await tx.section.create({
				data: {
					...sectionData,
					satPracticeId,
				},
			});

			// Create modules if provided
			if (modules && modules.length > 0) {
				for (const moduleData of modules) {
					const { questionsSetOneIds, questionsSetTwoIds, ...moduleFields } =
						moduleData;

					await tx.module.create({
						data: {
							...moduleFields,
							sectionId: sec.id,
							...(questionsSetOneIds && {
								questionsSetOne: {
									connect: questionsSetOneIds.map((id) => ({ id })),
								},
							}),
							...(questionsSetTwoIds && {
								questionsSetTwo: {
									connect: questionsSetTwoIds.map((id) => ({ id })),
								},
							}),
						},
					});
				}
			}

			return tx.section.findUnique({
				where: { id: sec.id },
				include: {
					modules: {
						include: {
							questionsSetOne: { include: { options: true } },
							questionsSetTwo: { include: { options: true } },
						},
						orderBy: { orderIndex: "asc" },
					},
				},
			});
		});

		return res.status(201).json({
			success: true,
			data: section,
			message: "Section created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { satPracticeId } = req.params;

		const sections = await prisma.section.findMany({
			where: { satPracticeId, isActive: true },
			orderBy: { orderIndex: "asc" },
			include: {
				modules: { orderBy: { orderIndex: "asc" } },
			},
		});

		return res.status(200).json({
			success: true,
			data: sections,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const section = await prisma.section.findUnique({
			where: { id },
			include: {
				modules: {
					include: {
						questionsSetOne: { include: { options: true } },
						questionsSetTwo: { include: { options: true } },
					},
					orderBy: { orderIndex: "asc" },
				},
			},
		});

		if (!section) throw AppError.notFound("Section not found");

		return res.status(200).json({
			success: true,
			data: section,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);
		const data = ZSectionUpdate.parse(req.body);
		const { modules: _modules, ...sectionData } = data;

		const existing = await prisma.section.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Section not found");

		const updated = await prisma.section.update({
			where: { id },
			data: sectionData,
			include: {
				modules: { orderBy: { orderIndex: "asc" } },
			},
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Section updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);

		const existing = await prisma.section.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Section not found");

		await prisma.section.delete({ where: { id } });

		return res.status(200).json({
			success: true,
			message: "Section deleted successfully",
		});
	});
}

// ==================== MODULE CONTROLLER ====================
export class ModuleController {
	create = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { sectionId } = req.params;
		const data = ZModule.parse(req.body);
		const { questionsSetOneIds, questionsSetTwoIds, ...moduleData } = data;

		const module = await prisma.module.create({
			data: {
				...moduleData,
				sectionId,
				...(questionsSetOneIds && {
					questionsSetOne: {
						connect: questionsSetOneIds.map((id) => ({ id })),
					},
				}),
				...(questionsSetTwoIds && {
					questionsSetTwo: {
						connect: questionsSetTwoIds.map((id) => ({ id })),
					},
				}),
			},
			include: {
				questionsSetOne: { include: { options: true } },
				questionsSetTwo: { include: { options: true } },
			},
		});

		return res.status(201).json({
			success: true,
			data: module,
			message: "Module created successfully",
		});
	});

	getAll = asyncHandler(async (req, res) => {
		const { sectionId } = req.params;

		const modules = await prisma.module.findMany({
			where: { sectionId, isActive: true },
			orderBy: { orderIndex: "asc" },
		});

		return res.status(200).json({
			success: true,
			data: modules,
		});
	});

	getById = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const module = await prisma.module.findUnique({
			where: { id },
			include: {
				questionsSetOne: { include: { options: true } },
				questionsSetTwo: { include: { options: true } },
			},
		});

		if (!module) throw AppError.notFound("Module not found");

		return res.status(200).json({
			success: true,
			data: module,
		});
	});

	update = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);
		const data = ZModuleUpdate.parse(req.body);
		const { questionsSetOneIds, questionsSetTwoIds, ...moduleData } = data;

		const existing = await prisma.module.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Module not found");

		const updated = await prisma.module.update({
			where: { id },
			data: {
				...moduleData,
				...(questionsSetOneIds && {
					questionsSetOne: {
						set: questionsSetOneIds.map((id) => ({ id })),
					},
				}),
				...(questionsSetTwoIds && {
					questionsSetTwo: {
						set: questionsSetTwoIds.map((id) => ({ id })),
					},
				}),
			},
			include: {
				questionsSetOne: { include: { options: true } },
				questionsSetTwo: { include: { options: true } },
			},
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Module updated successfully",
		});
	});

	delete = asyncHandler(async (req, res) => {
		const cacheKey = `satPractice:*`;
		invalidateCachePattern(cacheKey);

		const { id } = ZCuid.parse(req.params);

		const existing = await prisma.module.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Module not found");

		await prisma.module.delete({ where: { id } });

		return res.status(200).json({
			success: true,
			message: "Module deleted successfully",
		});
	});
}
