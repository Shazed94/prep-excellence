import type { Permission, Role, User } from "@/generated/client";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";

export type UserWithRoleAndPermissions = User & {
	role: Role & {
		permissions: Permission[];
	};
};

export type PermissionScope =
	| "all"
	| "own"
	| "enrolled"
	| "children"
	| "referred";

/**
 * Permission checker utility - static methods for RBAC authorization
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Static utility class pattern is intentional for permission checking
export class PermissionChecker {
	static hasPermission(
		user: UserWithRoleAndPermissions,
		permissionCode: string,
	): boolean {
		if (user.isSuperUser) return true;
		return user.role.permissions.some(
			(p: Permission) => p.codeName === permissionCode,
		);
	}

	static hasAnyPermission(
		user: UserWithRoleAndPermissions,
		permissionCodes: string[],
	): boolean {
		if (user.isSuperUser) return true;
		return permissionCodes.some((code) =>
			PermissionChecker.hasPermission(user, code),
		);
	}

	static hasAllPermissions(
		user: UserWithRoleAndPermissions,
		permissionCodes: string[],
	): boolean {
		if (user.isSuperUser) return true;
		return permissionCodes.every((code) =>
			PermissionChecker.hasPermission(user, code),
		);
	}

	static getPermissionScope(
		user: UserWithRoleAndPermissions,
		permissionCode: string,
	): PermissionScope | null {
		if (user.isSuperUser) return "all";
		const permission = user.role.permissions.find(
			(p: Permission) => p.codeName === permissionCode,
		);
		return permission?.scope ? (permission.scope as PermissionScope) : null;
	}

	static canAccessResource(
		user: UserWithRoleAndPermissions,
		permissionCode: string,
		resourceOwnerId?: string,
	): boolean {
		if (user.isSuperUser) return true;
		const scope = PermissionChecker.getPermissionScope(user, permissionCode);
		if (!scope) return false;

		switch (scope) {
			case "all":
				return true;
			case "own":
				return resourceOwnerId ? user.id === resourceOwnerId : false;
			case "enrolled":
			case "children":
			case "referred":
				return true; // Permission exists, actual filtering done in query
			default:
				return false;
		}
	}

	static async buildScopeFilter(
		user: UserWithRoleAndPermissions,
		permissionCode: string,
		userIdField: string = "userId",
	): Promise<Record<string, any> | null> {
		if (user.isSuperUser) return {};

		const scope = PermissionChecker.getPermissionScope(user, permissionCode);
		if (!scope) return null;

		switch (scope) {
			case "all":
				return {};

			case "own":
				return { [userIdField]: user.id };

			case "enrolled": {
				// Placeholder: Implement based on your enrollment schema
				return {};
			}

			case "children": {
				const children = await prisma.student.findMany({
					where: {
						parents: {
							some: {
								userId: user.id,
							},
						},
					},
					select: { userId: true },
				});
				const childrenIds = children.map((c) => c.userId);
				return { [userIdField]: { in: childrenIds } };
			}

			case "referred": {
				// Placeholder: Implement based on your referral schema
				return {};
			}

			default:
				return null;
		}
	}

	static getUserPermissions(user: UserWithRoleAndPermissions): string[] {
		if (user.isSuperUser) return ["*"];
		return user.role.permissions.map((p: Permission) => p.codeName);
	}

	static async invalidateUserCache(userId: string): Promise<void> {
		const cacheKey = `user:permissions:${userId}`;
		await cached.del(cacheKey);
	}

	static async invalidateRoleCache(_roleId: string): Promise<void> {
		const keys = await cached.keys("user:permissions:*");
		for (const key of keys) {
			await cached.del(key);
		}
	}

	static isStaff(user: User): boolean {
		return user.isStaff || user.isSuperUser;
	}

	static isActiveAndVerified(user: User): boolean {
		return user.isActive && user.isVerified;
	}
}

export async function loadUserWithPermissions(
	userId: string,
): Promise<UserWithRoleAndPermissions | null> {
	const cacheKey = `user:permissions:${userId}`;
	const cacheTTL = 300; // 5 minutes

	// Try cache first
	const cached_data =
		await cached.getJSON<UserWithRoleAndPermissions>(cacheKey);
	if (cached_data) {
		// Convert date strings back to Date objects
		const result: UserWithRoleAndPermissions = {
			...cached_data,
			createdAt: new Date(cached_data.createdAt),
			updatedAt: new Date(cached_data.updatedAt),
			role: cached_data.role
				? {
						...cached_data.role,
						createdAt: new Date(cached_data.role.createdAt),
						updatedAt: new Date(cached_data.role.updatedAt),
						permissions: cached_data.role.permissions.map((p) => ({
							...p,
							createdAt: new Date(p.createdAt),
							updatedAt: new Date(p.updatedAt),
						})),
					}
				: (null as any),
		};
		return result;
	}

	// Cache miss - fetch from database
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			role: {
				include: {
					permissions: true,
				},
			},
		},
	});

	// Cache the result
	if (user) {
		await cached.setJSON(cacheKey, user, cacheTTL);
	}

	return user;
}

export const PERMISSIONS = {
	USER: {
		VIEW: "view_user",
		VIEW_OWN: "view_own_user",
		ADD: "add_user",
		CHANGE: "change_user",
		CHANGE_OWN: "change_own_user",
		DELETE: "delete_user",
	},
	STUDENT: {
		VIEW: "view_student",
		VIEW_OWN: "view_own_student",
		VIEW_CHILDREN: "view_children_students",
		ADD: "add_student",
		CHANGE: "change_student",
		CHANGE_OWN: "change_own_student",
		DELETE: "delete_student",
	},
	COURSE: {
		VIEW: "view_course",
		VIEW_ENROLLED: "view_enrolled_courses",
		ADD: "add_course",
		CHANGE: "change_course",
		DELETE: "delete_course",
		PUBLISH: "publish_course",
		MANAGE_CONTENT: "manage_course_content",
	},
	CONTENT: {
		VIEW: "view_content",
		VIEW_ENROLLED: "view_enrolled_content",
		ADD: "add_content",
		CHANGE: "change_content",
		DELETE: "delete_content",
		PUBLISH: "publish_content",
		MODERATE: "moderate_content",
	},
	ENROLLMENT: {
		VIEW: "view_enrollment",
		VIEW_OWN: "view_own_enrollment",
		VIEW_CHILDREN: "view_children_enrollments",
		ADD: "add_enrollment",
		CHANGE: "change_enrollment",
		DELETE: "delete_enrollment",
		APPROVE: "approve_enrollment",
	},
	SESSION: {
		VIEW: "view_session",
		VIEW_OWN: "view_own_sessions",
		VIEW_ENROLLED: "view_enrolled_sessions",
		ADD: "add_session",
		CHANGE: "change_session",
		DELETE: "delete_session",
		SCHEDULE: "schedule_session",
		CANCEL: "cancel_session",
	},
	PAYMENT: {
		VIEW: "view_payment",
		VIEW_OWN: "view_own_payments",
		VIEW_CHILDREN: "view_children_payments",
		ADD: "add_payment",
		CHANGE: "change_payment",
		DELETE: "delete_payment",
		PROCESS: "process_payment",
		REFUND: "refund_payment",
	},
	ANALYTICS: {
		VIEW: "view_analytics",
		VIEW_OWN: "view_own_analytics",
		VIEW_ENROLLED: "view_enrolled_analytics",
		GENERATE_REPORT: "generate_analytics_report",
	},
	TEST: {
		VIEW: "view_test",
		VIEW_ENROLLED: "view_enrolled_tests",
		ADD: "add_test",
		CHANGE: "change_test",
		DELETE: "delete_test",
		GRADE: "grade_test",
	},
	ROLE: {
		VIEW: "view_role",
		ADD: "add_role",
		CHANGE: "change_role",
		DELETE: "delete_role",
	},
	PERMISSION: {
		VIEW: "view_permission",
		ADD: "add_permission",
		CHANGE: "change_permission",
		DELETE: "delete_permission",
	},
} as const;
