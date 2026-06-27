import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "@/generated/client";
import logger from "./logger";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    logger.info("Starting database seeding...");

    // 1️⃣ Define role configurations (dynamic/configurable)
    const roleConfigs = [
      {
        name: "SuperAdmin",
        description:
          "Full system access - can manage everything including users, roles, and permissions",
        isActive: true,
        assignAllPermissions: true, // Special flag for super admin
      },
      {
        name: "Admin",
        description:
          "Administrative staff with broad access except sensitive operations",
        isActive: true,
      },
      {
        name: "Student",
        description:
          "Enrolled students accessing courses, tests, and learning materials",
        isActive: true,
      },
      {
        name: "Teacher",
        description:
          "One-to-one tutors providing personalized coaching and sessions",
        isActive: true,
      },
      {
        name: "Instructor",
        description: "LMS course creators and content instructors",
        isActive: true,
      },
      {
        name: "Parent",
        description: "Parents/guardians monitoring their children's progress",
        isActive: true,
      },
      {
        name: "Affiliate",
        description: "Affiliate partners who refer students for commission",
        isActive: true,
      },
      {
        name: "Referral",
        description: "Individual referral users earning from student referrals",
        isActive: true,
      },
      {
        name: "ContentManager",
        description:
          "Content management team for website and marketing materials",
        isActive: true,
      },
      {
        name: "Accountant",
        description: "Finance team managing payments, billing, and invoices",
        isActive: true,
      },
      {
        name: "Support",
        description: "Customer support team assisting users",
        isActive: true,
      },
    ];

    // Create roles dynamically
    for (const roleConfig of roleConfigs) {
      await prisma.role.upsert({
        where: { name: roleConfig.name },
        update: {
          description: roleConfig.description,
          isActive: roleConfig.isActive,
        },
        create: {
          name: roleConfig.name,
          description: roleConfig.description,
          isActive: roleConfig.isActive,
        },
      });
    }

    // 2️⃣ Create default + custom permissions
    const modules = [
      // User Management
      "User",
      "Role",
      "Permission",
      "SystemUser",
      "Student",
      "Teacher",
      "Parent",
      "ReferralUser",
      "AffiliateUser",
      "AuditLog",

      // LMS (Self-Paced Learning)
      "LMSCourse",
      "LMSModule",
      "LMSLesson",
      "LMSQuiz",
      "LMSQuizQuestion",
      "LMSQuizQuestionOption",
      "LMSQuizAttempt",
      "LMSQuizAnswer",
      "LMSEnrollment",
      "LMSProgress",
      "LMSDiscussion",
      "LMSReview",

      // Coaching (Institution-Led)
      "CoachingCourse",
      "CoachingModule",
      "CoachingTopic",
      "CoachingContent",
      "CoachingEnrollment",
      "CoachingProgress",
      "CoachingSubmission",
      "CoachingAttendance",
      "CoachingModuleExam",
      "CoachingModuleExamQuestion",
      "CoachingModuleExamQuestionOption",
      "CoachingModuleExamAttempt",
      "CoachingModuleExamAnswer",

      // One-to-One Coaching
      "TeacherProfile",
      "TeacherSpecialization",
      "TeacherAvailability",
      "OneToOneSession",
      "SessionRecording",
      "OneToOneReview",

      // Payment System
      "Payment",
      "PaymentPlan",
      "Invoice",
      "Refund",

      // SAT Practice
      "TestType",
      "Subject",
      "Difficulty",
      "Domain",
      "Skill",
      "QuestionBank",
      "Options",
      "FillBlank",
      "SATPractice",
      "Section",
      "Module",
      "StudentSATAttempt",
      "StudentSectionProgress",
      "StudentModuleProgress",
      "StudentAnswer",
      "StudentAnswerOption",

      // Services & Marketing
      "Guidance",
      "FreeSeminar",
      "TutorRequestRegistration",
      "NewsLetter",
      "TrustedCompanies",
      "CollegeEssayReview",
      "ContactUs",
      "BlogCategory",
      "Blog",
      "BlogComment",
    ];
    const defaultActions = ["view", "add", "change", "delete"];
    const permissionsToUpsert = [];

    for (const moduleName of modules) {
      for (const action of defaultActions) {
        permissionsToUpsert.push({
          codeName: `${moduleName}.${action}`,
          moduleName,
          label: `${
            action.charAt(0).toUpperCase() + action.slice(1)
          } ${moduleName}`,
          scope: "all",
        });
      }
    }

    const customPermissions = [
      // User self-management permissions
      {
        codeName: "User.change_own_password",
        moduleName: "User",
        label: "Change Own Password",
        scope: "own",
      },
      {
        codeName: "User.update_own_password",
        moduleName: "User",
        label: "Update Own Profile",
        scope: "own",
      },
      {
        codeName: "User.view_own",
        moduleName: "User",
        label: "View Own Profile",
        scope: "own",
      },
      // LMS Course permissions
      {
        codeName: "LMSCourse.publish",
        moduleName: "LMSCourse",
        label: "Publish LMS Course",
        scope: "all",
      },
      {
        codeName: "LMSCourse.unpublish",
        moduleName: "LMSCourse",
        label: "Unpublish LMS Course",
        scope: "all",
      },
      {
        codeName: "LMSCourse.view_enrolled",
        moduleName: "LMSCourse",
        label: "View Enrolled LMS Courses",
        scope: "enrolled",
      },
      {
        codeName: "LMSCourse.view_own",
        moduleName: "LMSCourse",
        label: "View Own LMS Courses",
        scope: "own",
      },
      // Coaching Course permissions
      {
        codeName: "CoachingCourse.publish",
        moduleName: "CoachingCourse",
        label: "Publish Coaching Course",
        scope: "all",
      },
      {
        codeName: "CoachingCourse.unpublish",
        moduleName: "CoachingCourse",
        label: "Unpublish Coaching Course",
        scope: "all",
      },
      {
        codeName: "CoachingCourse.view_enrolled",
        moduleName: "CoachingCourse",
        label: "View Enrolled Coaching Courses",
        scope: "enrolled",
      },
      {
        codeName: "CoachingCourse.view_own",
        moduleName: "CoachingCourse",
        label: "View Own Coaching Courses",
        scope: "own",
      },
      // LMS Enrollment permissions
      {
        codeName: "LMSEnrollment.approve",
        moduleName: "LMSEnrollment",
        label: "Approve LMS Enrollment",
        scope: "all",
      },
      {
        codeName: "LMSEnrollment.reject",
        moduleName: "LMSEnrollment",
        label: "Reject LMS Enrollment",
        scope: "all",
      },
      {
        codeName: "LMSEnrollment.view_own",
        moduleName: "LMSEnrollment",
        label: "View Own LMS Enrollments",
        scope: "own",
      },
      // Coaching Enrollment permissions
      {
        codeName: "CoachingEnrollment.approve",
        moduleName: "CoachingEnrollment",
        label: "Approve Coaching Enrollment",
        scope: "all",
      },
      {
        codeName: "CoachingEnrollment.reject",
        moduleName: "CoachingEnrollment",
        label: "Reject Coaching Enrollment",
        scope: "all",
      },
      {
        codeName: "CoachingEnrollment.view_own",
        moduleName: "CoachingEnrollment",
        label: "View Own Coaching Enrollments",
        scope: "own",
      },
      // Student permissions
      {
        codeName: "Student.promote",
        moduleName: "Student",
        label: "Promote Student",
        scope: "all",
      },
      {
        codeName: "Student.track_progress",
        moduleName: "Student",
        label: "Track Student Progress",
        scope: "all",
      },
      {
        codeName: "Student.view_enrolled",
        moduleName: "Student",
        label: "View Enrolled Students",
        scope: "enrolled",
      },
      {
        codeName: "Student.view_children",
        moduleName: "Student",
        label: "View Own Children",
        scope: "children",
      },
      {
        codeName: "Student.view_referred",
        moduleName: "Student",
        label: "View Referred Students",
        scope: "referred",
      },
      {
        codeName: "Student.view_own",
        moduleName: "Student",
        label: "View Own Student Profile",
        scope: "own",
      },
      // Coaching Content permissions
      {
        codeName: "CoachingContent.publish",
        moduleName: "CoachingContent",
        label: "Publish Coaching Content",
        scope: "all",
      },
      {
        codeName: "CoachingContent.moderate",
        moduleName: "CoachingContent",
        label: "Moderate Coaching Content",
        scope: "all",
      },
      {
        codeName: "CoachingContent.approve",
        moduleName: "CoachingContent",
        label: "Approve Coaching Content",
        scope: "all",
      },
      // LMS Discussion permissions
      {
        codeName: "LMSDiscussion.create_thread",
        moduleName: "LMSDiscussion",
        label: "Create LMS Discussion Thread",
        scope: "all",
      },
      {
        codeName: "LMSDiscussion.post_message",
        moduleName: "LMSDiscussion",
        label: "Post LMS Discussion Message",
        scope: "all",
      },
      {
        codeName: "LMSDiscussion.moderate",
        moduleName: "LMSDiscussion",
        label: "Moderate LMS Discussion",
        scope: "all",
      },
      // One-to-One Session permissions
      {
        codeName: "OneToOneSession.schedule",
        moduleName: "OneToOneSession",
        label: "Schedule One-to-One Session",
        scope: "all",
      },
      {
        codeName: "OneToOneSession.cancel",
        moduleName: "OneToOneSession",
        label: "Cancel One-to-One Session",
        scope: "all",
      },
      {
        codeName: "OneToOneSession.conduct",
        moduleName: "OneToOneSession",
        label: "Conduct One-to-One Session",
        scope: "all",
      },
      {
        codeName: "OneToOneSession.join",
        moduleName: "OneToOneSession",
        label: "Join One-to-One Session",
        scope: "all",
      },
      {
        codeName: "OneToOneSession.view_own",
        moduleName: "OneToOneSession",
        label: "View Own One-to-One Sessions",
        scope: "own",
      },
      // Coaching Attendance permissions
      {
        codeName: "CoachingAttendance.mark",
        moduleName: "CoachingAttendance",
        label: "Mark Coaching Attendance",
        scope: "all",
      },
      {
        codeName: "CoachingAttendance.view_reports",
        moduleName: "CoachingAttendance",
        label: "View Coaching Attendance Reports",
        scope: "all",
      },
      {
        codeName: "CoachingAttendance.view_own",
        moduleName: "CoachingAttendance",
        label: "View Own Coaching Attendance",
        scope: "own",
      },
      // Payment permissions
      {
        codeName: "Payment.process",
        moduleName: "Payment",
        label: "Process Payment",
        scope: "all",
      },
      {
        codeName: "Payment.refund",
        moduleName: "Payment",
        label: "Refund Payment",
        scope: "all",
      },
      {
        codeName: "Payment.view_reports",
        moduleName: "Payment",
        label: "View Payment Reports",
        scope: "all",
      },
      {
        codeName: "Payment.view_own",
        moduleName: "Payment",
        label: "View Own Payments",
        scope: "own",
      },
      // Blog permissions
      {
        codeName: "Blog.publish",
        moduleName: "Blog",
        label: "Publish Blog",
        scope: "all",
      },
      {
        codeName: "Blog.unpublish",
        moduleName: "Blog",
        label: "Unpublish Blog",
        scope: "all",
      },
      {
        codeName: "Blog.view_own",
        moduleName: "Blog",
        label: "View Own Blogs",
        scope: "own",
      },
      // BlogComment permissions
      {
        codeName: "BlogComment.approve",
        moduleName: "BlogComment",
        label: "Approve Comment",
        scope: "all",
      },
      {
        codeName: "BlogComment.moderate",
        moduleName: "BlogComment",
        label: "Moderate Comment",
        scope: "all",
      },
      {
        codeName: "BlogComment.view_own",
        moduleName: "BlogComment",
        label: "View Own Comments",
        scope: "own",
      },
      // LMS Quiz permissions
      {
        codeName: "LMSQuiz.create",
        moduleName: "LMSQuiz",
        label: "Create LMS Quiz",
        scope: "all",
      },
      {
        codeName: "LMSQuiz.take",
        moduleName: "LMSQuiz",
        label: "Take LMS Quiz",
        scope: "all",
      },
      {
        codeName: "LMSQuiz.grade",
        moduleName: "LMSQuiz",
        label: "Grade LMS Quiz",
        scope: "all",
      },
      {
        codeName: "LMSQuiz.view_results",
        moduleName: "LMSQuiz",
        label: "View LMS Quiz Results",
        scope: "all",
      },
      {
        codeName: "LMSQuiz.view_own_results",
        moduleName: "LMSQuiz",
        label: "View Own LMS Quiz Results",
        scope: "own",
      },
      // Coaching Module Exam permissions
      {
        codeName: "CoachingModuleExam.create",
        moduleName: "CoachingModuleExam",
        label: "Create Coaching Module Exam",
        scope: "all",
      },
      {
        codeName: "CoachingModuleExam.take",
        moduleName: "CoachingModuleExam",
        label: "Take Coaching Module Exam",
        scope: "all",
      },
      {
        codeName: "CoachingModuleExam.grade",
        moduleName: "CoachingModuleExam",
        label: "Grade Coaching Module Exam",
        scope: "all",
      },
      {
        codeName: "CoachingModuleExam.publish",
        moduleName: "CoachingModuleExam",
        label: "Publish Coaching Module Exam",
        scope: "all",
      },
      {
        codeName: "CoachingModuleExam.view_results",
        moduleName: "CoachingModuleExam",
        label: "View Coaching Module Exam Results",
        scope: "all",
      },
      {
        codeName: "CoachingModuleExam.view_own_results",
        moduleName: "CoachingModuleExam",
        label: "View Own Coaching Module Exam Results",
        scope: "own",
      },
      // LMS Progress permissions
      {
        codeName: "LMSProgress.view_own",
        moduleName: "LMSProgress",
        label: "View Own LMS Progress",
        scope: "own",
      },
      {
        codeName: "LMSProgress.view_enrolled",
        moduleName: "LMSProgress",
        label: "View Enrolled Students LMS Progress",
        scope: "enrolled",
      },
      {
        codeName: "LMSProgress.track",
        moduleName: "LMSProgress",
        label: "Track LMS Progress",
        scope: "all",
      },
      // Coaching Progress permissions
      {
        codeName: "CoachingProgress.view_own",
        moduleName: "CoachingProgress",
        label: "View Own Coaching Progress",
        scope: "own",
      },
      {
        codeName: "CoachingProgress.view_enrolled",
        moduleName: "CoachingProgress",
        label: "View Enrolled Students Coaching Progress",
        scope: "enrolled",
      },
      {
        codeName: "CoachingProgress.track",
        moduleName: "CoachingProgress",
        label: "Track Coaching Progress",
        scope: "all",
      },
      // LMS Review permissions
      {
        codeName: "LMSReview.view_own",
        moduleName: "LMSReview",
        label: "View Own LMS Reviews",
        scope: "own",
      },
      {
        codeName: "LMSReview.moderate",
        moduleName: "LMSReview",
        label: "Moderate LMS Reviews",
        scope: "all",
      },
      {
        codeName: "LMSReview.approve",
        moduleName: "LMSReview",
        label: "Approve LMS Review",
        scope: "all",
      },
      // One-to-One Review permissions
      {
        codeName: "OneToOneReview.view_own",
        moduleName: "OneToOneReview",
        label: "View Own One-to-One Reviews",
        scope: "own",
      },
      {
        codeName: "OneToOneReview.moderate",
        moduleName: "OneToOneReview",
        label: "Moderate One-to-One Reviews",
        scope: "all",
      },
      {
        codeName: "OneToOneReview.approve",
        moduleName: "OneToOneReview",
        label: "Approve One-to-One Review",
        scope: "all",
      },
      // Session Recording permissions
      {
        codeName: "SessionRecording.download",
        moduleName: "SessionRecording",
        label: "Download Session Recording",
        scope: "all",
      },
      {
        codeName: "SessionRecording.view_own",
        moduleName: "SessionRecording",
        label: "View Own Session Recordings",
        scope: "own",
      },
      {
        codeName: "SessionRecording.delete_expired",
        moduleName: "SessionRecording",
        label: "Delete Expired Session Recordings",
        scope: "all",
      },
      // Coaching Submission permissions
      {
        codeName: "CoachingSubmission.view_own",
        moduleName: "CoachingSubmission",
        label: "View Own Coaching Submissions",
        scope: "own",
      },
      {
        codeName: "CoachingSubmission.grade",
        moduleName: "CoachingSubmission",
        label: "Grade Coaching Submission",
        scope: "all",
      },
      {
        codeName: "CoachingSubmission.submit",
        moduleName: "CoachingSubmission",
        label: "Submit Coaching Work",
        scope: "all",
      },
      // Invoice permissions
      {
        codeName: "Invoice.generate",
        moduleName: "Invoice",
        label: "Generate Invoice",
        scope: "all",
      },
      {
        codeName: "Invoice.send",
        moduleName: "Invoice",
        label: "Send Invoice",
        scope: "all",
      },
      {
        codeName: "Invoice.view_own",
        moduleName: "Invoice",
        label: "View Own Invoices",
        scope: "own",
      },
      // Refund permissions
      {
        codeName: "Refund.process",
        moduleName: "Refund",
        label: "Process Refund",
        scope: "all",
      },
      {
        codeName: "Refund.approve",
        moduleName: "Refund",
        label: "Approve Refund",
        scope: "all",
      },
      {
        codeName: "Refund.view_own",
        moduleName: "Refund",
        label: "View Own Refunds",
        scope: "own",
      },
      // PaymentPlan permissions
      {
        codeName: "PaymentPlan.create",
        moduleName: "PaymentPlan",
        label: "Create Payment Plan",
        scope: "all",
      },
      {
        codeName: "PaymentPlan.modify",
        moduleName: "PaymentPlan",
        label: "Modify Payment Plan",
        scope: "all",
      },
      {
        codeName: "PaymentPlan.view_own",
        moduleName: "PaymentPlan",
        label: "View Own Payment Plans",
        scope: "own",
      },
      // LMS Module permissions
      {
        codeName: "LMSModule.view_enrolled",
        moduleName: "LMSModule",
        label: "View Enrolled LMS Modules",
        scope: "enrolled",
      },
      {
        codeName: "LMSModule.unlock",
        moduleName: "LMSModule",
        label: "Unlock LMS Module",
        scope: "all",
      },
      // LMS Lesson permissions
      {
        codeName: "LMSLesson.view_enrolled",
        moduleName: "LMSLesson",
        label: "View Enrolled LMS Lessons",
        scope: "enrolled",
      },
      {
        codeName: "LMSLesson.complete",
        moduleName: "LMSLesson",
        label: "Complete LMS Lesson",
        scope: "all",
      },
      // Coaching Module permissions
      {
        codeName: "CoachingModule.view_enrolled",
        moduleName: "CoachingModule",
        label: "View Enrolled Coaching Modules",
        scope: "enrolled",
      },
      {
        codeName: "CoachingModule.unlock",
        moduleName: "CoachingModule",
        label: "Unlock Coaching Module",
        scope: "all",
      },
      // Coaching Topic permissions
      {
        codeName: "CoachingTopic.view_enrolled",
        moduleName: "CoachingTopic",
        label: "View Enrolled Coaching Topics",
        scope: "enrolled",
      },
      // QuestionBank permissions
      {
        codeName: "QuestionBank.import",
        moduleName: "QuestionBank",
        label: "Import Questions",
        scope: "all",
      },
      {
        codeName: "QuestionBank.export",
        moduleName: "QuestionBank",
        label: "Export Questions",
        scope: "all",
      },
      // SATPractice permissions
      {
        codeName: "SATPractice.take",
        moduleName: "SATPractice",
        label: "Take SAT Practice",
        scope: "all",
      },
      {
        codeName: "SATPractice.view_results",
        moduleName: "SATPractice",
        label: "View SAT Practice Results",
        scope: "all",
      },
      {
        codeName: "SATPractice.view_own_results",
        moduleName: "SATPractice",
        label: "View Own SAT Practice Results",
        scope: "own",
      },
      // TeacherProfile permissions
      {
        codeName: "TeacherProfile.view_own",
        moduleName: "TeacherProfile",
        label: "View Own Profile",
        scope: "own",
      },
      {
        codeName: "TeacherProfile.update_own",
        moduleName: "TeacherProfile",
        label: "Update Own Profile",
        scope: "own",
      },
      // Teacher Availability permissions
      {
        codeName: "TeacherAvailability.manage_own",
        moduleName: "TeacherAvailability",
        label: "Manage Own Teacher Availability",
        scope: "own",
      },
      {
        codeName: "TeacherAvailability.view_own",
        moduleName: "TeacherAvailability",
        label: "View Own Teacher Availability",
        scope: "own",
      },
      // Role permissions
      {
        codeName: "Role.assign",
        moduleName: "Role",
        label: "Assign Role",
        scope: "all",
      },
      // Permission permissions
      {
        codeName: "Permission.assign",
        moduleName: "Permission",
        label: "Assign Permission",
        scope: "all",
      },
      // SystemUser permissions
      {
        codeName: "SystemUser.view_own",
        moduleName: "SystemUser",
        label: "View Own System User Profile",
        scope: "own",
      },
      // Teacher permissions
      {
        codeName: "Teacher.view_own",
        moduleName: "Teacher",
        label: "View Own Teacher Profile",
        scope: "own",
      },
      // Parent permissions
      {
        codeName: "Parent.view_own",
        moduleName: "Parent",
        label: "View Own Parent Profile",
        scope: "own",
      },
      {
        codeName: "Parent.link_child",
        moduleName: "Parent",
        label: "Link Child",
        scope: "own",
      },
      // Referral User permissions
      {
        codeName: "ReferralUser.view_own",
        moduleName: "ReferralUser",
        label: "View Own Referrals",
        scope: "own",
      },
      {
        codeName: "ReferralUser.track_earnings",
        moduleName: "ReferralUser",
        label: "Track Referral Earnings",
        scope: "own",
      },
      // Affiliate User permissions
      {
        codeName: "AffiliateUser.view_own",
        moduleName: "AffiliateUser",
        label: "View Own Affiliate Data",
        scope: "own",
      },
      {
        codeName: "AffiliateUser.track_earnings",
        moduleName: "AffiliateUser",
        label: "Track Affiliate Earnings",
        scope: "own",
      },
    ];

    const allPermissions = [...permissionsToUpsert, ...customPermissions];

    const createdPermissions = [];
    for (const perm of allPermissions) {
      const permission = await prisma.permission.upsert({
        where: { codeName: perm.codeName },
        update: {},
        create: perm,
      });
      createdPermissions.push(permission);
    }

    // 3️⃣ Build permission map for easy lookup
    const permissionMap = createdPermissions.reduce(
      (acc, perm) => {
        acc[perm.codeName] = perm.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    // 3.1️⃣ Define role-permission mappings (dynamic configuration)
    const rolePermissionMappings: Record<string, string[] | "ALL"> = {
      SuperAdmin: "ALL", // Gets all permissions

      Admin: createdPermissions
        .filter(
          (p) =>
            !p.codeName.includes("User.delete") &&
            !p.codeName.includes("Audit.delete") &&
            p.codeName !== "Payment.refund",
        )
        .map((p) => p.codeName),

      Instructor: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        // LMS Course management
        "LMSCourse.view",
        "LMSCourse.add",
        "LMSCourse.change",
        "LMSCourse.publish",
        "LMSCourse.unpublish",
        "LMSCourse.view_own",
        // Coaching Course management
        "CoachingCourse.view",
        "CoachingCourse.add",
        "CoachingCourse.change",
        "CoachingCourse.publish",
        "CoachingCourse.unpublish",
        "CoachingCourse.view_own",
        "CoachingCourse.delete",
        // LMS Module & Lesson management
        "LMSModule.view",
        "LMSModule.add",
        "LMSModule.change",
        "LMSModule.unlock",
        "LMSLesson.view",
        "LMSLesson.add",
        "LMSLesson.change",
        // Coaching Module & Topic management
        "CoachingModule.view",
        "CoachingModule.add",
        "CoachingModule.change",
        "CoachingModule.unlock",
        "CoachingTopic.view",
        "CoachingTopic.add",
        "CoachingTopic.change",
        // Enrollment
        "LMSEnrollment.view",
        "LMSEnrollment.approve",
        "CoachingEnrollment.view",
        "CoachingEnrollment.approve",
        // Student tracking
        "Student.view",
        "Student.view_enrolled",
        "Student.track_progress",
        // Coaching Content
        "CoachingContent.view",
        "CoachingContent.add",
        "CoachingContent.change",
        // LMS Discussion
        "LMSDiscussion.view",
        "LMSDiscussion.create_thread",
        "LMSDiscussion.post_message",
        "LMSDiscussion.moderate",
        // LMS Quiz & Coaching Exam
        "LMSQuiz.view",
        "LMSQuiz.create",
        "LMSQuiz.change",
        "LMSQuiz.grade",
        "LMSQuiz.view_results",
        "CoachingModuleExam.view",
        "CoachingModuleExam.create",
        "CoachingModuleExam.change",
        "CoachingModuleExam.grade",
        "CoachingModuleExam.view_results",
        // Coaching Submissions
        "CoachingSubmission.view",
        "CoachingSubmission.grade",
        // Progress tracking
        "LMSProgress.view",
        "LMSProgress.view_enrolled",
        "LMSProgress.track",
        "CoachingProgress.view",
        "CoachingProgress.view_enrolled",
        "CoachingProgress.track",
      ],

      Teacher: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        "Teacher.view_own",
        "TeacherProfile.view_own",
        "TeacherProfile.update_own",
        // Coaching Course management
        "CoachingCourse.view",
        "CoachingCourse.add",
        "CoachingCourse.change",
        "CoachingCourse.publish",
        "CoachingCourse.unpublish",
        "CoachingCourse.view_own",
        "CoachingCourse.delete",
        // Coaching Module & Topic management
        "CoachingModule.view",
        "CoachingModule.add",
        "CoachingModule.change",
        "CoachingModule.unlock",
        "CoachingTopic.view",
        "CoachingTopic.add",
        "CoachingTopic.change",
        // Availability management
        "TeacherAvailability.view",
        "TeacherAvailability.view_own",
        "TeacherAvailability.manage_own",
        // Student management (enrolled only)
        "Student.view_enrolled",
        "Student.track_progress",
        // Session management
        "OneToOneSession.view",
        "OneToOneSession.schedule",
        "OneToOneSession.conduct",
        "OneToOneSession.cancel",
        "OneToOneSession.join",
        "OneToOneSession.view_own",
        // Recording management
        "SessionRecording.view",
        "SessionRecording.view_own",
        "SessionRecording.download",
        // Attendance
        "CoachingAttendance.view",
        "CoachingAttendance.mark",
        "CoachingAttendance.view_reports",
        // Coaching Submissions
        "CoachingSubmission.view",
        "CoachingSubmission.grade",
        // LMS Discussion
        "LMSDiscussion.view",
        "LMSDiscussion.create_thread",
        "LMSDiscussion.post_message",
        // Progress tracking
        "LMSProgress.view",
        "LMSProgress.view_enrolled",
        "LMSProgress.track",
        "CoachingProgress.view",
        "CoachingProgress.view_enrolled",
        "CoachingProgress.track",
        // Payment (own only)
        "Payment.view_own",
      ],

      Student: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        "Student.view_own",
        // LMS Course access
        "LMSCourse.view",
        "LMSCourse.view_enrolled",
        "LMSModule.view",
        "LMSModule.view_enrolled",
        "LMSLesson.view",
        "LMSLesson.view_enrolled",
        "LMSLesson.complete",
        // Coaching Course access
        "CoachingCourse.view",
        "CoachingCourse.view_enrolled",
        "CoachingModule.view",
        "CoachingModule.view_enrolled",
        "CoachingTopic.view",
        "CoachingTopic.view_enrolled",
        "CoachingContent.view",
        // Enrollment
        "LMSEnrollment.view_own",
        "CoachingEnrollment.view_own",
        // LMS Discussion
        "LMSDiscussion.view",
        "LMSDiscussion.create_thread",
        "LMSDiscussion.post_message",
        // One-to-One Sessions
        "OneToOneSession.view",
        "OneToOneSession.view_own",
        "OneToOneSession.join",
        // Recording
        "SessionRecording.view_own",
        "SessionRecording.download",
        // Attendance
        "CoachingAttendance.view_own",
        // Coaching Submissions
        "CoachingSubmission.view_own",
        "CoachingSubmission.submit",
        // LMS Quizzes & Coaching Exams
        "LMSQuiz.view",
        "LMSQuiz.take",
        "LMSQuiz.view_own_results",
        "CoachingModuleExam.view",
        "CoachingModuleExam.take",
        "CoachingModuleExam.view_own_results",
        // SAT Practice
        "SATPractice.view",
        "SATPractice.take",
        "SATPractice.view_own_results",
        "QuestionBank.view",
        // Progress
        "LMSProgress.view_own",
        "CoachingProgress.view_own",
        // Reviews
        "LMSReview.view",
        "LMSReview.add",
        "LMSReview.view_own",
        "OneToOneReview.view",
        "OneToOneReview.add",
        "OneToOneReview.view_own",
        // Payment & Billing
        "Payment.view_own",
        "PaymentPlan.view_own",
        "Invoice.view_own",
        "Refund.view_own",
        // Blog
        "Blog.view",
        "BlogComment.view",
        "BlogComment.add",
        "BlogComment.view_own",
      ],

      Parent: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        "Parent.view_own",
        "Parent.link_child",
        // Children monitoring
        "Student.view_children",
        "Student.track_progress",
        // Course visibility
        "LMSCourse.view",
        "LMSModule.view",
        "LMSLesson.view",
        "CoachingCourse.view",
        "CoachingModule.view",
        "CoachingTopic.view",
        // Sessions
        "OneToOneSession.view",
        // Attendance
        "CoachingAttendance.view_reports",
        // LMS Quizzes & Coaching Exams & SAT Practice
        "LMSQuiz.view_results",
        "CoachingModuleExam.view_results",
        "SATPractice.view_results",
        // Progress
        "LMSProgress.view",
        "CoachingProgress.view",
        // Payment & Billing
        "Payment.view",
        "Payment.view_own",
        "PaymentPlan.view_own",
        "Invoice.view_own",
      ],

      ContentManager: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        // Coaching Content management
        "CoachingContent.view",
        "CoachingContent.add",
        "CoachingContent.change",
        "CoachingContent.delete",
        "CoachingContent.publish",
        "CoachingContent.moderate",
        "CoachingContent.approve",
        // Blog management
        "Blog.view",
        "Blog.add",
        "Blog.change",
        "Blog.delete",
        "Blog.publish",
        "Blog.unpublish",
        "BlogCategory.view",
        "BlogCategory.add",
        "BlogCategory.change",
        "BlogCategory.delete",
        "BlogComment.view",
        "BlogComment.change",
        "BlogComment.delete",
        "BlogComment.approve",
        "BlogComment.moderate",
        // Course visibility
        "LMSCourse.view",
        "CoachingCourse.view",
        // LMS Discussion moderation
        "LMSDiscussion.view",
        "LMSDiscussion.moderate",
        // Review moderation
        "LMSReview.view",
        "LMSReview.moderate",
        "LMSReview.approve",
        "OneToOneReview.view",
        "OneToOneReview.moderate",
        "OneToOneReview.approve",
      ],

      Accountant: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        // Payment management
        "Payment.view",
        "Payment.add",
        "Payment.change",
        "Payment.process",
        "Payment.refund",
        "Payment.view_reports",
        // PaymentPlan management
        "PaymentPlan.view",
        "PaymentPlan.add",
        "PaymentPlan.change",
        "PaymentPlan.create",
        "PaymentPlan.modify",
        // Invoice management
        "Invoice.view",
        "Invoice.add",
        "Invoice.generate",
        "Invoice.send",
        // Refund management
        "Refund.view",
        "Refund.add",
        "Refund.process",
        "Refund.approve",
        // View users for billing
        "Student.view",
        "Teacher.view",
        "OneToOneSession.view",
        "LMSEnrollment.view",
        "CoachingEnrollment.view",
      ],

      Support: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        // View access for support
        "User.view",
        "Student.view",
        "Teacher.view",
        "Parent.view",
        "LMSCourse.view",
        "CoachingCourse.view",
        "LMSModule.view",
        "CoachingModule.view",
        "LMSLesson.view",
        "CoachingTopic.view",
        "OneToOneSession.view",
        "CoachingContent.view",
        "LMSEnrollment.view",
        "CoachingEnrollment.view",
        "Payment.view",
        "PaymentPlan.view",
        "Invoice.view",
        // LMS Discussion & BlogComment moderation
        "LMSDiscussion.view",
        "LMSDiscussion.moderate",
        "BlogComment.view",
        "BlogComment.moderate",
        // View quizzes, exams, and SAT practice
        "LMSQuiz.view",
        "CoachingModuleExam.view",
        "SATPractice.view",
        // View progress and attendance
        "LMSProgress.view",
        "CoachingProgress.view",
        "CoachingAttendance.view",
        // Contact & Guidance
        "ContactUs.view",
        "Guidance.view",
        "FreeSeminar.view",
        "TutorRequestRegistration.view",
      ],

      Affiliate: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        "AffiliateUser.view_own",
        "AffiliateUser.track_earnings",
        // Referral tracking
        "Student.view_referred",
        "Payment.view_own",
      ],

      Referral: [
        // Self-management
        "User.view_own",
        "User.update_own_profile",
        "User.change_own_password",
        "ReferralUser.view_own",
        "ReferralUser.track_earnings",
        // Referral tracking
        "Student.view_referred",
        "Payment.view_own",
      ],
    };

    // 3.2️⃣ Assign permissions to roles dynamically
    for (const [roleName, permissions] of Object.entries(
      rolePermissionMappings,
    )) {
      const role = await prisma.role.findUnique({
        where: { name: roleName },
        select: { id: true },
      });

      if (!role) {
        logger.warn(
          `Role ${roleName} not found, skipping permission assignment`,
        );
        continue;
      }

      // Determine which permissions to assign
      let permissionsToAssign: string[];
      if (permissions === "ALL") {
        permissionsToAssign = createdPermissions.map((p) => p.id);
      } else {
        permissionsToAssign = permissions
          .filter((code) => permissionMap[code]) // Filter out any invalid codes
          .map((code) => permissionMap[code]);
      }

      // Assign permissions to role
      await prisma.role.update({
        where: { id: role.id },
        data: {
          permissions: {
            set: [], // Clear existing permissions first
            connect: permissionsToAssign.map((id) => ({ id })),
          },
        },
      });

      logger.info(
        `Assigned ${permissionsToAssign.length} permissions to ${roleName}`,
      );
    }

    // 4️⃣ Create SuperAdmin User and assign Role
    const superAdminRole = await prisma.role.findUnique({
      where: { name: "SuperAdmin" },
      select: { id: true },
    });

    if (!superAdminRole) throw new Error("SuperAdmin role not found");

    const adminEmail = process.env.ADMIN_EMAIL || "info@prepexcellence.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "A7f!Q9mR2@Kp";
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: "Admin User",
        password: await bcrypt.hash(adminPassword, 12),
        isActive: true,
        isSuperUser: true,
        isVerified: true,
        roleId: superAdminRole.id,
      },
    });

    logger.info("Database seeding completed successfully");
  } catch (error) {
    logger.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
