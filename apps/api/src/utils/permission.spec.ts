import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import type { UserWithRoleAndPermissions } from "./permission";
import { loadUserWithPermissions, PermissionChecker } from "./permission";

describe("PermissionChecker", () => {
	let regularUser: UserWithRoleAndPermissions;
	let superUser: UserWithRoleAndPermissions;
	let roleId: string;
	let _permissionId: string;

	beforeAll(async () => {
		// Create a test role with permissions
		const role = await prisma.role.create({
			data: {
				name: "TestRole",
				description: "Test role for permission tests",
			},
		});
		roleId = role.id;

		// Create test permissions
		const permission = await prisma.permission.create({
			data: {
				codeName: "test_permission",
				moduleName: "test",
				label: "Test Permission",
				scope: "own",
			},
		});
		_permissionId = permission.id;

		const viewAllPermission = await prisma.permission.create({
			data: {
				codeName: "view_all",
				moduleName: "test",
				label: "View All Permission",
				scope: "all",
			},
		});

		// Connect permissions to role
		await prisma.role.update({
			where: { id: roleId },
			data: {
				permissions: {
					connect: [{ id: permission.id }, { id: viewAllPermission.id }],
				},
			},
		});

		// Create regular user with permissions
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);

		const regularUserData = await prisma.user.create({
			data: {
				email: "regular@test.com",
				password: hashedPassword,
				name: "Regular User",
				roleId: roleId,
				isVerified: true,
				isActive: true,
				isSuperUser: false,
			},
			include: {
				role: {
					include: {
						permissions: true,
					},
				},
			},
		});
		regularUser = regularUserData;

		// Create super user
		const superUserData = await prisma.user.create({
			data: {
				email: "super@test.com",
				password: hashedPassword,
				name: "Super User",
				roleId: roleId,
				isVerified: true,
				isActive: true,
				isSuperUser: true,
			},
			include: {
				role: {
					include: {
						permissions: true,
					},
				},
			},
		});
		superUser = superUserData;
	});

	afterAll(async () => {
		await prisma.user.deleteMany({
			where: { email: { in: ["regular@test.com", "super@test.com"] } },
		});
		await prisma.permission.deleteMany({
			where: { codeName: { in: ["test_permission", "view_all"] } },
		});
		await prisma.role.delete({ where: { id: roleId } });
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		// Clear cache before each test
		await cached.flush();
	});

	describe("hasPermission", () => {
		it("should return true for super user regardless of permission", () => {
			expect(PermissionChecker.hasPermission(superUser, "any_permission")).toBe(
				true,
			);
		});

		it("should return true when user has the permission", () => {
			expect(
				PermissionChecker.hasPermission(regularUser, "test_permission"),
			).toBe(true);
		});

		it("should return false when user does not have the permission", () => {
			expect(
				PermissionChecker.hasPermission(regularUser, "nonexistent_permission"),
			).toBe(false);
		});
	});

	describe("hasAnyPermission", () => {
		it("should return true for super user", () => {
			expect(
				PermissionChecker.hasAnyPermission(superUser, [
					"perm1",
					"perm2",
					"perm3",
				]),
			).toBe(true);
		});

		it("should return true when user has at least one permission", () => {
			expect(
				PermissionChecker.hasAnyPermission(regularUser, [
					"test_permission",
					"nonexistent",
				]),
			).toBe(true);
		});

		it("should return false when user has none of the permissions", () => {
			expect(
				PermissionChecker.hasAnyPermission(regularUser, [
					"perm1",
					"perm2",
					"perm3",
				]),
			).toBe(false);
		});
	});

	describe("hasAllPermissions", () => {
		it("should return true for super user", () => {
			expect(
				PermissionChecker.hasAllPermissions(superUser, [
					"perm1",
					"perm2",
					"perm3",
				]),
			).toBe(true);
		});

		it("should return true when user has all permissions", () => {
			expect(
				PermissionChecker.hasAllPermissions(regularUser, [
					"test_permission",
					"view_all",
				]),
			).toBe(true);
		});

		it("should return false when user is missing at least one permission", () => {
			expect(
				PermissionChecker.hasAllPermissions(regularUser, [
					"test_permission",
					"nonexistent",
				]),
			).toBe(false);
		});
	});

	describe("getPermissionScope", () => {
		it("should return 'all' for super user", () => {
			expect(
				PermissionChecker.getPermissionScope(superUser, "any_permission"),
			).toBe("all");
		});

		it("should return permission scope when user has the permission", () => {
			expect(
				PermissionChecker.getPermissionScope(regularUser, "test_permission"),
			).toBe("own");
		});

		it("should return null when user does not have the permission", () => {
			expect(
				PermissionChecker.getPermissionScope(regularUser, "nonexistent"),
			).toBeNull();
		});
	});

	describe("canAccessResource", () => {
		it("should return true for super user", () => {
			expect(
				PermissionChecker.canAccessResource(
					superUser,
					"any_permission",
					"some-id",
				),
			).toBe(true);
		});

		it("should return false when user does not have permission", () => {
			expect(
				PermissionChecker.canAccessResource(
					regularUser,
					"nonexistent",
					"some-id",
				),
			).toBe(false);
		});

		it("should return true for 'all' scope", () => {
			expect(
				PermissionChecker.canAccessResource(regularUser, "view_all", "some-id"),
			).toBe(true);
		});

		it("should return true for 'own' scope when resourceOwnerId matches user id", () => {
			expect(
				PermissionChecker.canAccessResource(
					regularUser,
					"test_permission",
					regularUser.id,
				),
			).toBe(true);
		});

		it("should return false for 'own' scope when resourceOwnerId does not match", () => {
			expect(
				PermissionChecker.canAccessResource(
					regularUser,
					"test_permission",
					"different-id",
				),
			).toBe(false);
		});

		it("should return false for 'own' scope when resourceOwnerId is undefined", () => {
			expect(
				PermissionChecker.canAccessResource(regularUser, "test_permission"),
			).toBe(false);
		});
	});

	describe("buildScopeFilter", () => {
		it("should return empty object for super user", async () => {
			const filter = await PermissionChecker.buildScopeFilter(
				superUser,
				"any_permission",
			);
			expect(filter).toEqual({});
		});

		it("should return null when user does not have permission", async () => {
			const filter = await PermissionChecker.buildScopeFilter(
				regularUser,
				"nonexistent",
			);
			expect(filter).toBeNull();
		});

		it("should return empty object for 'all' scope", async () => {
			const filter = await PermissionChecker.buildScopeFilter(
				regularUser,
				"view_all",
			);
			expect(filter).toEqual({});
		});

		it("should return userId filter for 'own' scope", async () => {
			const filter = await PermissionChecker.buildScopeFilter(
				regularUser,
				"test_permission",
			);
			expect(filter).toEqual({ userId: regularUser.id });
		});

		it("should use custom userIdField for 'own' scope", async () => {
			const filter = await PermissionChecker.buildScopeFilter(
				regularUser,
				"test_permission",
				"createdById",
			);
			expect(filter).toEqual({ createdById: regularUser.id });
		});
	});

	describe("getUserPermissions", () => {
		it("should return ['*'] for super user", () => {
			expect(PermissionChecker.getUserPermissions(superUser)).toEqual(["*"]);
		});

		it("should return array of permission codes for regular user", () => {
			const permissions = PermissionChecker.getUserPermissions(regularUser);
			expect(permissions).toContain("test_permission");
			expect(permissions).toContain("view_all");
		});
	});

	describe("isStaff", () => {
		it("should return true for super user", () => {
			expect(PermissionChecker.isStaff(superUser)).toBe(true);
		});

		it("should return false for regular user who is not staff", () => {
			expect(PermissionChecker.isStaff(regularUser)).toBe(false);
		});

		it("should return true for staff user", async () => {
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isStaff: true },
			});
			const staffUser = await prisma.user.findUnique({
				where: { id: regularUser.id },
			});
			expect(PermissionChecker.isStaff(staffUser!)).toBe(true);

			// Reset
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isStaff: false },
			});
		});
	});

	describe("isActiveAndVerified", () => {
		it("should return true for active and verified user", () => {
			expect(PermissionChecker.isActiveAndVerified(regularUser)).toBe(true);
		});

		it("should return false for inactive user", async () => {
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isActive: false },
			});
			const inactiveUser = await prisma.user.findUnique({
				where: { id: regularUser.id },
			});
			expect(PermissionChecker.isActiveAndVerified(inactiveUser!)).toBe(false);

			// Reset
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isActive: true },
			});
		});

		it("should return false for unverified user", async () => {
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isVerified: false },
			});
			const unverifiedUser = await prisma.user.findUnique({
				where: { id: regularUser.id },
			});
			expect(PermissionChecker.isActiveAndVerified(unverifiedUser!)).toBe(
				false,
			);

			// Reset
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isVerified: true },
			});
		});
	});

	describe("invalidateUserCache", () => {
		it("should delete user cache", async () => {
			const cacheKey = `user:permissions:${regularUser.id}`;
			await cached.setJSON(cacheKey, regularUser, 60);

			await PermissionChecker.invalidateUserCache(regularUser.id);

			const cachedData = await cached.getJSON(cacheKey);
			expect(cachedData).toBeNull();
		});
	});

	describe("invalidateRoleCache", () => {
		it("should delete all user permission caches", async () => {
			const key1 = `user:permissions:${regularUser.id}`;
			const key2 = `user:permissions:${superUser.id}`;

			await cached.setJSON(key1, regularUser, 60);
			await cached.setJSON(key2, superUser, 60);

			await PermissionChecker.invalidateRoleCache(roleId);

			const cachedData1 = await cached.getJSON(key1);
			const cachedData2 = await cached.getJSON(key2);

			expect(cachedData1).toBeNull();
			expect(cachedData2).toBeNull();
		});
	});
});

