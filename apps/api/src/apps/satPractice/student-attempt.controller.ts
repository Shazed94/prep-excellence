import {
	ZCompleteModuleSchema,
	ZNavigateSectionSchema,
	ZStartAttemptSchema,
	ZSubmitAttemptSchema,
	ZSubmitMCQAnswerSchema,
	ZSubmitTextAnswerSchema,
} from "@prepexcellence/shared-validators";
import { AuditAction } from "@/generated/enums";
import prisma from "@/infrastructure/database/connection";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";

// ==================== STUDENT ATTEMPT CONTROLLER ====================
export class StudentAttemptController {
	/**
	 * Start a new SAT Practice attempt for a student
	 */
	startAttempt = asyncHandler(async (req, res) => {
		const { satPracticeId } = ZStartAttemptSchema.parse(req.body);
		const studentId = req.user?.student?.id;

		if (!studentId) {
			throw new AppError(
				"You must be logged in as a student to start an attempt.",
				400,
			);
		}

		// Verify SAT Practice exists and is published
		const satPractice = await prisma.sATPractice.findUnique({
			where: { id: satPracticeId },
			include: {
				section: {
					orderBy: { orderIndex: "asc" },
					include: {
						modules: {
							orderBy: { orderIndex: "asc" },
							include: {
								questionsSetOne: true,
								questionsSetTwo: true,
							},
						},
					},
				},
			},
		});

		if (!satPractice) {
			throw new AppError("SAT Practice test not found", 404);
		}

		if (satPractice.status !== "PUBLISHED") {
			throw new AppError("This SAT Practice test is not published yet", 400);
		}

		// Check if student already has an in-progress attempt
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

		// Create new attempt with section and module progress
		const attempt = await prisma.$transaction(async (tx) => {
			// Create the main attempt
			const newAttempt = await tx.studentSATAttempt.create({
				data: {
					studentId,
					satPracticeId,
					status: "IN_PROGRESS",
					startedAt: new Date(),
				},
			});

			// Create section progress for all sections
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

			// Fetch the complete attempt with all relations
			return await tx.studentSATAttempt.findUnique({
				where: { id: newAttempt.id },
				include: {
					sectionProgress: {
						include: {
							section: {
								include: {
									modules: {
										orderBy: { orderIndex: "asc" },
										include: {
											questionsSetOne: {
												include: {
													options: {
														orderBy: { orderIndex: "asc" },
													},
												},
											},
											questionsSetTwo: {
												include: {
													options: {
														orderBy: { orderIndex: "asc" },
													},
												},
											},
										},
									},
								},
							},
							moduleProgress: {
								include: {
									module: true,
								},
							},
						},
						orderBy: { section: { orderIndex: "asc" } },
					},
				},
			});
		});

		// Start the first section
		if (attempt?.sectionProgress.length) {
			await prisma.studentSectionProgress.update({
				where: { id: attempt.sectionProgress[0].id },
				data: {
					status: "IN_PROGRESS",
					startedAt: new Date(),
				},
			});

			// Start the first module of the first section
			if (attempt.sectionProgress[0].moduleProgress.length) {
				await prisma.studentModuleProgress.update({
					where: { id: attempt.sectionProgress[0].moduleProgress[0].id },
					data: {
						status: "IN_PROGRESS",
						startedAt: new Date(),
						usedQuestionSet: "SET_ONE", // Default to SET_ONE
					},
				});
			}
		}

		// Audit log
		await createAuditLogFromRequest(req, {
			action: AuditAction.CREATE,
			module: "StudentSATAttempt",
			entityId: attempt?.id || "",
			description: `Started SAT Practice attempt for test: ${satPractice.name}`,
			performedById: req.user?.id,
		});

		return res.status(201).json({
			success: true,
			data: attempt,
			message: "SAT Practice attempt started successfully",
		});
	});

