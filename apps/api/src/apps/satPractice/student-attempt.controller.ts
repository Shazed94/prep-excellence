import {
	ZBulkGradeAnswers,
	ZCompleteModule,
	ZCuid,
	ZGetNextSection,
	ZGradeAnswer,
	ZQueryParams,
	ZStartAttempt,
	ZStartModule,
	ZStartSection,
	ZSubmitAnswer,
	ZSubmitAttempt,
} from "@prepexcellence/shared-validators";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";

// ==================== STUDENT ATTEMPT CONTROLLER ====================
export class StudentAttemptController {
	start = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { satPracticeId } = ZStartAttempt.parse(req.body);

		const satPractice = await prisma.sATPractice.findUnique({
			where: { id: satPracticeId },
			include: {
				section: {
					include: { modules: true },
					orderBy: { orderIndex: "asc" },
				},
			},
		});

		if (!satPractice) {
			throw AppError.notFound("SAT Practice test not found");
		}

		if (satPractice.status !== "PUBLISHED") {
			throw AppError.badRequest("This test is not available for students");
		}

		// Check if student already has an active attempt
		const existingAttempt = await prisma.studentSATAttempt.findFirst({
			where: {
				studentId,
				satPracticeId,
				status: {
					in: ["IN_PROGRESS", "PAUSED"],
				},
			},
		});

		if (existingAttempt) {
			return res.status(200).json({
				success: true,
				data: existingAttempt,
				message: "Resuming existing attempt",
			});
		}

		// Calculate max score by summing question points
		const questionsInTest = await prisma.questionBank.findMany({
			where: {
				OR: [
					{
						moduleQuestionsSetOne: {
							some: {
								section: { satPracticeId },
							},
						},
					},
					{
						moduleQuestionsSetTwo: {
							some: {
								section: { satPracticeId },
							},
						},
					},
				],
			},
			select: { points: true },
		});

		const maxScore = questionsInTest.reduce(
			(sum, question) => sum + question.points,
			0,
		);

		if (maxScore === 0) {
			throw AppError.badRequest(
				"Test has no questions or all questions have 0 points",
			);
		}

		// Create new attempt
		const attempt = await prisma.$transaction(async (tx) => {
			const newAttempt = await tx.studentSATAttempt.create({
				data: {
					studentId,
					satPracticeId,
					status: "IN_PROGRESS",
					startedAt: new Date(),
					maxScore,
				},
				include: {
					satPractice: {
						include: {
							testType: true,
							subject: true,
							difficulty: true,
						},
					},
				},
			});

			// Create section progress and module progress for each section
			for (const section of satPractice.section) {
				const sectionProgress = await tx.studentSectionProgress.create({
					data: {
						attemptId: newAttempt.id,
						sectionId: section.id,
						status: "NOT_STARTED",
					},
				});

				// Create module progress for all modules in this section
				for (const module of section.modules) {
					await tx.studentModuleProgress.create({
						data: {
							sectionProgressId: sectionProgress.id,
							moduleId: module.id,
							status: "NOT_STARTED",
						},
					});
				}
			}

			return newAttempt;
		});

