import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	let statusCode = 500;
	let message = "Internal Server Error";
	let errors: any;

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
		errors = err.errors;
	}

	// Log error
	logger.error({
		statusCode,
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		ip: req.ip,
	});

	// Send response
	res.status(statusCode).json({
		success: false,
		message,
		errors,
		...(config.nodeEnv === "development" && { stack: err.stack }),
	});
};
