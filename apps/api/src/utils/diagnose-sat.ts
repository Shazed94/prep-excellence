/**
 * SAT-practice data diagnostic.
 * Run from apps/api:  npx tsx src/utils/diagnose-sat.ts
 *
 * Prints the test types and SAT practice tests so we can see whether the
 * practice tests exist, are PUBLISHED, and are linked to the right test type.
 */
import "dotenv/config"; // load apps/api/.env so DATABASE_URL matches the API
import prisma from "../infrastructure/database/connection";

async function main() {
	const testTypes = await prisma.testType.findMany({
		select: {
			id: true,
			name: true,
			_count: { select: { SATPractice: true } },
		},
	});

	console.log("\n=== TEST TYPES ===");
	for (const t of testTypes) {
		console.log(
			`- ${t.name}  (id: ${t.id})  practiceTests: ${t._count.SATPractice}`,
		);
	}

	const practices = await prisma.sATPractice.findMany({
		select: {
			id: true,
			name: true,
			status: true,
			practiceType: true,
			isActive: true,
			testTypeId: true,
		},
	});

	console.log(`\n=== SAT PRACTICE TESTS (${practices.length}) ===`);
	for (const p of practices) {
		console.log(
			`- ${p.name ?? "(no name)"} | status=${p.status} | type=${p.practiceType} | active=${p.isActive} | testTypeId=${p.testTypeId}`,
		);
	}

	// What the student dropdown effectively queries:
	const sat = testTypes.find((t) => t.name?.toUpperCase() === "SAT");
	if (sat) {
		const forDropdown = await prisma.sATPractice.count({
			where: {
				testTypeId: sat.id,
				isActive: true,
				status: "PUBLISHED",
				practiceType: "TEST_PRACTICE",
			},
		});
		console.log(
			`\n=== Dropdown would show for SAT / TEST_PRACTICE: ${forDropdown} test(s) ===`,
		);
	} else {
		console.log("\n⚠️  No test type named 'SAT' found.");
	}

	await prisma.$disconnect();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
