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
  // Core System Modules
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

  // User Role Modules
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
  PARENT: {
    VIEW: "Parent.view",
    ADD: "Parent.add",
    CHANGE: "Parent.change",
    DELETE: "Parent.delete",
    VIEW_OWN: "Parent.view_own",
    LINK_CHILD: "Parent.link_child",
  },
  REFERRAL_USER: {
    VIEW: "ReferralUser.view",
    ADD: "ReferralUser.add",
    CHANGE: "ReferralUser.change",
    DELETE: "ReferralUser.delete",
    VIEW_OWN: "ReferralUser.view_own",
    TRACK_EARNINGS: "ReferralUser.track_earnings",
  },
  AFFILIATE_USER: {
    VIEW: "AffiliateUser.view",
    ADD: "AffiliateUser.add",
    CHANGE: "AffiliateUser.change",
    DELETE: "AffiliateUser.delete",
    VIEW_OWN: "AffiliateUser.view_own",
    TRACK_EARNINGS: "AffiliateUser.track_earnings",
  },
  AUDIT_LOG: {
    VIEW: "AuditLog.view",
    ADD: "AuditLog.add",
    CHANGE: "AuditLog.change",
    DELETE: "AuditLog.delete",
    VIEW_OWN: "AuditLog.view_own",
    EXPORT: "AuditLog.export",
  },

  // LMS Modules
  LMS_COURSE: {
    VIEW: "LMSCourse.view",
    ADD: "LMSCourse.add",
    CHANGE: "LMSCourse.change",
    DELETE: "LMSCourse.delete",
    VIEW_ENROLLED: "LMSCourse.view_enrolled",
    VIEW_OWN: "LMSCourse.view_own",
    PUBLISH: "LMSCourse.publish",
    UNPUBLISH: "LMSCourse.unpublish",
  },
  LMS_MODULE: {
    VIEW: "LMSModule.view",
    ADD: "LMSModule.add",
    CHANGE: "LMSModule.change",
    DELETE: "LMSModule.delete",
    VIEW_ENROLLED: "LMSModule.view_enrolled",
    UNLOCK: "LMSModule.unlock",
  },
  LMS_LESSON: {
    VIEW: "LMSLesson.view",
    ADD: "LMSLesson.add",
    CHANGE: "LMSLesson.change",
    DELETE: "LMSLesson.delete",
    VIEW_ENROLLED: "LMSLesson.view_enrolled",
    COMPLETE: "LMSLesson.complete",
  },
  LMS_QUIZ: {
    VIEW: "LMSQuiz.view",
    ADD: "LMSQuiz.add",
    CHANGE: "LMSQuiz.change",
    DELETE: "LMSQuiz.delete",
    CREATE: "LMSQuiz.create",
    TAKE: "LMSQuiz.take",
    GRADE: "LMSQuiz.grade",
    VIEW_RESULTS: "LMSQuiz.view_results",
    VIEW_OWN_RESULTS: "LMSQuiz.view_own_results",
  },
  LMS_QUIZ_QUESTION: {
    VIEW: "LMSQuizQuestion.view",
    ADD: "LMSQuizQuestion.add",
    CHANGE: "LMSQuizQuestion.change",
    DELETE: "LMSQuizQuestion.delete",
  },
  LMS_QUIZ_QUESTION_OPTION: {
    VIEW: "LMSQuizQuestionOption.view",
    ADD: "LMSQuizQuestionOption.add",
    CHANGE: "LMSQuizQuestionOption.change",
    DELETE: "LMSQuizQuestionOption.delete",
  },
  LMS_QUIZ_ATTEMPT: {
    VIEW: "LMSQuizAttempt.view",
    ADD: "LMSQuizAttempt.add",
    CHANGE: "LMSQuizAttempt.change",
    DELETE: "LMSQuizAttempt.delete",
    VIEW_OWN: "LMSQuizAttempt.view_own",
  },
  LMS_QUIZ_ANSWER: {
    VIEW: "LMSQuizAnswer.view",
    ADD: "LMSQuizAnswer.add",
    CHANGE: "LMSQuizAnswer.change",
    DELETE: "LMSQuizAnswer.delete",
    VIEW_OWN: "LMSQuizAnswer.view_own",
  },
  LMS_ENROLLMENT: {
    VIEW: "LMSEnrollment.view",
    ADD: "LMSEnrollment.add",
    CHANGE: "LMSEnrollment.change",
    DELETE: "LMSEnrollment.delete",
    VIEW_OWN: "LMSEnrollment.view_own",
    APPROVE: "LMSEnrollment.approve",
    REJECT: "LMSEnrollment.reject",
  },
  LMS_PROGRESS: {
    VIEW: "LMSProgress.view",
    ADD: "LMSProgress.add",
    CHANGE: "LMSProgress.change",
    DELETE: "LMSProgress.delete",
    VIEW_OWN: "LMSProgress.view_own",
    VIEW_ENROLLED: "LMSProgress.view_enrolled",
    TRACK: "LMSProgress.track",
  },
  LMS_DISCUSSION: {
    VIEW: "LMSDiscussion.view",
    ADD: "LMSDiscussion.add",
    CHANGE: "LMSDiscussion.change",
    DELETE: "LMSDiscussion.delete",
    CREATE_THREAD: "LMSDiscussion.create_thread",
    POST_MESSAGE: "LMSDiscussion.post_message",
    MODERATE: "LMSDiscussion.moderate",
  },
  LMS_REVIEW: {
    VIEW: "LMSReview.view",
    ADD: "LMSReview.add",
    CHANGE: "LMSReview.change",
    DELETE: "LMSReview.delete",
    VIEW_OWN: "LMSReview.view_own",
    MODERATE: "LMSReview.moderate",
    APPROVE: "LMSReview.approve",
  },

  // Coaching Modules
  COACHING_COURSE: {
    VIEW: "CoachingCourse.view",
    ADD: "CoachingCourse.add",
    CHANGE: "CoachingCourse.change",
    DELETE: "CoachingCourse.delete",
    VIEW_ENROLLED: "CoachingCourse.view_enrolled",
    VIEW_OWN: "CoachingCourse.view_own",
    PUBLISH: "CoachingCourse.publish",
    UNPUBLISH: "CoachingCourse.unpublish",
  },
  COACHING_MODULE: {
    VIEW: "CoachingModule.view",
    ADD: "CoachingModule.add",
    CHANGE: "CoachingModule.change",
    DELETE: "CoachingModule.delete",
    VIEW_ENROLLED: "CoachingModule.view_enrolled",
    UNLOCK: "CoachingModule.unlock",
  },
  COACHING_TOPIC: {
    VIEW: "CoachingTopic.view",
    ADD: "CoachingTopic.add",
    CHANGE: "CoachingTopic.change",
    DELETE: "CoachingTopic.delete",
    VIEW_ENROLLED: "CoachingTopic.view_enrolled",
  },
  COACHING_CONTENT: {
    VIEW: "CoachingContent.view",
    ADD: "CoachingContent.add",
    CHANGE: "CoachingContent.change",
    DELETE: "CoachingContent.delete",
    PUBLISH: "CoachingContent.publish",
    MODERATE: "CoachingContent.moderate",
    APPROVE: "CoachingContent.approve",
  },
  COACHING_ENROLLMENT: {
    VIEW: "CoachingEnrollment.view",
    ADD: "CoachingEnrollment.add",
    CHANGE: "CoachingEnrollment.change",
    DELETE: "CoachingEnrollment.delete",
    VIEW_OWN: "CoachingEnrollment.view_own",
    APPROVE: "CoachingEnrollment.approve",
    REJECT: "CoachingEnrollment.reject",
  },
  COACHING_PROGRESS: {
    VIEW: "CoachingProgress.view",
    ADD: "CoachingProgress.add",
    CHANGE: "CoachingProgress.change",
    DELETE: "CoachingProgress.delete",
    VIEW_OWN: "CoachingProgress.view_own",
    VIEW_ENROLLED: "CoachingProgress.view_enrolled",
    TRACK: "CoachingProgress.track",
  },
  COACHING_SUBMISSION: {
    VIEW: "CoachingSubmission.view",
    ADD: "CoachingSubmission.add",
    CHANGE: "CoachingSubmission.change",
    DELETE: "CoachingSubmission.delete",
    VIEW_OWN: "CoachingSubmission.view_own",
    SUBMIT: "CoachingSubmission.submit",
    GRADE: "CoachingSubmission.grade",
  },
  COACHING_ATTENDANCE: {
    VIEW: "CoachingAttendance.view",
    ADD: "CoachingAttendance.add",
    CHANGE: "CoachingAttendance.change",
    DELETE: "CoachingAttendance.delete",
    VIEW_OWN: "CoachingAttendance.view_own",
    MARK: "CoachingAttendance.mark",
    VIEW_REPORTS: "CoachingAttendance.view_reports",
  },
  COACHING_MODULE_EXAM: {
    VIEW: "CoachingModuleExam.view",
    ADD: "CoachingModuleExam.add",
    CHANGE: "CoachingModuleExam.change",
    DELETE: "CoachingModuleExam.delete",
    CREATE: "CoachingModuleExam.create",
    TAKE: "CoachingModuleExam.take",
    GRADE: "CoachingModuleExam.grade",
    PUBLISH: "CoachingModuleExam.publish",
    VIEW_RESULTS: "CoachingModuleExam.view_results",
    VIEW_OWN_RESULTS: "CoachingModuleExam.view_own_results",
  },
  COACHING_MODULE_EXAM_QUESTION: {
    VIEW: "CoachingModuleExamQuestion.view",
    ADD: "CoachingModuleExamQuestion.add",
    CHANGE: "CoachingModuleExamQuestion.change",
    DELETE: "CoachingModuleExamQuestion.delete",
  },
  COACHING_MODULE_EXAM_QUESTION_OPTION: {
    VIEW: "CoachingModuleExamQuestionOption.view",
    ADD: "CoachingModuleExamQuestionOption.add",
    CHANGE: "CoachingModuleExamQuestionOption.change",
    DELETE: "CoachingModuleExamQuestionOption.delete",
  },
  COACHING_MODULE_EXAM_ATTEMPT: {
    VIEW: "CoachingModuleExamAttempt.view",
    ADD: "CoachingModuleExamAttempt.add",
    CHANGE: "CoachingModuleExamAttempt.change",
    DELETE: "CoachingModuleExamAttempt.delete",
    VIEW_OWN: "CoachingModuleExamAttempt.view_own",
  },
  COACHING_MODULE_EXAM_ANSWER: {
    VIEW: "CoachingModuleExamAnswer.view",
    ADD: "CoachingModuleExamAnswer.add",
    CHANGE: "CoachingModuleExamAnswer.change",
    DELETE: "CoachingModuleExamAnswer.delete",
    VIEW_OWN: "CoachingModuleExamAnswer.view_own",
  },

  // One-to-One Tutoring Modules
  TEACHER_PROFILE: {
    VIEW: "TeacherProfile.view",
    ADD: "TeacherProfile.add",
    CHANGE: "TeacherProfile.change",
    DELETE: "TeacherProfile.delete",
    VIEW_OWN: "TeacherProfile.view_own",
    UPDATE_OWN: "TeacherProfile.update_own",
  },
  TEACHER_SPECIALIZATION: {
    VIEW: "TeacherSpecialization.view",
    ADD: "TeacherSpecialization.add",
    CHANGE: "TeacherSpecialization.change",
    DELETE: "TeacherSpecialization.delete",
  },
  TEACHER_AVAILABILITY: {
    VIEW: "TeacherAvailability.view",
    ADD: "TeacherAvailability.add",
    CHANGE: "TeacherAvailability.change",
    DELETE: "TeacherAvailability.delete",
    VIEW_OWN: "TeacherAvailability.view_own",
    MANAGE_OWN: "TeacherAvailability.manage_own",
  },
  ONE_TO_ONE_SESSION: {
    VIEW: "OneToOneSession.view",
    ADD: "OneToOneSession.add",
    CHANGE: "OneToOneSession.change",
    DELETE: "OneToOneSession.delete",
    VIEW_OWN: "OneToOneSession.view_own",
    SCHEDULE: "OneToOneSession.schedule",
    CANCEL: "OneToOneSession.cancel",
    CONDUCT: "OneToOneSession.conduct",
    JOIN: "OneToOneSession.join",
  },
  SESSION_RECORDING: {
    VIEW: "SessionRecording.view",
    ADD: "SessionRecording.add",
    CHANGE: "SessionRecording.change",
    DELETE: "SessionRecording.delete",
    VIEW_OWN: "SessionRecording.view_own",
    DOWNLOAD: "SessionRecording.download",
    DELETE_EXPIRED: "SessionRecording.delete_expired",
  },
  ONE_TO_ONE_REVIEW: {
    VIEW: "OneToOneReview.view",
    ADD: "OneToOneReview.add",
    CHANGE: "OneToOneReview.change",
    DELETE: "OneToOneReview.delete",
    VIEW_OWN: "OneToOneReview.view_own",
    MODERATE: "OneToOneReview.moderate",
    APPROVE: "OneToOneReview.approve",
  },

  // Payment Modules
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

  // SAT Practice & Question Bank Modules
  TEST_TYPE: {
    VIEW: "TestType.view",
    ADD: "TestType.add",
    CHANGE: "TestType.change",
    DELETE: "TestType.delete",
  },
  SUBJECT: {
    VIEW: "Subject.view",
    ADD: "Subject.add",
    CHANGE: "Subject.change",
    DELETE: "Subject.delete",
  },
  DIFFICULTY: {
    VIEW: "Difficulty.view",
    ADD: "Difficulty.add",
    CHANGE: "Difficulty.change",
    DELETE: "Difficulty.delete",
  },
  DOMAIN: {
    VIEW: "Domain.view",
    ADD: "Domain.add",
    CHANGE: "Domain.change",
    DELETE: "Domain.delete",
  },
  SKILL: {
    VIEW: "Skill.view",
    ADD: "Skill.add",
    CHANGE: "Skill.change",
    DELETE: "Skill.delete",
  },
  QUESTION_BANK: {
    VIEW: "QuestionBank.view",
    ADD: "QuestionBank.add",
    CHANGE: "QuestionBank.change",
    DELETE: "QuestionBank.delete",
    IMPORT: "QuestionBank.import",
    EXPORT: "QuestionBank.export",
  },
  OPTIONS: {
    VIEW: "Options.view",
    ADD: "Options.add",
    CHANGE: "Options.change",
    DELETE: "Options.delete",
  },
  FILL_BLANK: {
    VIEW: "FillBlank.view",
    ADD: "FillBlank.add",
    CHANGE: "FillBlank.change",
    DELETE: "FillBlank.delete",
  },
  SAT_PRACTICE: {
    VIEW: "SATPractice.view",
    ADD: "SATPractice.add",
    CHANGE: "SATPractice.change",
    DELETE: "SATPractice.delete",
    TAKE: "SATPractice.take",
    VIEW_RESULTS: "SATPractice.view_results",
    VIEW_OWN_RESULTS: "SATPractice.view_own_results",
  },
  SECTION: {
    VIEW: "Section.view",
    ADD: "Section.add",
    CHANGE: "Section.change",
    DELETE: "Section.delete",
  },
  MODULE: {
    VIEW: "Module.view",
    ADD: "Module.add",
    CHANGE: "Module.change",
    DELETE: "Module.delete",
  },
  STUDENT_SAT_ATTEMPT: {
    VIEW: "StudentSATAttempt.view",
    ADD: "StudentSATAttempt.add",
    CHANGE: "StudentSATAttempt.change",
    DELETE: "StudentSATAttempt.delete",
    VIEW_OWN: "StudentSATAttempt.view_own",
  },
  STUDENT_SECTION_PROGRESS: {
    VIEW: "StudentSectionProgress.view",
    ADD: "StudentSectionProgress.add",
    CHANGE: "StudentSectionProgress.change",
    DELETE: "StudentSectionProgress.delete",
    VIEW_OWN: "StudentSectionProgress.view_own",
  },
  STUDENT_MODULE_PROGRESS: {
    VIEW: "StudentModuleProgress.view",
    ADD: "StudentModuleProgress.add",
    CHANGE: "StudentModuleProgress.change",
    DELETE: "StudentModuleProgress.delete",
    VIEW_OWN: "StudentModuleProgress.view_own",
  },
  STUDENT_ANSWER: {
    VIEW: "StudentAnswer.view",
    ADD: "StudentAnswer.add",
    CHANGE: "StudentAnswer.change",
    DELETE: "StudentAnswer.delete",
    VIEW_OWN: "StudentAnswer.view_own",
  },
  STUDENT_ANSWER_OPTION: {
    VIEW: "StudentAnswerOption.view",
    ADD: "StudentAnswerOption.add",
    CHANGE: "StudentAnswerOption.change",
    DELETE: "StudentAnswerOption.delete",
    VIEW_OWN: "StudentAnswerOption.view_own",
  },

  // Website & Marketing Modules
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
  TUTOR_REQUEST_REGISTRATION: {
    VIEW: "TutorRequestRegistration.view",
    ADD: "TutorRequestRegistration.add",
    CHANGE: "TutorRequestRegistration.change",
    DELETE: "TutorRequestRegistration.delete",
  },
  NEWS_LETTER: {
    VIEW: "NewsLetter.view",
    ADD: "NewsLetter.add",
    CHANGE: "NewsLetter.change",
    DELETE: "NewsLetter.delete",
  },
  TRUSTED_COMPANIES: {
    VIEW: "TrustedCompanies.view",
    ADD: "TrustedCompanies.add",
    CHANGE: "TrustedCompanies.change",
    DELETE: "TrustedCompanies.delete",
  },
  COLLEGE_ESSAY_REVIEW: {
    VIEW: "CollegeEssayReview.view",
    ADD: "CollegeEssayReview.add",
    CHANGE: "CollegeEssayReview.change",
    DELETE: "CollegeEssayReview.delete",
  },
  CONTACT_US: {
    VIEW: "ContactUs.view",
    ADD: "ContactUs.add",
    CHANGE: "ContactUs.change",
    DELETE: "ContactUs.delete",
  },
  CATEGORY: {
    VIEW: "Category.view",
    ADD: "Category.add",
    CHANGE: "Category.change",
    DELETE: "Category.delete",
  },
  BLOG_CATEGORY: {
    VIEW: "BlogCategory.view",
    ADD: "BlogCategory.add",
    CHANGE: "BlogCategory.change",
    DELETE: "BlogCategory.delete",
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
  BLOG_COMMENT: {
    VIEW: "BlogComment.view",
    ADD: "BlogComment.add",
    CHANGE: "BlogComment.change",
    DELETE: "BlogComment.delete",
    VIEW_OWN: "BlogComment.view_own",
    APPROVE: "BlogComment.approve",
    MODERATE: "BlogComment.moderate",
  },
} as const;
