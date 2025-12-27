import type { Request } from "express";
import type { AuditAction } from "@/generated/client";
import prisma from "@/infrastructure/database/connection";

export interface AuditLogData {
	action: AuditAction;
	module: string;
	entityId?: string;
	description?: string;
	ipAddress?: string;
	userAgent?: string;
	performedById?: string;
}

export async function createAuditLog(data: AuditLogData) {
	try {
		const auditLog = await prisma.auditLog.create({
			data: {
				action: data.action,
				module: data.module,
				entityId: data.entityId,
				description: data.description,
				ipAddress: data.ipAddress,
				userAgent: data.userAgent,
				performedById: data.performedById,
			},
		});

		return auditLog;
	} catch (error) {
		console.error("Failed to create audit log:", error);
		return null;
	}
}

export function getIpAddress(req: Request): string | undefined {
	const forwarded = req.headers["x-forwarded-for"];
	if (typeof forwarded === "string") {
		return forwarded.split(",")[0].trim();
	}
	return (
		req.ip || req.socket.remoteAddress || (req.connection as any)?.remoteAddress
	);
}

export function getUserAgent(req: Request): string | undefined {
	return req.headers["user-agent"];
}

export async function createAuditLogFromRequest(
	req: Request,
	data: Omit<AuditLogData, "ipAddress" | "userAgent">,
) {
	return createAuditLog({
		...data,
		ipAddress: getIpAddress(req),
		userAgent: getUserAgent(req),
	});
}
