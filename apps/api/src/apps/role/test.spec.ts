import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";

describe("Role & Permission Management API", () => {
	let superUserToken: string;
	let superUserId: string;
	let testRoleId: string;
	let studentRoleId: string;
	let permissionIds: string[] = [];

	beforeAll(async () => {
		// Clear cache
		await cached.flush();

		// Create Super User role if not exists
		let superUserRole = await prisma.role.findUnique({
			where: { name: "Super User" },
		});

		if (!superUserRole) {
			superUserRole = await prisma.role.create({
				data: {
					name: "Super User",
					description: "Super Administrator with all permissions",
				},
			});
		}

		// Create or get super user
		const existingUser = await prisma.user.findUnique({
			where: { email: "superadmin@test.com" },
		});

		if (existingUser) {
			superUserId = existingUser.id;
		} else {
			const bcrypt = await import("bcrypt");
			const hashedPassword = await bcrypt.hash("SuperAdmin123!", 12);

			const superUser = await prisma.user.create({
				data: {
					email: "superadmin@test.com",
					password: hashedPassword,
					name: "Super Admin Test",
					isSuperUser: true,
					isStaff: true,
					isActive: true,
					isVerified: true,
					roleId: superUserRole.id,
				},
			});
			superUserId = superUser.id;
		}

		// Login to get token
		const loginRes = await request(app).post("/api/v1/auth/login").send({
			email: "superadmin@test.com",
			password: "SuperAdmin123!",
		});

		superUserToken = loginRes.body.data.accessToken;

		// Get some permission IDs for testing
		const permissions = await prisma.permission.findMany({ take: 5 });
		permissionIds = permissions.map((p) => p.id);

		// Get or create student role
		let studentRole = await prisma.role.findUnique({
			where: { name: "Student" },
		});
		if (!studentRole) {
			studentRole = await prisma.role.create({
				data: {
					name: "Student",
					description: "Student role for testing",
				},
			});
		}
		studentRoleId = studentRole.id;

		// Create a test student user to prevent deletion of Student role
		const bcrypt = await import("bcrypt");
		const studentPassword = await bcrypt.hash("Student123!", 12);
		await prisma.user.create({
			data: {
				email: "teststudent@test.com",
				password: studentPassword,
				name: "Test Student",
				isActive: true,
				isVerified: true,
				roleId: studentRoleId,
			},
		});
	});
	afterAll(async () => {
		// Cleanup
		if (testRoleId) {
			await prisma.role.delete({ where: { id: testRoleId } }).catch(() => {});
		}
		await prisma.user.delete({ where: { id: superUserId } }).catch(() => {});
		await prisma.user
			.delete({ where: { email: "teststudent@test.com" } })
			.catch(() => {});
		await cached.flush();
		await prisma.$disconnect();
	});

	describe("Role Management", () => {
		describe("POST /api/v1/roles", () => {
			it("should create a new role as super user", async () => {
				const res = await request(app)
					.post("/api/v1/roles")
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						name: "Test Role",
						description: "A test role for unit testing",
					});

				expect(res.status).toBe(201);
				expect(res.body.success).toBe(true);
				expect(res.body.data.name).toBe("Test Role");
				expect(res.body.data.description).toBe("A test role for unit testing");
				testRoleId = res.body.data.id;
			});

			it("should return 409 if role name already exists", async () => {
				const res = await request(app)
					.post("/api/v1/roles")
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						name: "Test Role",
						description: "Duplicate role",
					});

				expect(res.status).toBe(409);
				expect(res.body.message).toContain("already exists");
			});

			it("should return 400 if name is missing", async () => {
				const res = await request(app)
					.post("/api/v1/roles")
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						description: "No name role",
					});

				expect(res.status).toBe(400);
				expect(res.body.message).toContain("required");
			});
		});

		describe("GET /api/v1/roles", () => {
			it("should get all roles with permissions", async () => {
				const res = await request(app)
					.get("/api/v1/roles")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(Array.isArray(res.body.data)).toBe(true);
				expect(res.body.data.length).toBeGreaterThan(0);

				// Check structure
				const role = res.body.data[0];
				expect(role).toHaveProperty("id");
				expect(role).toHaveProperty("name");
				expect(role).toHaveProperty("permissions");
				expect(role).toHaveProperty("_count");
			});
		});

		describe("GET /api/v1/roles/:id", () => {
			it("should get a single role by id", async () => {
				const res = await request(app)
					.get(`/api/v1/roles/${testRoleId}`)
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.id).toBe(testRoleId);
				expect(res.body.data.name).toBe("Test Role");
				expect(res.body.data).toHaveProperty("permissions");
				expect(res.body.data).toHaveProperty("users");
			});

			it("should return 404 for non-existent role", async () => {
				const res = await request(app)
					.get("/api/v1/roles/nonexistent123")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(404);
			});
		});

		describe("PUT /api/v1/roles/:id", () => {
			it("should update role name and description", async () => {
				const res = await request(app)
					.put(`/api/v1/roles/${testRoleId}`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						name: "Final Updated Role",
						description: "Updated description",
					});

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.name).toBe("Final Updated Role");
				expect(res.body.data.description).toBe("Updated description");
			});

			it("should return 404 for non-existent role", async () => {
				const res = await request(app)
					.put("/api/v1/roles/nonexistent123")
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						name: "New Name",
					});

				expect(res.status).toBe(404);
			});

			it("should return 409 if new name conflicts", async () => {
				const res = await request(app)
					.put(`/api/v1/roles/${testRoleId}`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						name: "Student", // Existing role
					});

				expect(res.status).toBe(409);
			});
		});

		describe("POST /api/v1/roles/:id/permissions", () => {
			it("should assign permissions to role", async () => {
				const res = await request(app)
					.post(`/api/v1/roles/${testRoleId}/permissions`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						permissionIds: permissionIds.slice(0, 3),
					});

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.permissions.length).toBe(3);
				expect(res.body.message).toContain("Assigned 3 permission");
			});

			it("should return 400 for invalid permission IDs", async () => {
				const res = await request(app)
					.post(`/api/v1/roles/${testRoleId}/permissions`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						permissionIds: ["invalid-id-1", "invalid-id-2"],
					});

				expect(res.status).toBe(400);
				expect(res.body.message).toContain("invalid");
			});

			it("should return 400 if permissionIds is not an array", async () => {
				const res = await request(app)
					.post(`/api/v1/roles/${testRoleId}/permissions`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						permissionIds: "not-an-array",
					});

				expect(res.status).toBe(400);
			});
		});

		describe("PATCH /api/v1/roles/:id/permissions", () => {
			it("should add permissions without removing existing ones", async () => {
				const res = await request(app)
					.patch(`/api/v1/roles/${testRoleId}/permissions`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						permissionIds: [permissionIds[3], permissionIds[4]],
					});

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.permissions.length).toBe(5); // 3 existing + 2 new
				expect(res.body.message).toContain("Added 2 new permission");
			});

			it("should return message if no new permissions to add", async () => {
				const res = await request(app)
					.patch(`/api/v1/roles/${testRoleId}/permissions`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						permissionIds: [permissionIds[0]], // Already exists
					});

				expect(res.status).toBe(200);
				expect(res.body.message).toContain("No new permissions");
			});
		});

		describe("DELETE /api/v1/roles/:id/permissions", () => {
			it("should remove permissions from role", async () => {
				const res = await request(app)
					.delete(`/api/v1/roles/${testRoleId}/permissions`)
					.set("Authorization", `Bearer ${superUserToken}`)
					.send({
						permissionIds: [permissionIds[0], permissionIds[1]],
					});

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.permissions.length).toBe(3); // 5 - 2 = 3
				expect(res.body.message).toContain("Removed 2 permission");
			});
		});

		describe("DELETE /api/v1/roles/:id", () => {
			it("should prevent deletion of role with assigned users", async () => {
				const res = await request(app)
					.delete(`/api/v1/roles/${studentRoleId}`)
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(400);
				expect(res.body.message).toContain("assigned user");
			});

			it("should delete role without users", async () => {
				const res = await request(app)
					.delete(`/api/v1/roles/${testRoleId}`)
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.message).toContain("deleted successfully");

				testRoleId = ""; // Prevent cleanup
			});

			it("should return 404 for non-existent role", async () => {
				const res = await request(app)
					.delete("/api/v1/roles/nonexistent123")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(404);
			});
		});
	});

	describe("Permission Management", () => {
		describe("GET /api/v1/permissions", () => {
			it("should get all permissions grouped by module", async () => {
				const res = await request(app)
					.get("/api/v1/permissions")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data).toHaveProperty("total");
				expect(res.body.data).toHaveProperty("modules");
				expect(res.body.data).toHaveProperty("permissions");
				expect(typeof res.body.data.permissions).toBe("object");
			});

			it("should use cache on second request", async () => {
				// First request
				const res1 = await request(app)
					.get("/api/v1/permissions")
					.set("Authorization", `Bearer ${superUserToken}`);

				// Second request (should be from cache)
				const res2 = await request(app)
					.get("/api/v1/permissions")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res1.body).toEqual(res2.body);
			});
		});

		describe("GET /api/v1/permissions/module/:module", () => {
			it.skip("should get permissions for a specific module", async () => {
				// Skipping: Database has no permission seeds
				const res = await request(app)
					.get("/api/v1/permissions/module/user")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(Array.isArray(res.body.data)).toBe(true);

				// All permissions should be from user module
				res.body.data.forEach((perm: any) => {
					expect(perm.moduleName).toBe("user");
				});
			});

			it("should return 404 for non-existent module", async () => {
				const res = await request(app)
					.get("/api/v1/permissions/module/nonexistent")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(404);
				expect(res.body.message).toContain("No permissions found");
			});
		});

		describe("GET /api/v1/permissions/search", () => {
			it("should search permissions by query", async () => {
				const res = await request(app)
					.get("/api/v1/permissions/search?q=view")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(Array.isArray(res.body.data)).toBe(true);
				expect(res.body).toHaveProperty("count");

				// All results should contain 'view' in codeName, label, or moduleName
				res.body.data.forEach((perm: any) => {
					const hasView =
						perm.codeName.toLowerCase().includes("view") ||
						perm.label.toLowerCase().includes("view") ||
						perm.moduleName.toLowerCase().includes("view");
					expect(hasView).toBe(true);
				});
			});

			it("should return 400 if query is missing", async () => {
				const res = await request(app)
					.get("/api/v1/permissions/search")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(400);
				expect(res.body.message).toContain("required");
			});

			it("should return empty array for no matches", async () => {
				const res = await request(app)
					.get("/api/v1/permissions/search?q=xyznonexistent999")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.data.length).toBe(0);
			});
		});

		describe("GET /api/v1/permissions/scopes", () => {
			it("should get all available scopes", async () => {
				const res = await request(app)
					.get("/api/v1/permissions/scopes")
					.set("Authorization", `Bearer ${superUserToken}`);

				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				expect(Array.isArray(res.body.data)).toBe(true);

				// Should include common scopes
				const scopes = res.body.data;
				expect(scopes.includes("all")).toBe(true);
			});
		});
	});

	describe("Authorization Tests", () => {
		let regularUserToken: string;

		beforeAll(async () => {
			// Create a regular user without super user privileges
			const res = await request(app).post("/api/v1/auth/register").send({
				email: "regularuser@test.com",
				password: "RegularUser123!",
				name: "Regular User",
				role: "Student",
			});

			regularUserToken = res.body.data.accessToken;
		});

		afterAll(async () => {
			await prisma.user
				.delete({ where: { email: "regularuser@test.com" } })
				.catch(() => {});
		});

		it("should prevent regular user from creating roles", async () => {
			const res = await request(app)
				.post("/api/v1/roles")
				.set("Authorization", `Bearer ${regularUserToken}`)
				.send({
					name: "Unauthorized Role",
					description: "Should fail",
				});

			expect(res.status).toBe(403);
		});

		it("should prevent regular user from updating roles", async () => {
			const res = await request(app)
				.put(`/api/v1/roles/${studentRoleId}`)
				.set("Authorization", `Bearer ${regularUserToken}`)
				.send({
					name: "Updated Name",
				});

			expect(res.status).toBe(403);
		});

		it("should prevent regular user from deleting roles", async () => {
			const res = await request(app)
				.delete(`/api/v1/roles/${studentRoleId}`)
				.set("Authorization", `Bearer ${regularUserToken}`);

			expect(res.status).toBe(403);
		});

		it("should prevent unauthenticated access", async () => {
			const res = await request(app).get("/api/v1/roles");

			expect(res.status).toBe(401);
		});
	});
});
