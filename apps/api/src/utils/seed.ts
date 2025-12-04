import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "@/generated/client";
import logger from "./logger";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
	try {
		logger.info("Starting database seeding...");

		// 1️⃣ Create SuperAdmin Role
		const roles = [
			"SuperAdmin",
			"Admin",
			"Student",
			"Teacher",
			"Parent",
			"Affiliate",
			"Referral",
		];
		for (const roleName of roles) {
			await prisma.role.upsert({
				where: { name: roleName },
				update: {},
				create: {
					name: roleName,
					description: `${roleName} role`,
					isActive: true,
				},
			});
		}

		// 2️⃣ Create default + custom permissions
		const modules = ["User", "Student", "Teacher", "Course"];
		const defaultActions = ["view", "add", "change", "delete"];
		const permissionsToUpsert = [];

		for (const moduleName of modules) {
			for (const action of defaultActions) {
				permissionsToUpsert.push({
					codeName: `${moduleName}.${action}`,
					moduleName,
					label: `${action.charAt(0).toUpperCase() + action.slice(1)} ${moduleName}`,
				});
			}
		}

		const customPermissions = [
			{
				codeName: "Course.publish",
				moduleName: "Course",
				label: "Publish Course",
			},
			{
				codeName: "Student.promote",
				moduleName: "Student",
				label: "Promote Student",
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

		// 3️⃣ Connect permissions to SuperAdmin Role
		const superAdminRole = await prisma.role.findUnique({
			where: { name: "SuperAdmin" },
			select: { id: true },
		});

		if (!superAdminRole) throw new Error("SuperAdmin role not found");

		await prisma.role.update({
			where: { id: superAdminRole.id },
			data: {
				permissions: {
					connect: createdPermissions.map((p) => ({ id: p.id })),
				},
			},
		});

		// 4️⃣ Create SuperAdmin User and assign Role
		const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
		const adminPassword = process.env.ADMIN_PASSWORD || "admin";
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
