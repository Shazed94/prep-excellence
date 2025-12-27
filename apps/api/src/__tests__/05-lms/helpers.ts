import prisma from "@/infrastructure/database/connection";

/**
 * Add LMS permissions to a role
 * This ensures the role has all necessary permissions for LMS operations
 */
export async function addLMSPermissionsToRole(roleId: string): Promise<void> {
	const permissions = await prisma.permission.findMany({
		where: {
			OR: [
				{ moduleName: { startsWith: "LMSCourse" } },
				{ moduleName: { startsWith: "LMSModule" } },
				{ moduleName: { startsWith: "LMSLesson" } },
				{ moduleName: { startsWith: "LMSQuiz" } },
				{ moduleName: { startsWith: "LMSEnrollment" } },
				{ moduleName: { startsWith: "LMSProgress" } },
				{ moduleName: { startsWith: "LMSDiscussion" } },
				{ moduleName: { startsWith: "LMSReview" } },
			],
		},
	});

	if (permissions.length > 0) {
		await prisma.role.update({
			where: { id: roleId },
			data: {
				permissions: {
					connect: permissions.map((p) => ({ id: p.id })),
				},
			},
		});
	}

	console.log(`Added ${permissions.length} LMS permissions to role ${roleId}`);
}

/**
 * Create a test instructor user with proper permissions
 */
export async function createTestInstructor(
	email: string,
	name: string,
	password: string = "Test1234",
) {
	const bcrypt = await import("bcrypt");
	const hashedPassword = await bcrypt.hash(password, 12);

	// Get or create instructor role
	const instructorRole = await prisma.role.upsert({
		where: { name: "Instructor" },
		update: {},
		create: { name: "Instructor", description: "Instructor role" },
	});

	// Add LMS permissions to instructor role
	await addLMSPermissionsToRole(instructorRole.id);

	// Create instructor user
	const instructorUser = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
			roleId: instructorRole.id,
			isVerified: true,
			isActive: true,
			isStaff: true,
		},
	});

	// Create teacher profile
	const teacher = await prisma.teacher.create({
		data: {
			userId: instructorUser.id,
			bio: `Bio for ${name}`,
		},
	});

	return {
		userId: instructorUser.id,
		teacherId: teacher.id,
		roleId: instructorRole.id,
	};
}

/**
 * Create a test student user
 */
export async function createTestStudent(
	email: string,
	name: string,
	password: string = "Test1234",
) {
	const bcrypt = await import("bcrypt");
	const hashedPassword = await bcrypt.hash(password, 12);

	// Get or create student role
	const studentRole = await prisma.role.upsert({
		where: { name: "Student" },
		update: {},
		create: { name: "Student", description: "Student role" },
	});

	// Create student user
	const studentUser = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
			roleId: studentRole.id,
			isVerified: true,
			isActive: true,
		},
	});

	// Create student profile
	const student = await prisma.student.create({
		data: {
			userId: studentUser.id,
		},
	});

	return {
		userId: studentUser.id,
		studentId: student.id,
		roleId: studentRole.id,
	};
}
