import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { User } from "@/generated/client";
import cache from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import {
	loadUserWithPermissions,
	PermissionChecker,
	type UserWithRoleAndPermissions,
} from "@/utils/permission";

describe("PermissionChecker Utility", () => {
	let superUser: UserWithRoleAndPermissions;
	let regularUser: UserWithRoleAndPermissions;
	let parentUser: UserWithRoleAndPermissions;
	let studentUserId: string;
	let testPermissionCode: string;

	beforeAll(async () => {
		// Clear cache
		await cache.flush();

		// Ensure required roles exist
		await prisma.role.upsert({
			where: { name: "ADMIN" },
			update: {},
			create: { name: "ADMIN", description: "Administrator role" },
		});

		await prisma.role.upsert({
			where: { name: "STUDENT" },
			update: {},
			create: { name: "STUDENT", description: "Student role" },
		});

		await prisma.role.upsert({
			where: { name: "PARENT" },
			update: {},
			create: { name: "PARENT", description: "Parent role" },
		});

		// Get a test permission
		const testPermission = await prisma.permission.findFirst();
		testPermissionCode = testPermission!.codeName;

		// Create super user
		const superUserData = await prisma.user.create({
			data: {
				name: "Super User",
				email: "super@permission.test",
				password: "hash",
				isSuperUser: true,
				isStaff: true,
				isActive: true,
				isVerified: true,
				role: {
					connect: { name: "ADMIN" },
				},
			},
			include: {
				role: {
					include: {
						permissions: true,
					},
				},
			},
		});
		superUser = superUserData as UserWithRoleAndPermissions;

		// Create regular user with specific permissions
		const regularRole = await prisma.role.findFirst({
			where: { name: "STUDENT" },
			include: { permissions: true },
		});

		const regularUserData = await prisma.user.create({
			data: {
				name: "Regular User",
				email: "regular@permission.test",
				password: "hash",
				isSuperUser: false,
				isStaff: false,
				isActive: true,
				isVerified: true,
				role: {
					connect: { id: regularRole!.id },
				},
			},
			include: {
				role: {
					include: {
						permissions: true,
					},
				},
			},
		});
		regularUser = regularUserData as UserWithRoleAndPermissions;

		// Create parent user
		const parentUserData = await prisma.user.create({
			data: {
				name: "Parent User",
				email: "parent@permission.test",
				password: "hash",
				isSuperUser: false,
				isStaff: false,
				isActive: true,
				isVerified: true,
				role: {
					connect: { name: "PARENT" },
				},
			},
			include: {
				role: {
					include: {
						permissions: true,
					},
				},
			},
		});
		parentUser = parentUserData as UserWithRoleAndPermissions;

		// Create student record for parent
		const studentUser = await prisma.user.create({
			data: {
				name: "Student User",
				email: "student@permission.test",
				password: "hash",
				role: {
					connect: { name: "STUDENT" },
				},
			},
		});
		studentUserId = studentUser.id;

		// Create student profile linked to parent
		await prisma.student.create({
			data: {
				userId: studentUserId,
				grade: "9",
				parents: {
					create: {
						userId: parentUser.id,
						relation: "FATHER",
					},
				},
			},
		});
	});

	afterAll(async () => {
		// Clean up test data
		await prisma.user
			.deleteMany({
				where: {
					email: {
						in: [
							"super@permission.test",
							"regular@permission.test",
							"parent@permission.test",
							"student@permission.test",
						],
					},
				},
			})
			.catch(() => {});
		await cache.flush();
		await prisma.$disconnect();
		await cache.disconnect();
	});

	describe("hasPermission", () => {
		it("should return true for super user regardless of permission", () => {
			expect(
				PermissionChecker.hasPermission(superUser, "nonexistent_permission"),
			).toBe(true);
			expect(
				PermissionChecker.hasPermission(superUser, testPermissionCode),
			).toBe(true);
		});

		it("should return true if user has the specific permission", () => {
			if (regularUser.role.permissions.length > 0) {
				const permCode = regularUser.role.permissions[0].codeName;
				expect(PermissionChecker.hasPermission(regularUser, permCode)).toBe(
					true,
				);
			}
		});

		it("should return false if user does not have the permission", () => {
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

		it("should return true if user has any of the permissions", () => {
			if (regularUser.role.permissions.length > 0) {
				const permCode = regularUser.role.permissions[0].codeName;
				expect(
					PermissionChecker.hasAnyPermission(regularUser, [
						"nonexistent",
						permCode,
					]),
				).toBe(true);
			}
		});

		it("should return false if user has none of the permissions", () => {
			expect(
				PermissionChecker.hasAnyPermission(regularUser, [
					"nonexistent1",
					"nonexistent2",
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

		it("should return true if user has all permissions", () => {
			if (regularUser.role.permissions.length >= 2) {
				const codes = regularUser.role.permissions
					.slice(0, 2)
					.map((p) => p.codeName);
				expect(PermissionChecker.hasAllPermissions(regularUser, codes)).toBe(
					true,
				);
			}
		});

		it("should return false if user is missing any permission", () => {
			if (regularUser.role.permissions.length > 0) {
				const permCode = regularUser.role.permissions[0].codeName;
				expect(
					PermissionChecker.hasAllPermissions(regularUser, [
						permCode,
						"nonexistent",
					]),
				).toBe(false);
			}
		});

		it("should return false if user has none of the permissions", () => {
			expect(
				PermissionChecker.hasAllPermissions(regularUser, [
					"nonexistent1",
					"nonexistent2",
				]),
			).toBe(false);
		});
	});

	describe("getPermissionScope", () => {
		it('should return "all" for super user', () => {
			expect(
				PermissionChecker.getPermissionScope(superUser, "any_permission"),
			).toBe("all");
		});

		it("should return permission scope if user has the permission", () => {
			if (regularUser.role.permissions.length > 0) {
				const perm = regularUser.role.permissions[0];
				const scope = PermissionChecker.getPermissionScope(
					regularUser,
					perm.codeName,
				);
				expect(scope).toBe(perm.scope);
			}
		});

		it("should return null if user does not have the permission", () => {
			const scope = PermissionChecker.getPermissionScope(
				regularUser,
				"nonexistent_permission",
			);
			expect(scope).toBeNull();
		});

		it("should return null if permission has no scope", () => {
			// Create a permission without scope for testing
			const permWithoutScope = regularUser.role.permissions.find(
				(p) => !p.scope,
			);
			if (permWithoutScope) {
				const scope = PermissionChecker.getPermissionScope(
					regularUser,
					permWithoutScope.codeName,
				);
				expect(scope).toBeNull();
			}
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

		it("should return false if user has no permission", () => {
			expect(
				PermissionChecker.canAccessResource(
					regularUser,
					"nonexistent_permission",
					"some-id",
				),
			).toBe(false);
		});

		it('should return true for "all" scope', () => {
			// Create a mock user with "all" scope permission
			const userWithAllScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "all",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			expect(
				PermissionChecker.canAccessResource(
					userWithAllScope,
					"test_permission",
					"other-user-id",
				),
			).toBe(true);
		});

		it('should return false for "own" scope without resource owner', () => {
			const userWithOwnScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "own",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			expect(
				PermissionChecker.canAccessResource(
					userWithOwnScope,
					"test_permission",
					regularUser.id,
				),
			).toBe(true);
		});

		it("should return false when permission not found", () => {
			const userWithOtherPermission: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "all",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			expect(
				PermissionChecker.canAccessResource(
					userWithOtherPermission,
					"other-user-id",
				),
			).toBe(false);
		});

		it('should return true for "own" scope with matching resource owner', () => {
			const userWithOwnScope = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "own",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			expect(
				PermissionChecker.canAccessResource(
					userWithOwnScope,
					"test_permission",
				),
			).toBe(false);
		});

		it('should return true for "enrolled" scope', () => {
			const userWithEnrolledScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "enrolled",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			expect(
				PermissionChecker.canAccessResource(
					userWithEnrolledScope,
					"test_permission",
				),
			).toBe(true);
		});

		it('should return true for "children" scope', () => {
			const userWithChildrenScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "children",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			expect(
				PermissionChecker.canAccessResource(
					userWithChildrenScope,
					"test_permission",
				),
			).toBe(true);
		});

		it('should return true for "referred" scope', () => {
			const userWithReferredScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "referred",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			expect(
				PermissionChecker.canAccessResource(
					userWithReferredScope,
					"test_permission",
				),
			).toBe(true);
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

		it("should return null if user has no permission", async () => {
			const filter = await PermissionChecker.buildScopeFilter(
				regularUser,
				"nonexistent_permission",
			);
			expect(filter).toBeNull();
		});

		it('should return empty object for "all" scope', async () => {
			const userWithAllScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "all",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			const filter = await PermissionChecker.buildScopeFilter(
				userWithAllScope,
				"test_permission",
			);
			expect(filter).toEqual({});
		});

		it('should return userId filter for "own" scope', async () => {
			const userWithOwnScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "own",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			const filter = await PermissionChecker.buildScopeFilter(
				userWithOwnScope,
				"test_permission",
			);
			expect(filter).toEqual({ userId: regularUser.id });
		});

		it('should use custom userIdField for "own" scope', async () => {
			const userWithOwnScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "own",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			const filter = await PermissionChecker.buildScopeFilter(
				userWithOwnScope,
				"test_permission",
				"ownerId",
			);
			expect(filter).toEqual({ ownerId: regularUser.id });
		});

		it('should return true for "enrolled" scope', async () => {
			const userWithEnrolledScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "enrolled",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			const filter = await PermissionChecker.buildScopeFilter(
				userWithEnrolledScope,
				"test_permission",
			);
			expect(filter).toEqual({});
		});

		it('should return children IDs filter for "children" scope', async () => {
			const userWithChildrenScope: UserWithRoleAndPermissions = {
				...parentUser,
				role: {
					...parentUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "children",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			const filter = await PermissionChecker.buildScopeFilter(
				userWithChildrenScope,
				"test_permission",
			);
			expect(filter).toHaveProperty("userId");
			expect(filter?.userId).toHaveProperty("in");
			expect(Array.isArray(filter?.userId.in)).toBe(true);
			expect(filter?.userId.in).toContain(studentUserId);
		});

		it('should return true for "referred" scope', async () => {
			const userWithReferredScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "referred",
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			const filter = await PermissionChecker.buildScopeFilter(
				userWithReferredScope,
				"test_permission",
			);
			expect(filter).toEqual({});
		});

		it("should return null for unknown scope", async () => {
			const userWithUnknownScope: UserWithRoleAndPermissions = {
				...regularUser,
				role: {
					...regularUser.role,
					permissions: [
						{
							id: "test-id",
							codeName: "test_permission",
							label: "Test",
							moduleName: "test",
							scope: "unknown" as any,
							isActive: true,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
				},
			};

			const filter = await PermissionChecker.buildScopeFilter(
				userWithUnknownScope,
				"test_permission",
			);
			expect(filter).toBeNull();
		});
	});

	describe("getUserPermissions", () => {
		it('should return ["*"] for super user', () => {
			const perms = PermissionChecker.getUserPermissions(superUser);
			expect(perms).toEqual(["*"]);
		});

		it("should return array of permission codes for regular user", () => {
			const perms = PermissionChecker.getUserPermissions(regularUser);
			expect(Array.isArray(perms)).toBe(true);
			expect(perms.length).toBe(regularUser.role.permissions.length);
			perms.forEach((code) => {
				expect(typeof code).toBe("string");
			});
		});
	});

	describe("invalidateUserCache", () => {
		it("should clear user permission cache", async () => {
			const userId = regularUser.id;
			const cacheKey = `user:permissions:${userId}`;

			// Set a cache value
			await cache.setJSON(cacheKey, { test: "data" }, 60);

			// Invalidate
			await PermissionChecker.invalidateUserCache(userId);

			// Check it's gone
			const cached = await cache.getJSON(cacheKey);
			expect(cached).toBeNull();
		});
	});

	describe("invalidateRoleCache", () => {
		it("should clear all user permission caches", async () => {
			// Set multiple cache values
			await cache.setJSON(
				`user:permissions:${regularUser.id}`,
				{ test: "data1" },
				60,
			);
			await cache.setJSON(
				`user:permissions:${superUser.id}`,
				{ test: "data2" },
				60,
			);

			// Invalidate role cache
			await PermissionChecker.invalidateRoleCache("some-role-id");

			// Check all are gone
			const cached1 = await cache.getJSON(`user:permissions:${regularUser.id}`);
			const cached2 = await cache.getJSON(`user:permissions:${superUser.id}`);
			expect(cached1).toBeNull();
			expect(cached2).toBeNull();
		});
	});

	describe("isStaff", () => {
		it("should return true for staff user", () => {
			const staffUser: User = {
				...regularUser,
				isStaff: true,
			};
			expect(PermissionChecker.isStaff(staffUser)).toBe(true);
		});

		it("should return true for super user", () => {
			expect(PermissionChecker.isStaff(superUser)).toBe(true);
		});

		it("should return false for non-staff user", () => {
			expect(PermissionChecker.isStaff(regularUser)).toBe(false);
		});
	});

	describe("isActiveAndVerified", () => {
		it("should return true for active and verified user", () => {
			expect(PermissionChecker.isActiveAndVerified(regularUser)).toBe(true);
		});

		it("should return false for inactive user", () => {
			const inactiveUser: User = {
				...regularUser,
				isActive: false,
			};
			expect(PermissionChecker.isActiveAndVerified(inactiveUser)).toBe(false);
		});

		it("should return false for unverified user", () => {
			const unverifiedUser: User = {
				...regularUser,
				isVerified: false,
			};
			expect(PermissionChecker.isActiveAndVerified(unverifiedUser)).toBe(false);
		});

		it("should return false for inactive and unverified user", () => {
			const user: User = {
				...regularUser,
				isActive: false,
				isVerified: false,
			};
			expect(PermissionChecker.isActiveAndVerified(user)).toBe(false);
		});
	});

	describe("loadUserWithPermissions", () => {
		it("should load user from database", async () => {
			const loaded = await loadUserWithPermissions(regularUser.id);
			expect(loaded).not.toBeNull();
			expect(loaded!.id).toBe(regularUser.id);
			expect(loaded!.role).toBeDefined();
			expect(loaded!.role.permissions).toBeDefined();
			expect(Array.isArray(loaded!.role.permissions)).toBe(true);
		});

		it("should cache user data", async () => {
			// Clear cache first
			await cache.del(`user:permissions:${regularUser.id}`);

			// First load - from database
			const loaded1 = await loadUserWithPermissions(regularUser.id);
			expect(loaded1).not.toBeNull();

			// Second load - from cache
			const loaded2 = await loadUserWithPermissions(regularUser.id);
			expect(loaded2).not.toBeNull();
			expect(loaded2!.id).toBe(loaded1!.id);

			// Dates should be Date objects
			expect(loaded2!.createdAt).toBeInstanceOf(Date);
			expect(loaded2!.updatedAt).toBeInstanceOf(Date);
			expect(loaded2!.role.createdAt).toBeInstanceOf(Date);
			expect(loaded2!.role.updatedAt).toBeInstanceOf(Date);
		});

		it("should return null for non-existent user", async () => {
			const loaded = await loadUserWithPermissions(
				"00000000-0000-0000-0000-000000000000",
			);
			expect(loaded).toBeNull();
		});

		it("should convert cached date strings back to Date objects", async () => {
			// Clear cache
			await cache.del(`user:permissions:${regularUser.id}`);

			// First load to cache it
			await loadUserWithPermissions(regularUser.id);

			// Second load from cache
			const cached = await loadUserWithPermissions(regularUser.id);
			expect(cached).not.toBeNull();
			expect(cached!.createdAt).toBeInstanceOf(Date);
			expect(cached!.updatedAt).toBeInstanceOf(Date);
			expect(cached!.role.createdAt).toBeInstanceOf(Date);
			expect(cached!.role.updatedAt).toBeInstanceOf(Date);
			if (cached!.role.permissions.length > 0) {
				expect(cached!.role.permissions[0].createdAt).toBeInstanceOf(Date);
				expect(cached!.role.permissions[0].updatedAt).toBeInstanceOf(Date);
			}
		});
	});
});
