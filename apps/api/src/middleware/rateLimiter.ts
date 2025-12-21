
import type { NextFunction, Request, Response } from "express";
import config from "../config";

interface RateLimitStore {
	[key: string]: {
		count: number;
		resetTime: number;
	};
}

const store: RateLimitStore = {};

export const rateLimiter = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const key = req.ip || "unknown";
	const now = Date.now();

	if (!store[key] || now > store[key].resetTime) {
		store[key] = {
			count: 1,
			resetTime: now + config.rateLimit.windowMs,
		};
		return next();
	}

	store[key].count++;

	if (store[key].count > config.rateLimit.maxRequests) {
		return res.status(429).json({
			success: false,
			message: "Too many requests, please try again later",
		});
	}

	next();
};