		return res.status(201).json({
			success: true,
			data: attempt,
			message: "Attempt started successfully",
		});
	});

	// Get student's attempts
	getMyAttempts = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;
		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [attempts, total] = await Promise.all([
			prisma.studentSATAttempt.findMany({
				where: { studentId },
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					satPractice: {
						include: {
							testType: true,
							subject: true,
							difficulty: true,
						},
					},
				},
			}),
			prisma.studentSATAttempt.count({ where: { studentId } }),
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

		return res.status(200).json({
			success: true,
			data: attempts,
			pagination,
		});
	});

	// Get specific attempt details
	getAttemptById = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { id } = ZCuid.parse(req.params);

		const attempt = await prisma.studentSATAttempt.findFirst({
			where: {
				id,
				studentId,
			},
			include: {
				satPractice: {
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
				},
				sectionProgress: {
					include: {
						section: true,
						moduleProgress: {
							include: {
								module: true,
							},
						},
					},
				},
				answers: {
					include: {
						question: {
							include: {
								options: { orderBy: { orderIndex: "asc" } },
							},
						},
						selectedOptions: {
							include: {
								option: true,
							},
						},
					},
				},
			},
		});

		if (!attempt) throw AppError.notFound("Attempt not found");

		return res.status(200).json({
			success: true,
			data: attempt,
		});
	});

	// Submit answer for a question
	submitAnswer = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const data = ZSubmitAnswer.parse(req.body);
		const {
			attemptId,
			questionId,
			selectedOptionIds,
			textAnswer,
			timeSpent,
			flaggedForReview,
		} = data;

		// Verify attempt belongs to student
		const attempt = await prisma.studentSATAttempt.findFirst({
			where: {
				id: attemptId,
				studentId,
				status: {
					in: ["IN_PROGRESS", "PAUSED"],
				},
			},
		});

		if (!attempt) {
			throw AppError.forbidden("Invalid attempt or attempt is closed");
		}

		// Get question with options
		const question = await prisma.questionBank.findUnique({
			where: { id: questionId },
			include: {
				options: true,
			},
		});

		if (!question) throw AppError.notFound("Question not found");

		// Auto-grade MCQ questions
		let isCorrect: boolean | null = null;
		let pointsEarned = 0;

		if (
			selectedOptionIds &&
			selectedOptionIds.length > 0 &&
			["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"].includes(
				question.optionType,
			)
		) {
			const correctOptions = question.options
				.filter((opt) => opt.isCorrect)
				.map((opt) => opt.id);

			if (
				question.optionType === "SINGLE_CHOICE" ||
				question.optionType === "TRUE_FALSE"
			) {
				// Single correct answer
				isCorrect =
					selectedOptionIds.length === 1 &&
					correctOptions.includes(selectedOptionIds[0]);
			} else {
				// Multiple correct answers
				isCorrect =
					selectedOptionIds.length === correctOptions.length &&
					selectedOptionIds.every((id) => correctOptions.includes(id));
			}

			if (isCorrect) {
				pointsEarned = question.points;
			}
		}

		// Create or update answer
		const answer = await prisma.$transaction(async (tx) => {
			// Delete existing answer if any
			await tx.studentAnswer.deleteMany({
				where: {
					attemptId,
					questionId,
				},
			});

			// Create new answer
			const newAnswer = await tx.studentAnswer.create({
				data: {
					attemptId,
					questionId,
					textAnswer,
					isCorrect,
					pointsEarned,
					timeSpent,
					flaggedForReview,
				},
			});

			// Create selected option relations
			if (selectedOptionIds && selectedOptionIds.length > 0) {
				await tx.studentAnswerOption.createMany({
					data: selectedOptionIds.map((optionId) => ({
						studentAnswerId: newAnswer.id,
						optionId,
					})),
				});
			}

			return tx.studentAnswer.findUnique({
				where: { id: newAnswer.id },
				include: {
					selectedOptions: {
						include: { option: true },
					},
				},
			});
		});

		return res.status(200).json({
			success: true,
			data: answer,
			message: "Answer submitted successfully",
		});
	});

	// Complete and submit entire attempt
	submitAttempt = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { attemptId } = ZSubmitAttempt.parse(req.body);

		// Verify attempt belongs to student
		const attempt = await prisma.studentSATAttempt.findFirst({
			where: {
				id: attemptId,
				studentId,
			},
			include: {
				answers: true,
				sectionProgress: true,
			},
		});

		if (!attempt) throw AppError.notFound("Attempt not found");

		if (attempt.status === "SUBMITTED" || attempt.status === "GRADED") {
			throw AppError.badRequest("Attempt already submitted");
		}

		// Validate all sections are completed
		const incompleteSections = attempt.sectionProgress.filter(
			(sp) => sp.status !== "COMPLETED",
		);

		if (incompleteSections.length > 0) {
			throw AppError.badRequest(
				`Cannot submit attempt: ${incompleteSections.length} section(s) not completed`,
			);
		}

		// Calculate total score for auto-graded answers
		const autoGradedScore = attempt.answers
			.filter((ans) => ans.isCorrect !== null)
			.reduce((sum, ans) => sum + ans.pointsEarned, 0);

		// Count manually graded questions
		const manuallyGradedCount = attempt.answers.filter(
			(ans) => ans.isCorrect === null && ans.textAnswer,
		).length;

		const status = manuallyGradedCount > 0 ? "SUBMITTED" : "GRADED";
		const percentageScore =
			attempt.maxScore && attempt.maxScore > 0
				? Math.round((autoGradedScore / attempt.maxScore) * 100 * 100) / 100
				: 0;

		// Update attempt
		const updated = await prisma.studentSATAttempt.update({
			where: { id: attemptId },
			data: {
				status,
				completedAt: new Date(),
				submittedAt: new Date(),
				totalScore: autoGradedScore,
				percentageScore,
			},
			include: {
				satPractice: {
					include: {
						testType: true,
						subject: true,
					},
				},
			},
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message:
				manuallyGradedCount > 0
					? "Attempt submitted. Awaiting teacher grading for text answers."
					: "Attempt submitted and graded successfully!",
		});
	});

	// Get attempt result (only for submitted/graded attempts)
	getResult = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { id } = ZCuid.parse(req.params);

		const attempt = await prisma.studentSATAttempt.findFirst({
			where: {
				id,
				studentId,
				status: {
					in: ["SUBMITTED", "GRADED"],
				},
			},
			include: {
				satPractice: {
					include: {
						testType: true,
						subject: true,
						difficulty: true,
					},
				},
				answers: {
					include: {
						question: {
							include: {
								domain: true,
								skill: true,
							},
						},
						selectedOptions: {
							include: {
								option: true,
							},
						},
					},
				},
			},
		});

		if (!attempt) {
			throw AppError.notFound("Result not available or attempt not found");
		}

		// Sanitize answers: exclude sensitive data from students
		const sanitizedAnswers = attempt.answers.map(
			({ textAnswer, teacherFeedback, ...answer }) => answer,
		);

		return res.status(200).json({
			success: true,
			data: {
				...attempt,
				answers: sanitizedAnswers,
			},
		});
	});

	// ==================== SECTION PROGRESS MANAGEMENT ====================

	// Start a section (with sequential order validation)
	startSection = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { attemptId, sectionId } = ZStartSection.parse(req.body);

		// Verify attempt belongs to student
		const attempt = await prisma.studentSATAttempt.findFirst({
			where: {
				id: attemptId,
				studentId,
				status: { in: ["IN_PROGRESS", "PAUSED"] },
			},
			include: {
				satPractice: {
					include: {
						section: {
							orderBy: { orderIndex: "asc" },
						},
					},
				},
				sectionProgress: {
					include: {
						section: true,
					},
					orderBy: {
						section: { orderIndex: "asc" },
					},
				},
			},
		});

		if (!attempt) throw AppError.notFound("Attempt not found");

		// Find the section being started
		const targetSectionProgress = attempt.sectionProgress.find(
			(sp) => sp.sectionId === sectionId,
		);

		if (!targetSectionProgress) {
			throw AppError.notFound("Section not found in this attempt");
		}

		// Check if section is already completed
		if (targetSectionProgress.status === "COMPLETED") {
			return res.status(200).json({
				success: true,
				data: targetSectionProgress,
				message: "Section already completed",
			});
		}

		// Check if section is already in progress
		if (targetSectionProgress.status === "IN_PROGRESS") {
			return res.status(200).json({
				success: true,
				data: targetSectionProgress,
				message: "Section already in progress",
			});
		}

		// Find the order index of target section
		const targetSection = attempt.satPractice.section.find(
			(s) => s.id === sectionId,
		);

		if (!targetSection) throw AppError.notFound("Section not found");

		// ENFORCE SEQUENTIAL ORDER: Check if all previous sections are completed
		const previousSections = attempt.satPractice.section.filter(
			(s) => s.orderIndex < targetSection.orderIndex,
		);

		for (const prevSection of previousSections) {
			const prevProgress = attempt.sectionProgress.find(
				(sp) => sp.sectionId === prevSection.id,
			);

			if (prevProgress?.status !== "COMPLETED") {
				throw AppError.badRequest(
					`Cannot start this section. Please complete "${prevSection.name}" (Section ${prevSection.orderIndex + 1}) first`,
				);
			}
		}

		// Start the section
		const updated = await prisma.studentSectionProgress.update({
			where: { id: targetSectionProgress.id },
			data: {
				status: "IN_PROGRESS",
				startedAt: new Date(),
			},
			include: {
				section: {
					include: {
						modules: {
							orderBy: { orderIndex: "asc" },
						},
					},
				},
				moduleProgress: {
					include: {
						module: true,
					},
					orderBy: {
						module: { orderIndex: "asc" },
					},
				},
			},
		});

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Section started successfully",
		});
	});

	// Get next section that should be started
	getNextSection = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { attemptId } = ZGetNextSection.parse(req.query);

		// Get attempt with all sections
		const attempt = await prisma.studentSATAttempt.findFirst({
			where: {
				id: attemptId,
				studentId,
			},
			include: {
				satPractice: {
					include: {
						section: {
							orderBy: { orderIndex: "asc" },
						},
					},
				},
				sectionProgress: {
					include: {
						section: true,
					},
					orderBy: {
						section: { orderIndex: "asc" },
					},
				},
			},
		});

		if (!attempt) throw AppError.notFound("Attempt not found");

		// Find first incomplete section in order
		const nextSectionProgress = attempt.sectionProgress.find(
			(sp) => sp.status !== "COMPLETED",
		);

		if (!nextSectionProgress) {
			// All sections completed
			return res.status(200).json({
				success: true,
				data: null,
				message: "All sections completed",
				allComplete: true,
			});
		}

		// Get full section details with modules
		const nextSection = await prisma.section.findUnique({
			where: { id: nextSectionProgress.sectionId },
			include: {
				modules: {
					orderBy: { orderIndex: "asc" },
				},
			},
		});

		return res.status(200).json({
			success: true,
			data: {
				section: nextSection,
				sectionProgress: nextSectionProgress,
				sectionNumber:
					attempt.sectionProgress.findIndex(
						(sp) => sp.id === nextSectionProgress.id,
					) + 1,
				totalSections: attempt.sectionProgress.length,
			},
			allComplete: false,
		});
	});

	// ==================== MODULE PROGRESS MANAGEMENT ====================

	// Start a module (marks it as in-progress and tracks which question set to use)
	startModule = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { sectionProgressId, moduleId, useQuestionSet } =
			ZStartModule.parse(req.body);

		// Verify the section progress belongs to the student
		const sectionProgress = await prisma.studentSectionProgress.findFirst({
			where: {
				id: sectionProgressId,
				attempt: { studentId },
			},
			include: {
				section: {
					include: {
						modules: {
							include: {
								questionsSetOne: { select: { points: true } },
								questionsSetTwo: { select: { points: true } },
							},
						},
					},
				},
			},
		});

		if (!sectionProgress) {
			throw AppError.notFound("Section progress not found");
		}

		// Find the module
		const module = sectionProgress.section.modules.find(
			(m) => m.id === moduleId,
		);
		if (!module) throw AppError.notFound("Module not found in this section");

		// Calculate max score for this module based on the question set
		const questions =
			useQuestionSet === "SET_ONE"
				? module.questionsSetOne
				: module.questionsSetTwo;
		const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
		const totalQuestions = questions.length;

		// Update module progress
		const moduleProgress = await prisma.studentModuleProgress.update({
			where: {
				sectionProgressId_moduleId: {
					sectionProgressId,
					moduleId,
				},
			},
			data: {
				status: "IN_PROGRESS",
				startedAt: new Date(),
				usedQuestionSet: useQuestionSet,
				maxScore,
				totalQuestions,
			},
			include: {
				module: {
					include: {
						questionsSetOne: {
							include: { options: { orderBy: { orderIndex: "asc" } } },
							orderBy: { orderIndex: "asc" },
						},
						questionsSetTwo: {
							include: { options: { orderBy: { orderIndex: "asc" } } },
							orderBy: { orderIndex: "asc" },
						},
					},
				},
			},
		});

		// Update section progress status if this is the first module
		await prisma.studentSectionProgress.update({
			where: { id: sectionProgressId },
			data: {
				status: "IN_PROGRESS",
				startedAt:
					sectionProgress.startedAt || new Date(),
				currentModuleId: moduleId,
			},
		});

		return res.status(200).json({
			success: true,
			data: moduleProgress,
			message: "Module started successfully",
		});
	});

	// Complete a module (calculate score and determine next module for adaptive testing)
	completeModule = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { moduleProgressId } = ZCompleteModule.parse(req.body);

		// Get module progress with all answers for this module
		const moduleProgress = await prisma.studentModuleProgress.findFirst({
			where: {
				id: moduleProgressId,
				sectionProgress: {
					attempt: { studentId },
				},
			},
			include: {
				module: {
					include: {
						questionsSetOne: { select: { id: true } },
						questionsSetTwo: { select: { id: true } },
						section: {
							include: {
								modules: {
									orderBy: { orderIndex: "asc" },
								},
							},
						},
					},
				},
				sectionProgress: {
					include: {
						attempt: {
							include: {
								answers: {
									where: {
										question: {
											OR: [
												{ moduleQuestionsSetOne: { some: {} } },
												{ moduleQuestionsSetTwo: { some: {} } },
											],
										},
									},
								},
							},
						},
					},
				},
			},
		});

		if (!moduleProgress) {
			throw AppError.notFound("Module progress not found");
		}

		// Get question IDs for this module based on used question set
		const questionIds =
			moduleProgress.usedQuestionSet === "SET_ONE"
				? moduleProgress.module.questionsSetOne.map((q) => q.id)
				: moduleProgress.module.questionsSetTwo.map((q) => q.id);

		// Filter answers for this module's questions
		const moduleAnswers = moduleProgress.sectionProgress.attempt.answers.filter(
			(ans) => questionIds.includes(ans.questionId),
		);

		// Calculate score
		const score = moduleAnswers.reduce((sum, ans) => sum + ans.pointsEarned, 0);
		const correctAnswers = moduleAnswers.filter((ans) => ans.isCorrect).length;

		// Determine next module for adaptive testing
		const currentModuleIndex = moduleProgress.module.section.modules.findIndex(
			(m) => m.id === moduleProgress.moduleId,
		);
		const nextModule =
			moduleProgress.module.section.modules[currentModuleIndex + 1];

		// Update module progress
		const updated = await prisma.studentModuleProgress.update({
			where: { id: moduleProgressId },
			data: {
				status: "COMPLETED",
				completedAt: new Date(),
				score,
				correctAnswers,
				nextModuleId: nextModule?.id,
			},
		});

		// Check if all modules in section are complete
		const allModulesProgress =
			await prisma.studentModuleProgress.findMany({
				where: {
					sectionProgressId: moduleProgress.sectionProgressId,
				},
			});

		const allComplete = allModulesProgress.every(
			(mp) => mp.status === "COMPLETED",
		);

		if (allComplete) {
			// Calculate total section time
			const sectionTimeSpent = allModulesProgress.reduce(
				(sum, mp) =>
					sum +
					(mp.completedAt && mp.startedAt
						? Math.floor(
								(mp.completedAt.getTime() - mp.startedAt.getTime()) / 1000,
							)
						: 0),
				0,
			);

			await prisma.studentSectionProgress.update({
				where: { id: moduleProgress.sectionProgressId },
				data: {
					status: "COMPLETED",
					completedAt: new Date(),
					timeSpent: sectionTimeSpent,
				},
			});
		}

		return res.status(200).json({
			success: true,
			data: updated,
			message: "Module completed successfully",
		});
	});

	// Get module progress details
	getModuleProgress = asyncHandler(async (req, res) => {
		const studentId = req.user?.id;
		if (!studentId) throw AppError.unauthorized("Student not authenticated");

		const { id } = ZCuid.parse(req.params);

		const moduleProgress = await prisma.studentModuleProgress.findFirst({
			where: {
				id,
				sectionProgress: {
					attempt: { studentId },
				},
			},
			include: {
				module: {
					include: {
						questionsSetOne: {
							include: { options: { orderBy: { orderIndex: "asc" } } },
							orderBy: { orderIndex: "asc" },
						},
						questionsSetTwo: {
							include: { options: { orderBy: { orderIndex: "asc" } } },
							orderBy: { orderIndex: "asc" },
						},
					},
				},
				sectionProgress: {
					include: {
						attempt: true,
					},
				},
			},
		});

		if (!moduleProgress) {
			throw AppError.notFound("Module progress not found");
		}

		return res.status(200).json({
			success: true,
			data: moduleProgress,
		});
	});
}

