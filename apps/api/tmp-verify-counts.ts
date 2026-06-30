import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function run() {
	const queries: { name: string; sql: string }[] = [
		{
			name: "users_test_email",
			sql: "SELECT count(*)::int AS count FROM users WHERE email LIKE '%@test.com'",
		},
		{ name: "courses", sql: "SELECT count(*)::int AS count FROM courses" },
		{
			name: "course_modules",
			sql: "SELECT count(*)::int AS count FROM course_modules",
		},
		{
			name: "enrollments",
			sql: "SELECT count(*)::int AS count FROM enrollments",
		},
		{
			name: "teacher_profiles",
			sql: "SELECT count(*)::int AS count FROM teacher_profiles",
		},
	];

	for (const q of queries) {
		try {
			const res: any = await prisma.$queryRawUnsafe(q.sql);
			console.log(`${q.name}:`, res[0]?.count ?? res[0]);
		} catch (e) {
			console.error(`${q.name} query failed:`, e.message ?? e);
		}
	}

	await prisma.$disconnect();
}

run().catch((e) => {
	console.error(e);
	prisma.$disconnect();
	process.exit(1);
});
