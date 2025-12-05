import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
import { PermissionChecker } from "@/utils/permission";

/**
 * Middleware to check if user has required permission(s)
 * @param permissionCode - Single permission code or array of codes
 * @param requireAll - If true with array, requires all permissions. If false, requires any (default: false)
 * @returns Express middleware function
 *
 * @example
 * // Single permission
 * router.get('/users', authorize('view_user'), getUsers);
 *
 * @example
 * // Any of multiple permissions
 * router.get('/students', authorize(['view_student', 'view_own_student']), getStudents);
 *
 * @example
 * // All permissions required
 * router.post('/courses', authorize(['add_course', 'publish_course'], true), createCourse);
 */
export function authorize(
	permissionCode: string | string[],
	requireAll: boolean = false,
) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const user = req.user as UserWithRoleAndPermissions | undefined;

		if (!user) {
			return next(AppError.unauthorized("Authentication required"));
		}

		// Check if user account is active and verified
		if (!PermissionChecker.isActiveAndVerified(user)) {
			return next(
				AppError.forbidden(
					"Account is inactive or not verified. Please verify your email or contact support.",
				),
			);
		}

		// Single permission check
		if (typeof permissionCode === "string") {
			if (!PermissionChecker.hasPermission(user, permissionCode)) {
				return next(
					AppError.forbidden(
						`You do not have permission to perform this action. Required: ${permissionCode}`,
					),
				);
			}
			return next();
		}

		// Multiple permissions check
		const hasAccess = requireAll
			? PermissionChecker.hasAllPermissions(user, permissionCode)
			: PermissionChecker.hasAnyPermission(user, permissionCode);

		if (!hasAccess) {
			const requirement = requireAll ? "all of" : "any of";
			return next(
				AppError.forbidden(
					`You do not have permission to perform this action. Required ${requirement}: ${permissionCode.join(", ")}`,
				),
			);
		}

		next();
	};
}

/**
 * Middleware to check if user is staff (admin access)
 * @returns Express middleware function
 */
export function requireStaff() {
	return (req: Request, _res: Response, next: NextFunction) => {
		const user = req.user as UserWithRoleAndPermissions | undefined;

		if (!user) {
			return next(AppError.unauthorized("Authentication required"));
		}

		if (!PermissionChecker.isStaff(user)) {
			return next(
				AppError.forbidden("Staff access required for this operation"),
			);
		}

		next();
	};
}

/**
 * Middleware to check if user is superuser
 * @returns Express middleware function
 */
export function requireSuperUser() {
	return (req: Request, _res: Response, next: NextFunction) => {
		const user = req.user as UserWithRoleAndPermissions | undefined;

		if (!user) {
			return next(AppError.unauthorized("Authentication required"));
		}

		if (!user.isSuperUser) {
			return next(
				AppError.forbidden("Superuser access required for this operation"),
			);
		}

		next();
	};
}

/**
 * Middleware to check resource ownership or permission
 * @param permissionCode - Permission code to check
 * @param getResourceOwnerId - Function to extract resource owner ID from request
 * @returns Express middleware function
 *
 * @example
 * router.put('/users/:id',
 *   authorizeResourceAccess('change_user', (req) => req.params.id),
 *   updateUser
 * );
 */
export function authorizeResourceAccess(
	permissionCode: string,
	getResourceOwnerId: (req: Request) => string | undefined,
) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const user = req.user as UserWithRoleAndPermissions | undefined;

		if (!user) {
			return next(AppError.unauthorized("Authentication required"));
		}

		const resourceOwnerId = getResourceOwnerId(req);

		if (
			!PermissionChecker.canAccessResource(
				user,
				permissionCode,
				resourceOwnerId,
			)
		) {
			return next(
				AppError.forbidden(
					"You do not have permission to access this resource",
				),
			);
		}

		next();
	};
}
