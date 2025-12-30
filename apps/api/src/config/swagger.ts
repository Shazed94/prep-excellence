import type { Options } from "swagger-jsdoc";
import config from "./index";

const swaggerOptions: Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "PrepExcellence API",
			version: "1.1.4",
			description:
				"API documentation for PrepExcellence learning management system",
			contact: {
				name: "PrepExcellence Team",
				email: "support@prepexcellence.com",
			},
			license: {
				name: "ISC",
			},
		},
		servers: [
			{
				url: `http://localhost:${config.port}`,
				description: "Development server",
			},
			{
				url: "https://api.prepexcellence.com",
				description: "Production server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter your JWT token",
				},
			},
			schemas: {
				TestTypeCreate: {
					type: "object",
					required: ["name"],
					properties: {
						id: { type: "string", example: "tt_123" },
						name: { type: "string", example: "SAT" },
						description: {
							type: "string",
							example: "Scholastic Assessment Test",
						},
						order: { type: "integer", example: 1 },
					},
				},
				TestTypeUpdate: {
					type: "object",
					properties: {
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				TestTypeResponse: {
					type: "object",
					properties: {
						id: { type: "string" },
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
						createdAt: { type: "string", format: "date-time" },
						updatedAt: { type: "string", format: "date-time" },
					},
				},
				TestTypeListResponse: {
					type: "object",
					properties: {
						items: {
							type: "array",
							items: { $ref: "#/components/schemas/TestTypeResponse" },
						},
						total: { type: "integer" },
						page: { type: "integer" },
						limit: { type: "integer" },
					},
				},
				SubjectCreate: {
					type: "object",
					required: ["name"],
					properties: {
						id: { type: "string", example: "sub_123" },
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				SubjectUpdate: {
					type: "object",
					properties: {
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				SubjectResponse: { $ref: "#/components/schemas/TestTypeResponse" },
				SubjectListResponse: {
					$ref: "#/components/schemas/TestTypeListResponse",
				},
				DifficultyCreate: {
					type: "object",
					required: ["name"],
					properties: {
						id: { type: "string" },
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				DifficultyUpdate: {
					type: "object",
					properties: {
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				DifficultyResponse: { $ref: "#/components/schemas/TestTypeResponse" },
				DifficultyListResponse: {
					$ref: "#/components/schemas/TestTypeListResponse",
				},
				DomainCreate: {
					type: "object",
					required: ["name"],
					properties: {
						id: { type: "string" },
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				DomainUpdate: {
					type: "object",
					properties: {
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				DomainResponse: { $ref: "#/components/schemas/TestTypeResponse" },
				DomainListResponse: {
					$ref: "#/components/schemas/TestTypeListResponse",
				},
				SkillCreate: {
					type: "object",
					required: ["name"],
					properties: {
						id: { type: "string" },
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				SkillUpdate: {
					type: "object",
					properties: {
						name: { type: "string" },
						description: { type: "string" },
						order: { type: "integer" },
					},
				},
				SkillResponse: { $ref: "#/components/schemas/TestTypeResponse" },
				SkillListResponse: {
					$ref: "#/components/schemas/TestTypeListResponse",
				},
				QuestionCreate: {
					type: "object",
					required: ["text", "type"],
					properties: {
						id: { type: "string" },
						text: { type: "string" },
						type: { type: "string", example: "MCQ" },
						choices: { type: "array", items: { type: "string" } },
						answer: { type: "string" },
						metadata: { type: "object" },
					},
				},
				QuestionUpdate: {
					type: "object",
					properties: {
						text: { type: "string" },
						type: { type: "string" },
						choices: { type: "array", items: { type: "string" } },
						answer: { type: "string" },
						metadata: { type: "object" },
					},
				},
				QuestionResponse: {
					type: "object",
					properties: {
						id: { type: "string" },
						text: { type: "string" },
						type: { type: "string" },
						choices: { type: "array", items: { type: "string" } },
						answer: { type: "string" },
						metadata: { type: "object" },
						createdAt: { type: "string", format: "date-time" },
					},
				},
				QuestionListResponse: {
					type: "object",
					properties: {
						items: {
							type: "array",
							items: { $ref: "#/components/schemas/QuestionResponse" },
						},
						total: { type: "integer" },
						page: { type: "integer" },
						limit: { type: "integer" },
					},
				},
				QuestionFilterRequest: {
					type: "object",
					properties: {
						subjectId: { type: "string" },
						difficultyId: { type: "string" },
						domainId: { type: "string" },
						skillId: { type: "string" },
						type: { type: "string" },
						page: { type: "integer" },
						limit: { type: "integer" },
					},
				},
				SATPracticeUpsert: {
					type: "object",
					required: ["title"],
					properties: {
						id: { type: "string" },
						title: { type: "string" },
						description: { type: "string" },
						sections: { type: "array", items: { type: "object" } },
						published: { type: "boolean" },
					},
				},
				SATPracticeResponse: {
					type: "object",
					properties: {
						id: { type: "string" },
						title: { type: "string" },
						description: { type: "string" },
						sections: { type: "array", items: { type: "object" } },
						published: { type: "boolean" },
						createdAt: { type: "string", format: "date-time" },
					},
				},
				SATPracticeListResponse: {
					type: "object",
					properties: {
						items: {
							type: "array",
							items: { $ref: "#/components/schemas/SATPracticeResponse" },
						},
						total: { type: "integer" },
						page: { type: "integer" },
						limit: { type: "integer" },
					},
				},
				AttemptStartRequest: {
					type: "object",
					required: ["testId"],
					properties: {
						testId: { type: "string" },
						studentId: { type: "string" },
					},
				},
				AttemptResponse: {
					type: "object",
					properties: {
						id: { type: "string" },
						testId: { type: "string" },
						studentId: { type: "string" },
						status: { type: "string" },
						startedAt: { type: "string", format: "date-time" },
					},
				},
				AttemptProgressResponse: {
					type: "object",
					properties: {
						attempt: { $ref: "#/components/schemas/AttemptResponse" },
						progress: { type: "object" },
					},
				},
				SubmitMCQRequest: {
					type: "object",
					required: ["attemptId", "questionId", "choice"],
					properties: {
						attemptId: { type: "string" },
						questionId: { type: "string" },
						choice: { type: "string" },
					},
				},
				SubmitMCQResponse: {
					type: "object",
					properties: {
						correct: { type: "boolean" },
						scoreDelta: { type: "number" },
					},
				},
				SubmitTextAnswerRequest: {
					type: "object",
					required: ["attemptId", "questionId", "answer"],
					properties: {
						attemptId: { type: "string" },
						questionId: { type: "string" },
						answer: { type: "string" },
					},
				},
				SubmitTextAnswerResponse: {
					type: "object",
					properties: {
						submitted: { type: "boolean" },
						gradingRequired: { type: "boolean" },
					},
				},
				AttemptModuleCompleteRequest: {
					type: "object",
					required: ["attemptId", "moduleId"],
					properties: {
						attemptId: { type: "string" },
						moduleId: { type: "string" },
					},
				},
				AttemptNavigateNextRequest: {
					type: "object",
					required: ["attemptId"],
					properties: { attemptId: { type: "string" } },
				},
				AttemptSubmitRequest: {
					type: "object",
					required: ["attemptId"],
					properties: { attemptId: { type: "string" } },
				},
				AttemptSubmitResponse: {
					type: "object",
					properties: {
						submitted: { type: "boolean" },
						score: { type: "number" },
					},
				},
				GradingPendingListResponse: {
					type: "object",
					properties: {
						items: { type: "array", items: { type: "object" } },
						total: { type: "integer" },
					},
				},
				GradedListResponse: {
					type: "object",
					properties: {
						items: { type: "array", items: { type: "object" } },
						total: { type: "integer" },
					},
				},
				GradeRequest: {
					type: "object",
					required: ["answerId", "score"],
					properties: {
						answerId: { type: "string" },
						score: { type: "number" },
						feedback: { type: "string" },
					},
				},
				GradeUpdateRequest: {
					type: "object",
					properties: {
						score: { type: "number" },
						feedback: { type: "string" },
					},
				},
				GradeResponse: {
					type: "object",
					properties: {
						answerId: { type: "string" },
						score: { type: "number" },
						gradedAt: { type: "string", format: "date-time" },
					},
				},
				BulkGradeRequest: {
					type: "object",
					properties: {
						grades: {
							type: "array",
							items: { $ref: "#/components/schemas/GradeRequest" },
						},
					},
				},
				BulkGradeResponse: {
					type: "object",
					properties: {
						processed: { type: "integer" },
						failed: { type: "integer" },
					},
				},
				RecalculateRequest: {
					type: "object",
					required: ["attemptId"],
					properties: { attemptId: { type: "string" } },
				},
				RecalculateResponse: {
					type: "object",
					properties: {
						attemptId: { type: "string" },
						newScore: { type: "number" },
					},
				},
				GradingStatsResponse: {
					type: "object",
					properties: {
						satPracticeId: { type: "string" },
						totalAttempts: { type: "integer" },
						averageScore: { type: "number" },
					},
				},
				SuccessResponse: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
					},
				},
				PublishResponse: {
					type: "object",
					properties: {
						published: { type: "boolean" },
						publishedAt: { type: "string", format: "date-time" },
					},
				},
			},
			responses: {
				UnauthorizedError: {
					description: "Authentication token is missing or invalid",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									error: {
										type: "string",
										example: "Unauthorized",
									},
									message: {
										type: "string",
										example: "Invalid or missing authentication token",
									},
								},
							},
						},
					},
				},
				BadRequestError: {
					description: "Bad request - validation failed",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									error: {
										type: "string",
										example: "Bad Request",
									},
									message: {
										type: "string",
										example: "Validation error",
									},
									details: {
										type: "array",
										items: {
											type: "object",
										},
									},
								},
							},
						},
					},
				},
				NotFoundError: {
					description: "Resource not found",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									error: {
										type: "string",
										example: "Not Found",
									},
									message: {
										type: "string",
										example: "The requested resource was not found",
									},
								},
							},
						},
					},
				},
				ServerError: {
					description: "Internal server error",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									error: {
										type: "string",
										example: "Internal Server Error",
									},
									message: {
										type: "string",
										example: "An unexpected error occurred",
									},
								},
							},
						},
					},
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
		tags: [
			{
				name: "Health",
				description: "Health check and metrics endpoints",
			},
			{
				name: "Auth",
				description: "Authentication and authorization endpoints",
			},
			{
				name: "Users",
				description: "User management endpoints",
			},
			{
				name: "Roles",
				description: "Role and permission management",
			},
			{
				name: "Services",
				description: "Service management endpoints",
			},
			{
				name: "LMS",
				description: "Learning Management System endpoints",
			},
			{
				name: "Coaching",
				description: "Coaching session management",
			},
			{
				name: "One-to-One",
				description: "One-to-one session management",
			},
			{
				name: "Payments",
				description: "Payment processing endpoints",
			},
		],
	},
	// Paths to files containing OpenAPI definitions
	apis: [
		"./src/apps/**/*.ts",
		"./src/app.ts",
		"./src/server.ts",
		"./src/middleware/**/*.ts",
	],
};

export default swaggerOptions;
