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
			"User",
			"Student",
			"Teacher",
			"Instructor",
			"Parent",
			"Course",
			"Content",
			"Session",
			"Payment",
			"Analytics",
			"Test",
			"Enrollment",
			"Video",
			"Discussion",
			"Certificate",
			"Attendance",
			"Billing",
			"Matching",
			"LiveStream",
			"Assignment",
			"Audit",
		];
		const defaultActions = ["view", "add", "change", "delete"];
		const permissionsToUpsert = [];

		for (const moduleName of modules) {
			for (const action of defaultActions) {
				permissionsToUpsert.push({
					codeName: `${moduleName}.${action}`,
					moduleName,
					label: `${action.charAt(0).toUpperCase() + action.slice(1)} ${moduleName}`,
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
				codeName: "User.update_own_profile",
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
			// Course permissions
			{
				codeName: "Course.publish",
				moduleName: "Course",
				label: "Publish Course",
				scope: "all",
			},
			{
				codeName: "Course.unpublish",
				moduleName: "Course",
				label: "Unpublish Course",
				scope: "all",
			},
			{
				codeName: "Course.view_enrolled",
				moduleName: "Course",
				label: "View Enrolled Courses",
				scope: "enrolled",
			},
			{
				codeName: "Course.view_own",
				moduleName: "Course",
				label: "View Own Courses",
				scope: "own",
			},
			// Enrollment permissions
			{
				codeName: "Enrollment.approve",
				moduleName: "Enrollment",
				label: "Approve Enrollment",
				scope: "all",
			},
			{
				codeName: "Enrollment.reject",
				moduleName: "Enrollment",
				label: "Reject Enrollment",
				scope: "all",
			},
			{
				codeName: "Enrollment.view_own",
				moduleName: "Enrollment",
				label: "View Own Enrollments",
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
			// Content permissions (Phase 1 - CMS)
			{
				codeName: "Content.publish",
				moduleName: "Content",
				label: "Publish Content",
				scope: "all",
			},
			{
				codeName: "Content.moderate",
				moduleName: "Content",
				label: "Moderate Content",
				scope: "all",
			},
			{
				codeName: "Content.approve",
				moduleName: "Content",
				label: "Approve Content",
				scope: "all",
			},
			// Video permissions (Phase 2 - LMS)
			{
				codeName: "Video.upload",
				moduleName: "Video",
				label: "Upload Video",
				scope: "all",
			},
			{
				codeName: "Video.process",
				moduleName: "Video",
				label: "Process Video",
				scope: "all",
			},
			{
				codeName: "Video.transcode",
				moduleName: "Video",
				label: "Transcode Video",
				scope: "all",
			},
			{
				codeName: "Video.view_own",
				moduleName: "Video",
				label: "View Own Videos",
				scope: "own",
			},
			// Certificate permissions
			{
				codeName: "Certificate.generate",
				moduleName: "Certificate",
				label: "Generate Certificate",
				scope: "all",
			},
			{
				codeName: "Certificate.download",
				moduleName: "Certificate",
				label: "Download Certificate",
				scope: "all",
			},
			{
				codeName: "Certificate.view_own",
				moduleName: "Certificate",
				label: "View Own Certificates",
				scope: "own",
			},
			// Discussion permissions
			{
				codeName: "Discussion.create_thread",
				moduleName: "Discussion",
				label: "Create Discussion Thread",
				scope: "all",
			},
			{
				codeName: "Discussion.post_message",
				moduleName: "Discussion",
				label: "Post Message",
				scope: "all",
			},
			{
				codeName: "Discussion.moderate",
				moduleName: "Discussion",
				label: "Moderate Discussion",
				scope: "all",
			},
			// Session permissions (Phase 3 & 4 - Coaching)
			{
				codeName: "Session.schedule",
				moduleName: "Session",
				label: "Schedule Session",
				scope: "all",
			},
			{
				codeName: "Session.cancel",
				moduleName: "Session",
				label: "Cancel Session",
				scope: "all",
			},
			{
				codeName: "Session.conduct",
				moduleName: "Session",
				label: "Conduct Session",
				scope: "all",
			},
			{
				codeName: "Session.join",
				moduleName: "Session",
				label: "Join Session",
				scope: "all",
			},
			{
				codeName: "Session.view_own",
				moduleName: "Session",
				label: "View Own Sessions",
				scope: "own",
			},
			// Attendance permissions
			{
				codeName: "Attendance.mark",
				moduleName: "Attendance",
				label: "Mark Attendance",
				scope: "all",
			},
			{
				codeName: "Attendance.view_reports",
				moduleName: "Attendance",
				label: "View Attendance Reports",
				scope: "all",
			},
			{
				codeName: "Attendance.view_own",
				moduleName: "Attendance",
				label: "View Own Attendance",
				scope: "own",
			},
			// Matching permissions (Phase 3)
			{
				codeName: "Matching.match_tutor",
				moduleName: "Matching",
				label: "Match Tutor to Student",
				scope: "all",
			},
			{
				codeName: "Matching.unmatch",
				moduleName: "Matching",
				label: "Unmatch Tutor",
				scope: "all",
			},
			{
				codeName: "Matching.view_matches",
				moduleName: "Matching",
				label: "View Matches",
				scope: "all",
			},
			// Assignment permissions (Phase 4)
			{
				codeName: "Assignment.create",
				moduleName: "Assignment",
				label: "Create Assignment",
				scope: "all",
			},
			{
				codeName: "Assignment.submit",
				moduleName: "Assignment",
				label: "Submit Assignment",
				scope: "all",
			},
			{
				codeName: "Assignment.grade",
				moduleName: "Assignment",
				label: "Grade Assignment",
				scope: "all",
			},
			{
				codeName: "Assignment.view_own",
				moduleName: "Assignment",
				label: "View Own Assignments",
				scope: "own",
			},
			// LiveStream permissions (Phase 4)
			{
				codeName: "LiveStream.start",
				moduleName: "LiveStream",
				label: "Start Live Stream",
				scope: "all",
			},
			{
				codeName: "LiveStream.join",
				moduleName: "LiveStream",
				label: "Join Live Stream",
				scope: "all",
			},
			{
				codeName: "LiveStream.record",
				moduleName: "LiveStream",
				label: "Record Live Stream",
				scope: "all",
			},
			{
				codeName: "LiveStream.end",
				moduleName: "LiveStream",
				label: "End Live Stream",
				scope: "all",
			},
			// Payment permissions (Phase 2, 3, 4)
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
			// Billing permissions (Phase 3)
			{
				codeName: "Billing.create_invoice",
				moduleName: "Billing",
				label: "Create Invoice",
				scope: "all",
			},
			{
				codeName: "Billing.send_invoice",
				moduleName: "Billing",
				label: "Send Invoice",
				scope: "all",
			},
			{
				codeName: "Billing.view_reports",
				moduleName: "Billing",
				label: "View Billing Reports",
				scope: "all",
			},
			{
				codeName: "Billing.view_own",
				moduleName: "Billing",
				label: "View Own Billing",
				scope: "own",
			},
			// Analytics permissions
			{
				codeName: "Analytics.view_dashboard",
				moduleName: "Analytics",
				label: "View Analytics Dashboard",
				scope: "all",
			},
			{
				codeName: "Analytics.export",
				moduleName: "Analytics",
				label: "Export Analytics",
				scope: "all",
			},
			{
				codeName: "Analytics.view_own_progress",
				moduleName: "Analytics",
				label: "View Own Progress",
				scope: "own",
			},
			{
				codeName: "Analytics.view_child_progress",
				moduleName: "Analytics",
				label: "View Child Progress",
				scope: "children",
			},
			// Test permissions (Phase 6 - Bluebook)
			{
				codeName: "Test.create",
				moduleName: "Test",
				label: "Create Test",
				scope: "all",
			},
			{
				codeName: "Test.take",
				moduleName: "Test",
				label: "Take Test",
				scope: "all",
			},
			{
				codeName: "Test.grade",
				moduleName: "Test",
				label: "Grade Test",
				scope: "all",
			},
			{
				codeName: "Test.publish",
				moduleName: "Test",
				label: "Publish Test",
				scope: "all",
			},
			{
				codeName: "Test.view_results",
				moduleName: "Test",
				label: "View Test Results",
				scope: "all",
			},
			{
				codeName: "Test.view_own_results",
				moduleName: "Test",
				label: "View Own Test Results",
				scope: "own",
			},
			// Audit permissions
			{
				codeName: "Audit.view_logs",
				moduleName: "Audit",
				label: "View Audit Logs",
				scope: "all",
			},
			{
				codeName: "Audit.export_logs",
				moduleName: "Audit",
				label: "Export Audit Logs",
				scope: "all",
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
				// Course management (Phase 2 - LMS)
				"Course.view",
				"Course.add",
				"Course.change",
				"Course.publish",
				"Course.unpublish",
				"Course.view_own",
				// Enrollment
				"Enrollment.view",
				"Enrollment.approve",
				// Student tracking
				"Student.view",
				"Student.view_enrolled",
				"Student.track_progress",
				// Video (Phase 2)
				"Video.view",
				"Video.add",
				"Video.upload",
				"Video.view_own",
				// Content
				"Content.view",
				"Content.add",
				"Content.change",
				// Discussion
				"Discussion.view",
				"Discussion.create_thread",
				"Discussion.post_message",
				"Discussion.moderate",
				// Certificates
				"Certificate.view",
				"Certificate.generate",
				// Tests (Phase 6)
				"Test.view",
				"Test.create",
				"Test.change",
				"Test.grade",
				"Test.publish",
				"Test.view_results",
				// Assignments
				"Assignment.view",
				"Assignment.create",
				"Assignment.change",
				"Assignment.grade",
				// Analytics
				"Analytics.view_dashboard",
				"Analytics.view_own_progress",
			],

			Teacher: [
				// Self-management
				"User.view_own",
				"User.update_own_profile",
				"User.change_own_password",
				// Student management (enrolled only)
				"Student.view_enrolled",
				"Student.track_progress",
				// Session management (Phase 3 & 4)
				"Session.view",
				"Session.schedule",
				"Session.conduct",
				"Session.cancel",
				"Session.join",
				"Session.view_own",
				// Attendance
				"Attendance.view",
				"Attendance.mark",
				"Attendance.view_reports",
				// Matching
				"Matching.view_matches",
				// Assignments
				"Assignment.view",
				"Assignment.create",
				"Assignment.grade",
				// LiveStream (Phase 4)
				"LiveStream.view",
				"LiveStream.start",
				"LiveStream.join",
				"LiveStream.record",
				"LiveStream.end",
				// Discussion
				"Discussion.view",
				"Discussion.create_thread",
				"Discussion.post_message",
				// Payment (own only)
				"Payment.view_own",
				// Analytics
				"Analytics.view_dashboard",
				"Analytics.view_own_progress",
			],

			Student: [
				// Self-management
				"User.view_own",
				"User.update_own_profile",
				"User.change_own_password",
				"Student.view_own",
				// Course access
				"Course.view",
				"Course.view_enrolled",
				"Content.view",
				// Enrollment
				"Enrollment.view_own",
				// Video
				"Video.view",
				// Certificates
				"Certificate.view_own",
				"Certificate.download",
				// Discussion
				"Discussion.view",
				"Discussion.create_thread",
				"Discussion.post_message",
				// Sessions
				"Session.view",
				"Session.view_own",
				"Session.join",
				// Attendance
				"Attendance.view_own",
				// Assignments
				"Assignment.view",
				"Assignment.view_own",
				"Assignment.submit",
				// LiveStream
				"LiveStream.view",
				"LiveStream.join",
				// Tests (Phase 6)
				"Test.view",
				"Test.take",
				"Test.view_own_results",
				// Payment & Billing
				"Payment.view_own",
				"Billing.view_own",
				// Analytics
				"Analytics.view_own_progress",
			],

			Parent: [
				// Self-management
				"User.view_own",
				"User.update_own_profile",
				"User.change_own_password",
				// Children monitoring
				"Student.view_children",
				"Student.track_progress",
				// Course visibility
				"Course.view",
				// Sessions
				"Session.view",
				// Attendance
				"Attendance.view_reports",
				// Assignments
				"Assignment.view",
				// Tests
				"Test.view_results",
				// Payment & Billing
				"Payment.view",
				"Payment.view_own",
				"Billing.view_own",
				// Analytics
				"Analytics.view_child_progress",
			],

			ContentManager: [
				// Self-management
				"User.view_own",
				"User.update_own_profile",
				"User.change_own_password",
				// Content management (Phase 1)
				"Content.view",
				"Content.add",
				"Content.change",
				"Content.delete",
				"Content.publish",
				"Content.moderate",
				"Content.approve",
				// Course visibility
				"Course.view",
				// Discussion moderation
				"Discussion.view",
				"Discussion.moderate",
				// Analytics
				"Analytics.view_dashboard",
			],

			Accountant: [
				// Self-management
				"User.view_own",
				"User.update_own_profile",
				"User.change_own_password",
				// Payment management (Phase 3)
				"Payment.view",
				"Payment.add",
				"Payment.change",
				"Payment.process",
				"Payment.refund",
				"Payment.view_reports",
				// Billing
				"Billing.view",
				"Billing.add",
				"Billing.change",
				"Billing.create_invoice",
				"Billing.send_invoice",
				"Billing.view_reports",
				// View users for billing
				"Student.view",
				"Teacher.view",
				"Instructor.view",
				"Session.view",
				"Enrollment.view",
				// Analytics & Reports
				"Analytics.view_dashboard",
				"Analytics.export",
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
				"Instructor.view",
				"Parent.view",
				"Course.view",
				"Session.view",
				"Content.view",
				"Enrollment.view",
				"Payment.view",
				"Billing.view",
				// Discussion moderation
				"Discussion.view",
				"Discussion.moderate",
				// View assignments and tests
				"Assignment.view",
				"Test.view",
			],

			Affiliate: [
				// Self-management
				"User.view_own",
				"User.update_own_profile",
				"User.change_own_password",
				// Referral tracking
				"Student.view_referred",
				"Payment.view_own",
				// Analytics
				"Analytics.view_dashboard",
				"Analytics.view_own_progress",
			],

			Referral: [
				// Self-management
				"User.view_own",
				"User.update_own_profile",
				"User.change_own_password",
				// Referral tracking
				"Student.view_referred",
				"Payment.view_own",
				// Analytics
				"Analytics.view_own_progress",
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

		const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
		const adminPassword = process.env.ADMIN_PASSWORD || "admin@1234";
		await prisma.user.upsert({
			where: { email: adminEmail },
			update: {},
			create: {
				email: adminEmail,
				name: "Admin User",
				password: await bcrypt.hash(adminPassword, 12),
				isSuperUser: true,
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