	/**
	 * Get attempt details with all progress
	 */
	getAttempt = asyncHandler(async (req, res) => {
		const attemptId = req.params.attemptId as string;

		const attempt = await prisma.studentSATAttempt.findUnique({
			where: { id: attemptId },
			include: {
				student: {
					select: {
						id: true,
					},
				},
				satPractice: {
					include: {
						testType: true,
						subject: true,
						difficulty: true,
					},
				},
				sectionProgress: {
					include: {
						section: {
							include: {
								modules: {
									orderBy: { orderIndex: "asc" },
									include: {
										questionsSetOne: {
											include: {
												options: {
													orderBy: { orderIndex: "asc" },
												},
												testType: true,
												subject: true,
												domain: true,
												skill: true,
											},
										},
										questionsSetTwo: {
											include: {
												options: {
													orderBy: { orderIndex: "asc" },
												},
												testType: true,
												subject: true,
												domain: true,
												skill: true,
											},
										},
									},
								},
							},
						},
						moduleProgress: {
							include: {
								module: true,
							},
							orderBy: { module: { orderIndex: "asc" } },
						},
					},
					orderBy: { section: { orderIndex: "asc" } },
				},
				answers: {
					include: {
						question: {
							include: {
								options: {
									orderBy: { orderIndex: "asc" },
								},
							},
						},
						selectedOptions: {
							include: {
								option: true,
							},
						},
						gradedByTeacher: {
							select: {
								id: true,
								guardianName: true,
								guardianEmail: true,
							},
						},
					},
				},
			},
		});

		if (!attempt) {
			throw new AppError("Attempt not found", 404);
		}

		return res.status(200).json({
			success: true,
			data: attempt,
			message: "Attempt details retrieved successfully",
		});
	});

