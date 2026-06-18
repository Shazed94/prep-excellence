import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { AppError } from "../utils/AppError";
import {
	loadUserWithPermissions,
	type UserWithRoleAndPermissions,
} from "../utils/permission";

interface JwtPayload {
	userId: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: UserWithRoleAndPermissions;
			file?: Express.Multer.File;
			files?:
				| Express.Multer.File[]
				| { [fieldname: string]: Express.Multer.File[] };
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
			throw AppError.unauthorized("Unauthorized User");
		}

		const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

		// Load user with role and permissions
		const user = await loadUserWithPermissions(decoded.userId);

		if (!user) {
			throw AppError.unauthorized("User not found");
		}

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			next(AppError.unauthorized("Invalid token"));
		} else {
			next(error);
		}
	}
};