// ==================== TEACHER GRADING CONTROLLER ====================
export class TeacherGradingController {
	// Get all submitted attempts awaiting grading
	getPendingGrading = asyncHandler(async (req, res) => {
		const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
		const skip = (page - 1) * limit;
		const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

		const [attempts, total] = await Promise.all([
			prisma.studentSATAttempt.findMany({
				where: {
					status: "SUBMITTED",
				},
				orderBy: orderClause,
				skip,
				take: limit,
				include: {
					student: {
						select: {
							id: true,
							user: {
								select: {
									name: true,
									email: true,
								},
							},
						},
					},
					satPractice: {
						include: {
							testType: true,
							subject: true,
						},
					},
					answers: {
						where: {
							isManuallyGraded: false,
							textAnswer: { not: null },
						},
					},
				},
			}),
			prisma.studentSATAttempt.count({ where: { status: "SUBMITTED" } }),
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

		return res.status(200).json({
			success: true,
			data: attempts,
			pagination,
		});
	});

	// Get specific attempt with text answers for grading
	getAttemptForGrading = asyncHandler(async (req, res) => {
		const { id } = ZCuid.parse(req.params);

		const attempt = await prisma.studentSATAttempt.findUnique({
			where: { id },
			include: {
				student: {
					select: {
						id: true,
						user: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				},
				satPractice: {
					include: {
						testType: true,
						subject: true,
						difficulty: true,
					},
				},
				answers: {
					include: {
						question: {
							include: {
								options: { orderBy: { orderIndex: "asc" } },
								domain: true,
								skill: true,
							},
						},
						selectedOptions: {
							include: {
								option: true,
							},
						},
					},
				},
			},
		});

		if (!attempt) throw AppError.notFound("Attempt not found");

		return res.status(200).json({
			success: true,
			data: attempt,
		});
	});

	// Grade a single answer
	gradeAnswer = asyncHandler(async (req, res) => {
		const teacherId = req.user?.id;
		if (!teacherId) throw AppError.unauthorized("Teacher not authenticated");

		const data = ZGradeAnswer.parse(req.body);
		const { studentAnswerId, isCorrect, pointsEarned, teacherFeedback } = data;

		const studentAnswer = await prisma.studentAnswer.findUnique({
			where: { id: studentAnswerId },
			include: {
				question: true,
				attempt: true,
			},
		});

		if (!studentAnswer) throw AppError.notFound("Student answer not found");

		// Validate points don't exceed question points
		if (pointsEarned > studentAnswer.question.points) {
			throw AppError.badRequest(
				`Points earned cannot exceed question points (${studentAnswer.question.points})`,
			);
		}

		// Update answer with grading
		const graded = await prisma.$transaction(async (tx) => {
			const updated = await tx.studentAnswer.update({
				where: { id: studentAnswerId },
				data: {
					isCorrect,
					pointsEarned,
					teacherFeedback,
					isManuallyGraded: true,
					gradedByTeacherId: teacherId,
					gradedAt: new Date(),
				},
				include: {
					question: true,
				},
			});

			// Check if all text answers are graded
			const pendingAnswers = await tx.studentAnswer.count({
				where: {
					attemptId: studentAnswer.attemptId,
					textAnswer: { not: null },
					isManuallyGraded: false,
				},
			});

			// If all graded, update attempt status and recalculate total score
			if (pendingAnswers === 0) {
				const allAnswers = await tx.studentAnswer.findMany({
					where: { attemptId: studentAnswer.attemptId },
				});

				const totalScore = allAnswers.reduce(
					(sum, ans) => sum + ans.pointsEarned,
					0,
				);

				const attempt = await tx.studentSATAttempt.findUnique({
					where: { id: studentAnswer.attemptId },
				});

				const percentageScore =
					attempt?.maxScore && attempt.maxScore > 0
						? Math.round((totalScore / attempt.maxScore) * 100 * 100) / 100
						: 0;

				await tx.studentSATAttempt.update({
					where: { id: studentAnswer.attemptId },
					data: {
						status: "GRADED",
						totalScore,
						percentageScore,
					},
				});
			}

			return updated;
		});

		return res.status(200).json({
			success: true,
			data: graded,
			message: "Answer graded successfully",
		});
	});

	// Bulk grade multiple answers
	bulkGrade = asyncHandler(async (req, res) => {
		const teacherId = req.user?.id;
		if (!teacherId) throw AppError.unauthorized("Teacher not authenticated");

		const { grades } = ZBulkGradeAnswers.parse(req.body);

		const graded = await prisma.$transaction(async (tx) => {
			const results = [];

			for (const grade of grades) {
				const studentAnswer = await tx.studentAnswer.findUnique({
					where: { id: grade.studentAnswerId },
					include: {
						question: true,
					},
				});

				if (!studentAnswer) continue;

				if (grade.pointsEarned > studentAnswer.question.points) {
					throw AppError.badRequest(
						`Points earned cannot exceed question points for answer ${grade.studentAnswerId}`,
					);
				}

				const updated = await tx.studentAnswer.update({
					where: { id: grade.studentAnswerId },
					data: {
						isCorrect: grade.isCorrect,
						pointsEarned: grade.pointsEarned,
						teacherFeedback: grade.teacherFeedback,
						isManuallyGraded: true,
						gradedByTeacherId: teacherId,
						gradedAt: new Date(),
					},
				});

				results.push(updated);
			}

			// Update attempt statuses for all affected attempts
			const attemptIds = [...new Set(results.map((r) => r.attemptId))];

			for (const attemptId of attemptIds) {
				const pendingAnswers = await tx.studentAnswer.count({
					where: {
						attemptId,
						textAnswer: { not: null },
						isManuallyGraded: false,
					},
				});

				if (pendingAnswers === 0) {
					const allAnswers = await tx.studentAnswer.findMany({
						where: { attemptId },
					});

					const totalScore = allAnswers.reduce(
						(sum, ans) => sum + ans.pointsEarned,
						0,
					);

					const attempt = await tx.studentSATAttempt.findUnique({
						where: { id: attemptId },
					});

					const percentageScore =
						attempt?.maxScore && attempt.maxScore > 0
							? Math.round((totalScore / attempt.maxScore) * 100 * 100) / 100
							: 0;

					await tx.studentSATAttempt.update({
						where: { id: attemptId },
						data: {
							status: "GRADED",
							totalScore,
							percentageScore,
						},
					});
				}
			}

			return results;
		});

		return res.status(200).json({
			success: true,
			data: graded,
			message: `Successfully graded ${graded.length} answers`,
		});
	});
}
