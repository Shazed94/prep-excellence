import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
} else {
	prisma.$connect();
}

// Graceful shutdown - only add listener once in production
if (process.env.NODE_ENV === "production" && !globalForPrisma.prisma) {
	process.on("beforeExit", async () => {
		await prisma.$disconnect();
	});
}

export default prisma;
