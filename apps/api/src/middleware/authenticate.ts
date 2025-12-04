import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { AppError } from "../utils/AppError";

interface JwtPayload {
	userId: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			throw AppError.unauthorized("No token provided");
		}

		const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
		req.user = decoded;
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			next(AppError.unauthorized("Invalid token"));
		} else {
			next(error);
		}
	}
};
