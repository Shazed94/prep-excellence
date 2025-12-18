import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe("Newsletter API", () => {
	let superUserToken: string;
	let newsLetterId: string;

	beforeAll(async () => {
		const loginRes = await request(app)
			.post("/api/v1/auth/login")
			.send({
				email: process.env.ADMIN_EMAIL || "admin@gmail.com",
				password: process.env.ADMIN_PASSWORD || "admin@1234",
			});

		superUserToken = loginRes.body.data.accessToken;
	});

	afterAll(async () => {
		await prisma.newsLetter.deleteMany();
		await prisma.$disconnect();
	});

	describe("Newsletter Management", () => {
		describe("POST /api/v1/newsletter", () => {
			it("should create a newsletter subscription", async () => {
				const res = await request(app)
					.post("/api/v1/newsletter")
					.send({ email: "newsletter@gmail.com" });

				expect(res.status).toBe(201);
				expect(res.body.success).toBe(true);
				expect(res.body.data.email).toBe("newsletter@gmail.com");

				newsLetterId = res.body.data.id;
			});

			// it("should update newsletter if email already exists", async () => {
			// 	const res = await request(app)
			// 		.post("/api/v1/newsletter")
			// 		.send({ email: "newsletter@gmail.com" });

			// 	expect(res.status).toBe(200);
			// 	expect(res.body.message).toContain("Updated");
			// });

			it("should return 400 if email is missing", async () => {
				const res = await request(app)
					.post("/api/v1/newsletter")
					.send({ email: "" });

				expect(res.status).toBe(400);
			});
		});

		describe("GET /api/v1/newsletter", () => {
			it("should get all newsletters", async () => {
				const res = await request(app)
					.get("/api/v1/newsletter")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(Array.isArray(res.body.data)).toBe(true);
			});
		});

		describe("GET /api/v1/newsletter/:id", () => {
			it("should get a newsletter by id", async () => {
				const res = await request(app)
					.get(`/api/v1/newsletter/${newsLetterId}`)
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.data.email).toBe("newsletter@gmail.com");
			});

			it("should return 400 for invalid newsletter id", async () => {
				const res = await request(app)
					.get("/api/v1/newsletter/nonexistent123")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(400);
			});

			it("should return 404 for non-existent newsletter id", async () => {
				const res = await request(app)
					.get("/api/v1/newsletter/ckx9f2a9b0001l7z8k3q9m2x1")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(404);
			});
		});

		describe("DELETE /api/v1/newsletter/:id", () => {
			it("should delete newsletter successfully", async () => {
				const res = await request(app)
					.delete(`/api/v1/newsletter/${newsLetterId}`)
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.message).toContain("deleted successfully");
			});
		});
	});
});
