export class AppError extends Error {
	public readonly statusCode: number;
	public readonly errors?: any;

	constructor(message: string, statusCode: number = 500, errors?: any) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
		Error.captureStackTrace(this, this.constructor);
	}

	static badRequest(message: string = "Bad Request", errors?: any) {
		return new AppError(message, 400, errors);
	}

	static unauthorized(message: string = "Unauthorized") {
		return new AppError(message, 401);
	}

	static forbidden(message: string = "Forbidden") {
		return new AppError(message, 403);
	}

	static notFound(message: string = "Resource not found") {
		return new AppError(message, 404);
	}

	static conflict(message: string = "Conflict") {
		return new AppError(message, 409);
	}

	static internal(message: string = "Internal Server Error") {
		return new AppError(message, 500);
	}
}
