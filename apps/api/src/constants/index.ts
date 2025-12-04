export const API_VERSION = "v1";

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
	UNAUTHORIZED: "Unauthorized access",
	FORBIDDEN: "Access forbidden",
	NOT_FOUND: "Resource not found",
	INTERNAL_ERROR: "Internal server error",
	VALIDATION_ERROR: "Validation error",
} as const;

export const TOKEN_EXPIRY = {
	ACCESS: "15m",
	REFRESH: "7d",
	RESET_PASSWORD: "1h",
	EMAIL_VERIFICATION: "24h",
} as const;
