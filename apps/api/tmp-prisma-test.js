const { PrismaClient } = require("./src/generated/client");
(async () => {
	const prisma = new PrismaClient();
	try {
		const r = await prisma.role.findFirst();
		console.log("ok", r);
	} catch (e) {
		console.error("err", e);
		process.exitCode = 1;
	} finally {
		await prisma.$disconnect();
	}
})();