describe.sequential("loadUserWithPermissions", () => {
	let testUserId: string;
	let roleId: string;

	beforeAll(async () => {
		const role = await prisma.role.create({
			data: {
				name: "LoadTestRole",
				description: "Test role",
			},
		});
		roleId = role.id;

		const permission = await prisma.permission.create({
			data: {
				codeName: "load_test_permission",
				moduleName: "test",
				label: "Load Test Permission",
			},
		});

		// Connect permission to role
		await prisma.role.update({
			where: { id: roleId },
			data: {
				permissions: {
					connect: { id: permission.id },
				},
			},
		});

		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);

		const user = await prisma.user.create({
			data: {
				email: "loadtest@test.com",
				password: hashedPassword,
				name: "Load Test User",
				roleId: roleId,
				isVerified: true,
				isActive: true,
			},
		});
		testUserId = user.id;
	});

	afterAll(async () => {
		await prisma.user.deleteMany({
			where: { email: "loadtest@test.com" },
		});
		await prisma.permission.deleteMany({
			where: { codeName: "load_test_permission" },
		});
		await prisma.role.delete({ where: { id: roleId } });
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		await cached.flush();
	});

	it("should load user from database when cache is empty", async () => {
		const user = await loadUserWithPermissions(testUserId);

		expect(user).not.toBeNull();
		expect(user?.id).toBe(testUserId);
		expect(user?.role).toBeDefined();
		expect(user?.role.permissions).toBeDefined();
		expect(user?.role.permissions.length).toBeGreaterThan(0);
	});

	it.skip("should cache user data after loading", async () => {
		// This test requires Redis to be running
		await loadUserWithPermissions(testUserId);

		const cacheKey = `user:permissions:${testUserId}`;
		const cachedData = await cached.getJSON(cacheKey);

		expect(cachedData).not.toBeNull();
		expect(cachedData).toHaveProperty("id", testUserId);
	});
	it("should load user from cache on subsequent calls", async () => {
		// First call - loads from database and caches
		const user1 = await loadUserWithPermissions(testUserId);

		// Second call - should load from cache
		const user2 = await loadUserWithPermissions(testUserId);

		expect(user2).toEqual(user1);
	});

	it("should return null for non-existent user", async () => {
		const user = await loadUserWithPermissions("nonexistent-id");
		expect(user).toBeNull();
	});
});
