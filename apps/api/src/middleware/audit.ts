import type { NextFunction, Request, Response } from "express";
import type { UserWithRoleAndPermissions } from "@/utils/permission";

/**
 * Middleware to attach audit helpers to request object
 * This makes it easier to log audits in controllers
 */
export interface AuditRequest extends Request {
	user?: UserWithRoleAndPermissions;
	audit?: {
		ipAddress: string | undefined;
		userAgent: string | undefined;
		performedById: string | undefined;
	};
}

export function auditMiddleware(
	req: AuditRequest,
	_res: Response,
	next: NextFunction,
) {
	// Extract IP address (handle proxy scenarios)
	const forwarded = req.headers["x-forwarded-for"];
	const ipAddress =
		typeof forwarded === "string"
			? forwarded.split(",")[0].trim()
			: req.ip ||
				req.socket.remoteAddress ||
				(req.connection as any)?.remoteAddress;

	// Extract user agent
	const userAgent = req.headers["user-agent"];

	// Attach audit data to request
	req.audit = {
		ipAddress,
		userAgent,
		performedById: req.user?.id,
	};

	next();
}
