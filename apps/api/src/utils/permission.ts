import type {
	Permission,
	Role,
	Student,
	Teacher,
	User,
} from "@/generated/client";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";

export type UserWithRoleAndPermissions = User & {
	role: Role & {
		permissions: Permission[];
	};
	student?: Student | null;
	teacher?: Teacher | null;
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
			student: true,
			teacher: true,
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
		VIEW: "User.view",
		ADD: "User.add",
		CHANGE: "User.change",
		DELETE: "User.delete",
		VIEW_OWN: "User.view_own",
		UPDATE_OWN_PROFILE: "User.update_own_profile",
		CHANGE_OWN_PASSWORD: "User.change_own_password",
	},
	ROLE: {
		VIEW: "Role.view",
		ADD: "Role.add",
		CHANGE: "Role.change",
		DELETE: "Role.delete",
		ASSIGN: "Role.assign",
	},
	PERMISSION: {
		VIEW: "Permission.view",
		ADD: "Permission.add",
		CHANGE: "Permission.change",
		DELETE: "Permission.delete",
		ASSIGN: "Permission.assign",
	},
	SYSTEM_USER: {
		VIEW: "SystemUser.view",
		ADD: "SystemUser.add",
		CHANGE: "SystemUser.change",
		DELETE: "SystemUser.delete",
		VIEW_OWN: "SystemUser.view_own",
	},
	STUDENT: {
		VIEW: "Student.view",
		ADD: "Student.add",
		CHANGE: "Student.change",
		DELETE: "Student.delete",
		VIEW_OWN: "Student.view_own",
		VIEW_CHILDREN: "Student.view_children",
		VIEW_ENROLLED: "Student.view_enrolled",
		VIEW_REFERRED: "Student.view_referred",
		PROMOTE: "Student.promote",
		TRACK_PROGRESS: "Student.track_progress",
	},
	TEACHER: {
		VIEW: "Teacher.view",
		ADD: "Teacher.add",
		CHANGE: "Teacher.change",
		DELETE: "Teacher.delete",
		VIEW_OWN: "Teacher.view_own",
	},
	INSTRUCTOR: {
		VIEW: "Instructor.view",
		ADD: "Instructor.add",
		CHANGE: "Instructor.change",
		DELETE: "Instructor.delete",
		VIEW_OWN: "Instructor.view_own",
	},
	PARENT: {
		VIEW: "Parent.view",
		ADD: "Parent.add",
		CHANGE: "Parent.change",
		DELETE: "Parent.delete",
		VIEW_OWN: "Parent.view_own",
		LINK_CHILD: "Parent.link_child",
	},
	REFERRAL: {
		VIEW: "Referral.view",
		ADD: "Referral.add",
		CHANGE: "Referral.change",
		DELETE: "Referral.delete",
		VIEW_OWN: "Referral.view_own",
		TRACK_EARNINGS: "Referral.track_earnings",
	},
	AFFILIATE: {
		VIEW: "Affiliate.view",
		ADD: "Affiliate.add",
		CHANGE: "Affiliate.change",
		DELETE: "Affiliate.delete",
		VIEW_OWN: "Affiliate.view_own",
		TRACK_EARNINGS: "Affiliate.track_earnings",
	},
	COURSE: {
		VIEW: "Course.view",
		ADD: "Course.add",
		CHANGE: "Course.change",
		DELETE: "Course.delete",
		VIEW_ENROLLED: "Course.view_enrolled",
		VIEW_OWN: "Course.view_own",
		PUBLISH: "Course.publish",
		UNPUBLISH: "Course.unpublish",
	},
	MODULE: {
		VIEW: "Module.view",
		ADD: "Module.add",
		CHANGE: "Module.change",
		DELETE: "Module.delete",
		VIEW_ENROLLED: "Module.view_enrolled",
		UNLOCK: "Module.unlock",
	},
	LESSON: {
		VIEW: "Lesson.view",
		ADD: "Lesson.add",
		CHANGE: "Lesson.change",
		DELETE: "Lesson.delete",
		VIEW_ENROLLED: "Lesson.view_enrolled",
		COMPLETE: "Lesson.complete",
	},
	TOPIC: {
		VIEW: "Topic.view",
		ADD: "Topic.add",
		CHANGE: "Topic.change",
		DELETE: "Topic.delete",
		VIEW_ENROLLED: "Topic.view_enrolled",
	},
	CONTENT: {
		VIEW: "Content.view",
		ADD: "Content.add",
		CHANGE: "Content.change",
		DELETE: "Content.delete",
		PUBLISH: "Content.publish",
		MODERATE: "Content.moderate",
		APPROVE: "Content.approve",
	},
	SESSION: {
		VIEW: "Session.view",
		ADD: "Session.add",
		CHANGE: "Session.change",
		DELETE: "Session.delete",
		VIEW_OWN: "Session.view_own",
		SCHEDULE: "Session.schedule",
		CANCEL: "Session.cancel",
		CONDUCT: "Session.conduct",
		JOIN: "Session.join",
	},
	PAYMENT: {
		VIEW: "Payment.view",
		ADD: "Payment.add",
		CHANGE: "Payment.change",
		DELETE: "Payment.delete",
		VIEW_OWN: "Payment.view_own",
		PROCESS: "Payment.process",
		REFUND: "Payment.refund",
		VIEW_REPORTS: "Payment.view_reports",
	},
	PAYMENT_PLAN: {
		VIEW: "PaymentPlan.view",
		ADD: "PaymentPlan.add",
		CHANGE: "PaymentPlan.change",
		DELETE: "PaymentPlan.delete",
		VIEW_OWN: "PaymentPlan.view_own",
		CREATE: "PaymentPlan.create",
		MODIFY: "PaymentPlan.modify",
	},
	INVOICE: {
		VIEW: "Invoice.view",
		ADD: "Invoice.add",
		CHANGE: "Invoice.change",
		DELETE: "Invoice.delete",
		VIEW_OWN: "Invoice.view_own",
		GENERATE: "Invoice.generate",
		SEND: "Invoice.send",
	},
	REFUND: {
		VIEW: "Refund.view",
		ADD: "Refund.add",
		CHANGE: "Refund.change",
		DELETE: "Refund.delete",
		VIEW_OWN: "Refund.view_own",
		PROCESS: "Refund.process",
		APPROVE: "Refund.approve",
	},
	ANALYTICS: {
		VIEW: "Analytics.view",
		ADD: "Analytics.add",
		CHANGE: "Analytics.change",
		DELETE: "Analytics.delete",
		VIEW_DASHBOARD: "Analytics.view_dashboard",
		EXPORT: "Analytics.export",
		VIEW_OWN_PROGRESS: "Analytics.view_own_progress",
		VIEW_CHILD_PROGRESS: "Analytics.view_child_progress",
	},
	TEST: {
		VIEW: "Test.view",
		ADD: "Test.add",
		CHANGE: "Test.change",
		DELETE: "Test.delete",
		CREATE: "Test.create",
		TAKE: "Test.take",
		GRADE: "Test.grade",
		PUBLISH: "Test.publish",
		VIEW_RESULTS: "Test.view_results",
		VIEW_OWN_RESULTS: "Test.view_own_results",
	},
	ENROLLMENT: {
		VIEW: "Enrollment.view",
		ADD: "Enrollment.add",
		CHANGE: "Enrollment.change",
		DELETE: "Enrollment.delete",
		VIEW_OWN: "Enrollment.view_own",
		APPROVE: "Enrollment.approve",
		REJECT: "Enrollment.reject",
	},
	VIDEO: {
		VIEW: "Video.view",
		ADD: "Video.add",
		CHANGE: "Video.change",
		DELETE: "Video.delete",
		VIEW_OWN: "Video.view_own",
		UPLOAD: "Video.upload",
		PROCESS: "Video.process",
		TRANSCODE: "Video.transcode",
	},
	DISCUSSION: {
		VIEW: "Discussion.view",
		ADD: "Discussion.add",
		CHANGE: "Discussion.change",
		DELETE: "Discussion.delete",
		CREATE_THREAD: "Discussion.create_thread",
		POST_MESSAGE: "Discussion.post_message",
		MODERATE: "Discussion.moderate",
	},
	CERTIFICATE: {
		VIEW: "Certificate.view",
		ADD: "Certificate.add",
		CHANGE: "Certificate.change",
		DELETE: "Certificate.delete",
		VIEW_OWN: "Certificate.view_own",
		GENERATE: "Certificate.generate",
		DOWNLOAD: "Certificate.download",
	},
	ATTENDANCE: {
		VIEW: "Attendance.view",
		ADD: "Attendance.add",
		CHANGE: "Attendance.change",
		DELETE: "Attendance.delete",
		VIEW_OWN: "Attendance.view_own",
		MARK: "Attendance.mark",
		VIEW_REPORTS: "Attendance.view_reports",
	},
	BILLING: {
		VIEW: "Billing.view",
		ADD: "Billing.add",
		CHANGE: "Billing.change",
		DELETE: "Billing.delete",
		VIEW_OWN: "Billing.view_own",
		CREATE_INVOICE: "Billing.create_invoice",
		SEND_INVOICE: "Billing.send_invoice",
		VIEW_REPORTS: "Billing.view_reports",
	},
	MATCHING: {
		VIEW: "Matching.view",
		ADD: "Matching.add",
		CHANGE: "Matching.change",
		DELETE: "Matching.delete",
		MATCH_TUTOR: "Matching.match_tutor",
		UNMATCH: "Matching.unmatch",
		VIEW_MATCHES: "Matching.view_matches",
	},
	LIVE_STREAM: {
		VIEW: "LiveStream.view",
		ADD: "LiveStream.add",
		CHANGE: "LiveStream.change",
		DELETE: "LiveStream.delete",
		START: "LiveStream.start",
		JOIN: "LiveStream.join",
		RECORD: "LiveStream.record",
		END: "LiveStream.end",
	},
	ASSIGNMENT: {
		VIEW: "Assignment.view",
		ADD: "Assignment.add",
		CHANGE: "Assignment.change",
		DELETE: "Assignment.delete",
		VIEW_OWN: "Assignment.view_own",
		CREATE: "Assignment.create",
		SUBMIT: "Assignment.submit",
		GRADE: "Assignment.grade",
	},
	QUIZ: {
		VIEW: "Quiz.view",
		ADD: "Quiz.add",
		CHANGE: "Quiz.change",
		DELETE: "Quiz.delete",
		CREATE: "Quiz.create",
		TAKE: "Quiz.take",
		GRADE: "Quiz.grade",
		VIEW_RESULTS: "Quiz.view_results",
		VIEW_OWN_RESULTS: "Quiz.view_own_results",
	},
	PROGRESS: {
		VIEW: "Progress.view",
		ADD: "Progress.add",
		CHANGE: "Progress.change",
		DELETE: "Progress.delete",
		VIEW_OWN: "Progress.view_own",
		VIEW_ENROLLED: "Progress.view_enrolled",
		TRACK: "Progress.track",
	},
	REVIEW: {
		VIEW: "Review.view",
		ADD: "Review.add",
		CHANGE: "Review.change",
		DELETE: "Review.delete",
		VIEW_OWN: "Review.view_own",
		MODERATE: "Review.moderate",
		APPROVE: "Review.approve",
	},
	RECORDING: {
		VIEW: "Recording.view",
		ADD: "Recording.add",
		CHANGE: "Recording.change",
		DELETE: "Recording.delete",
		VIEW_OWN: "Recording.view_own",
		DOWNLOAD: "Recording.download",
		DELETE_EXPIRED: "Recording.delete_expired",
	},
	SUBMISSION: {
		VIEW: "Submission.view",
		ADD: "Submission.add",
		CHANGE: "Submission.change",
		DELETE: "Submission.delete",
		VIEW_OWN: "Submission.view_own",
		SUBMIT: "Submission.submit",
		GRADE: "Submission.grade",
	},
	BLOG: {
		VIEW: "Blog.view",
		ADD: "Blog.add",
		CHANGE: "Blog.change",
		DELETE: "Blog.delete",
		VIEW_OWN: "Blog.view_own",
		PUBLISH: "Blog.publish",
		UNPUBLISH: "Blog.unpublish",
	},
	BLOG_CATEGORY: {
		VIEW: "BlogCategory.view",
		ADD: "BlogCategory.add",
		CHANGE: "BlogCategory.change",
		DELETE: "BlogCategory.delete",
	},
	BLOG_COMMENT: {
		VIEW: "BlogComment.view",
		ADD: "BlogComment.add",
		CHANGE: "BlogComment.change",
		DELETE: "BlogComment.delete",
		VIEW_OWN: "BlogComment.view_own",
		APPROVE: "BlogComment.approve",
		MODERATE: "BlogComment.moderate",
	},
	GUIDANCE: {
		VIEW: "Guidance.view",
		ADD: "Guidance.add",
		CHANGE: "Guidance.change",
		DELETE: "Guidance.delete",
	},
	FREE_SEMINAR: {
		VIEW: "FreeSeminar.view",
		ADD: "FreeSeminar.add",
		CHANGE: "FreeSeminar.change",
		DELETE: "FreeSeminar.delete",
	},
	TUTOR_REQUEST: {
		VIEW: "TutorRequest.view",
		ADD: "TutorRequest.add",
		CHANGE: "TutorRequest.change",
		DELETE: "TutorRequest.delete",
	},
	CONTACT_US: {
		VIEW: "ContactUs.view",
		ADD: "ContactUs.add",
		CHANGE: "ContactUs.change",
		DELETE: "ContactUs.delete",
	},
	NEWSLETTER: {
		VIEW: "Newsletter.view",
		ADD: "Newsletter.add",
		CHANGE: "Newsletter.change",
		DELETE: "Newsletter.delete",
	},
	QUESTION_BANK: {
		VIEW: "QuestionBank.view",
		ADD: "QuestionBank.add",
		CHANGE: "QuestionBank.change",
		DELETE: "QuestionBank.delete",
		IMPORT: "QuestionBank.import",
		EXPORT: "QuestionBank.export",
	},
	SAT_EXAM: {
		VIEW: "SATExam.view",
		ADD: "SATExam.add",
		CHANGE: "SATExam.change",
		DELETE: "SATExam.delete",
		TAKE: "SATExam.take",
		VIEW_RESULTS: "SATExam.view_results",
		VIEW_OWN_RESULTS: "SATExam.view_own_results",
	},
	TEACHER_PROFILE: {
		VIEW: "TeacherProfile.view",
		ADD: "TeacherProfile.add",
		CHANGE: "TeacherProfile.change",
		DELETE: "TeacherProfile.delete",
		VIEW_OWN: "TeacherProfile.view_own",
		UPDATE_OWN: "TeacherProfile.update_own",
	},
	AVAILABILITY: {
		VIEW: "Availability.view",
		ADD: "Availability.add",
		CHANGE: "Availability.change",
		DELETE: "Availability.delete",
		VIEW_OWN: "Availability.view_own",
		MANAGE_OWN: "Availability.manage_own",
	},
	AUDIT: {
		VIEW: "Audit.view",
		ADD: "Audit.add",
		CHANGE: "Audit.change",
		DELETE: "Audit.delete",
		VIEW_LOGS: "Audit.view_logs",
		EXPORT_LOGS: "Audit.export_logs",
	},
	AUDIT_LOG: {
		VIEW: "AuditLog.view",
		VIEW_OWN: "AuditLog.view_own",
		EXPORT: "AuditLog.export",
	},
} as const;
