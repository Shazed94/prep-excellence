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