	/**
	 * Submit MCQ/Multiple Choice answer
	 */
	submitMCQAnswer = asyncHandler(async (req, res) => {
		const data = ZSubmitMCQAnswerSchema.parse(req.body);
		const {
			attemptId,
			questionId,
			selectedOptionIds,
			timeSpent,
			flaggedForReview,
		} = data;

		// Verify attempt exists and is in progress
		const attempt = await prisma.studentSATAttempt.findUnique({
			where: { id: attemptId },
		});

		if (!attempt) {
			throw new AppError("Attempt not found", 404);
		}

		if (!["IN_PROGRESS", "PAUSED"].includes(attempt.status)) {
			throw new AppError("Cannot submit answer for a completed attempt", 400);
		}

		// Get question details
		const question = await prisma.questionBank.findUnique({
			where: { id: questionId },
			include: {
				options: true,
			},
		});

		if (!question) {
			throw new AppError("Question not found", 404);
		}

		// Validate option type
		if (
			!["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"].includes(
				question.optionType,
			)
		) {
			throw new AppError(
				"This endpoint is only for MCQ/Multiple Choice questions",
				400,
			);
		}

		// Validate selected options belong to this question
		const validOptions = question.options.filter((opt) =>
			selectedOptionIds.includes(opt.id),
		);
		if (validOptions.length !== selectedOptionIds.length) {
			throw new AppError("Invalid option IDs provided", 400);
		}

		// Check if answer is correct
		const correctOptions = question.options.filter((opt) => opt.isCorrect);
		const correctOptionIds = correctOptions.map((opt) => opt.id).sort();
		const selectedSorted = [...selectedOptionIds].sort();

		const isCorrect =
			correctOptionIds.length === selectedSorted.length &&
			correctOptionIds.every((id, idx) => id === selectedSorted[idx]);

		const pointsEarned = isCorrect ? question.points : 0;

		// Upsert answer with transaction
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
					isCorrect,
					pointsEarned,
					timeSpent: timeSpent || 0,
					flaggedForReview,
					selectedOptions: {
						create: selectedOptionIds.map((optionId) => ({
							optionId,
						})),
					},
				},
				include: {
					selectedOptions: {
						include: {
							option: true,
						},
					},
					question: {
						include: {
							options: {
								orderBy: { orderIndex: "asc" },
							},
						},
					},
				},
			});

			return newAnswer;
		});

		return res.status(200).json({
			success: true,
			data: answer,
			message: "Answer submitted successfully",
		});
	});

	/**
	 * Submit text answer (FILL_IN_THE_BLANK, SHORT_ANSWER)
	 */
	submitTextAnswer = asyncHandler(async (req, res) => {
		const data = ZSubmitTextAnswerSchema.parse(req.body);
		const { attemptId, questionId, textAnswer, timeSpent, flaggedForReview } =
			data;

		// Verify attempt exists and is in progress
		const attempt = await prisma.studentSATAttempt.findUnique({
			where: { id: attemptId },
		});

		if (!attempt) {
			throw new AppError("Attempt not found", 404);
		}

		if (!["IN_PROGRESS", "PAUSED"].includes(attempt.status)) {
			throw new AppError("Cannot submit answer for a completed attempt", 400);
		}

		// Get question details
		const question = await prisma.questionBank.findUnique({
			where: { id: questionId },
			include: {
				options: true,
			},
		});

		if (!question) {
			throw new AppError("Question not found", 404);
		}

		// Validate option type
		if (!["FILL_IN_THE_BLANK", "SHORT_ANSWER"].includes(question.optionType)) {
			throw new AppError(
				"This endpoint is only for text/short answer questions",
				400,
			);
		}

		// Upsert answer
		const answer = await prisma.$transaction(async (tx) => {
			// Delete existing answer if any
			await tx.studentAnswer.deleteMany({
				where: {
					attemptId,
					questionId,
				},
			});

			// Create new answer (requires manual grading)
			const newAnswer = await tx.studentAnswer.create({
				data: {
					attemptId,
					questionId,
					textAnswer,
					timeSpent: timeSpent || 0,
					flaggedForReview,
					isCorrect: null, // Will be set by teacher
					pointsEarned: 0, // Will be set by teacher
					isManuallyGraded: false,
				},
				include: {
					question: {
						include: {
							options: {
								orderBy: { orderIndex: "asc" },
							},
						},
					},
				},
			});

			return newAnswer;
		});

		return res.status(200).json({
			success: true,
			data: answer,
			message: "Text answer submitted successfully (pending review)",
		});
	});

	/**
	 * Complete a module within a section
	 */
	completeModule = asyncHandler(async (req, res) => {
		const data = ZCompleteModuleSchema.parse(req.body);
		const { attemptId, sectionId, moduleId, usedQuestionSet } = data;

		// Get module progress
		const moduleProgress = await prisma.studentModuleProgress.findFirst({
			where: {
				moduleId,
				sectionProgress: {
					attemptId,
					sectionId,
				},
			},
			include: {
				module: {
					include: {
						questionsSetOne: true,
						questionsSetTwo: true,
					},
				},
				sectionProgress: {
					include: {
						section: {
							include: {
								modules: {
									orderBy: { orderIndex: "asc" },
								},
							},
						},
					},
				},
			},
		});

		if (!moduleProgress) {
			throw new AppError("Module progress not found", 404);
		}

		// Get questions for the used set
		const questions =
			usedQuestionSet === "SET_ONE"
				? moduleProgress.module.questionsSetOne
				: moduleProgress.module.questionsSetTwo;

		// Calculate score for this module
		const answers = await prisma.studentAnswer.findMany({
			where: {
				attemptId,
				questionId: {
					in: questions.map((q) => q.id),
				},
			},
		});

		const correctAnswers = answers.filter((a) => a.isCorrect === true).length;
		const score = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
		const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

		// Update module progress
		await prisma.studentModuleProgress.update({
			where: { id: moduleProgress.id },
			data: {
				status: "COMPLETED",
				completedAt: new Date(),
				usedQuestionSet,
				score,
				maxScore,
				correctAnswers,
				totalQuestions: questions.length,
			},
		});

		// Check if this was the last module in the section
		const allModulesProgress = await prisma.studentModuleProgress.findMany({
			where: {
				sectionProgressId: moduleProgress.sectionProgressId,
			},
		});

		const allModulesCompleted = allModulesProgress.every(
			(mp) => mp.status === "COMPLETED",
		);

		if (allModulesCompleted) {
			// Auto-complete the section
			await prisma.studentSectionProgress.update({
				where: { id: moduleProgress.sectionProgressId },
				data: {
					status: "COMPLETED",
					completedAt: new Date(),
				},
			});
		}

		return res.status(200).json({
			success: true,
			data: {
				moduleProgress,
				sectionCompleted: allModulesCompleted,
			},
			message: "Module completed successfully",
		});
	});

	/**
	 * Navigate to the next section
	 */
	navigateToNextSection = asyncHandler(async (req, res) => {
		const data = ZNavigateSectionSchema.parse(req.body);
		const { attemptId, currentSectionId } = data;

		// Get current section progress
		const currentSectionProgress =
			await prisma.studentSectionProgress.findFirst({
				where: {
					attemptId,
					sectionId: currentSectionId,
				},
				include: {
					section: true,
					moduleProgress: {
						orderBy: {
							module: { orderIndex: "desc" },
						},
						take: 1,
					},
				},
			});

		if (!currentSectionProgress) {
			throw new AppError("Current section not found", 404);
		}

		// Check if current section is completed
		if (currentSectionProgress.status !== "COMPLETED") {
			throw new AppError("Please complete the current section first", 400);
		}

		// Determine question set for next section's first module based on last module performance
		let nextQuestionSet: "SET_ONE" | "SET_TWO" = "SET_ONE";

		if (currentSectionProgress.moduleProgress.length > 0) {
			const lastModule = currentSectionProgress.moduleProgress[0];

			// Calculate performance percentage of last module
			if (lastModule.maxScore && lastModule.maxScore > 0) {
				const performancePercentage =
					((lastModule.score ?? 0) / lastModule.maxScore) * 100;

				// If performance >= 50%, use harder question set (SET_TWO)
				// If performance < 50%, use easier question set (SET_ONE)
				if (performancePercentage >= 50) {
					nextQuestionSet = "SET_TWO";
				}
			}
		}

		// Find next section
		const allSections = await prisma.studentSectionProgress.findMany({
			where: { attemptId },
			include: {
				section: true,
			},
			orderBy: {
				section: { orderIndex: "asc" },
			},
		});

		const currentIndex = allSections.findIndex(
			(s) => s.sectionId === currentSectionId,
		);
		const nextSection = allSections[currentIndex + 1];

		if (!nextSection) {
			// No more sections - complete the attempt
			await this.completeAttemptInternal(attemptId);

			return res.status(200).json({
				success: true,
				data: { allSectionsCompleted: true },
				message: "All sections completed. Attempt submitted.",
			});
		}

		// Start the next section
		await prisma.studentSectionProgress.update({
			where: { id: nextSection.id },
			data: {
				status: "IN_PROGRESS",
				startedAt: new Date(),
			},
		});

		// Start the first module of the next section with adaptive question set
		const firstModuleProgress = await prisma.studentModuleProgress.findFirst({
			where: {
				sectionProgressId: nextSection.id,
			},
			orderBy: {
				module: { orderIndex: "asc" },
			},
		});

		if (firstModuleProgress) {
			await prisma.studentModuleProgress.update({
				where: { id: firstModuleProgress.id },
				data: {
					status: "IN_PROGRESS",
					startedAt: new Date(),
					usedQuestionSet: nextQuestionSet,
				},
			});
		}

		return res.status(200).json({
			success: true,
			data: {
				nextSection,
				selectedQuestionSet: nextQuestionSet,
			},
			message: "Navigated to next section successfully",
		});
	});

	/**
	 * Submit entire attempt (can be called explicitly or auto-called)
	 */
	submitAttempt = asyncHandler(async (req, res) => {
		const { attemptId } = ZSubmitAttemptSchema.parse(req.body);
		await this.completeAttemptInternal(attemptId);

		const attempt = await prisma.studentSATAttempt.findUnique({
			where: { id: attemptId },
			include: {
				answers: {
					include: {
						question: true,
					},
				},
				satPractice: {
					select: {
						name: true,
					},
				},
			},
		});

		// Audit log
		if (attempt) {
			await createAuditLogFromRequest(req, {
				action: AuditAction.UPDATE,
				module: "StudentSATAttempt",
				entityId: attempt.id,
				description: `Submitted SAT Practice attempt: ${attempt.satPractice?.name || "Unknown"} (Score: ${attempt.percentageScore?.toFixed(1)}%)`,
				performedById: req.user?.id,
			});
		}

		return res.status(200).json({
			success: true,
			data: attempt,
			message: "Attempt submitted successfully",
		});
	});

	/**
	 * Internal helper to complete an attempt and calculate scores
	 */
	private completeAttemptInternal = async (attemptId: string) => {
		// Get all answers for this attempt
		const answers = await prisma.studentAnswer.findMany({
			where: { attemptId },
			include: {
				question: true,
			},
		});

		// Calculate total score
		const totalScore = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
		const maxScore = answers.reduce((sum, a) => sum + a.question.points, 0);
		const percentageScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

		// Check if there are any ungraded text answers
		const hasUngradedAnswers = answers.some(
			(a) => a.textAnswer && !a.isManuallyGraded,
		);

		// Update attempt status
		await prisma.studentSATAttempt.update({
			where: { id: attemptId },
			data: {
				status: hasUngradedAnswers ? "SUBMITTED" : "GRADED",
				completedAt: new Date(),
				submittedAt: new Date(),
				totalScore,
				maxScore,
				percentageScore,
			},
		});
	};
}
