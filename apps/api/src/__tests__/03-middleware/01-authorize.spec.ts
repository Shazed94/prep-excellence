import type { Request, Response } from "express";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import prisma from "@/infrastructure/database/connection";
import {
	authorize,
	authorizeResourceAccess,
	requireStaff,
	requireSuperUser,
} from "@/middleware/authorize";
import type { UserWithRoleAndPermissions } from "@/utils/permission";

describe.sequential("authorize middleware", () => {
	let regularUser: UserWithRoleAndPermissions;
	let superUser: UserWithRoleAndPermissions;
	let inactiveUser: UserWithRoleAndPermissions;
	let unverifiedUser: UserWithRoleAndPermissions;
	let roleId: string;

	beforeAll(async () => {
		const role = await prisma.role.create({
			data: {
				name: "AuthTestRole",
				description: "Test role for authorize tests",
			},
		});
		roleId = role.id;

		const perm1 = await prisma.permission.create({
			data: {
				codeName: "test_view",
				moduleName: "test",
				label: "Test View",
				scope: "own",
			},
		});

		const perm2 = await prisma.permission.create({
			data: {
				codeName: "test_edit",
				moduleName: "test",
				label: "Test Edit",
				scope: "own",
			},
		});

		// Connect permissions to role
		await prisma.role.update({
			where: { id: roleId },
			data: {
				permissions: {
					connect: [{ id: perm1.id }, { id: perm2.id }],
				},
			},
		});

		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("Test1234", 12);

		const regularUserData = await prisma.user.create({
			data: {
				email: "authtest@test.com",
				password: hashedPassword,
				name: "Auth Test User",
				roleId: roleId,
				isVerified: true,
				isActive: true,
				isSuperUser: false,
				isStaff: false,
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

		const superUserData = await prisma.user.create({
			data: {
				email: "authsuper@test.com",
				password: hashedPassword,
				name: "Auth Super User",
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

		const inactiveUserData = await prisma.user.create({
			data: {
				email: "authinactive@test.com",
				password: hashedPassword,
				name: "Inactive User",
				roleId: roleId,
				isVerified: true,
				isActive: false,
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
		inactiveUser = inactiveUserData;

		const unverifiedUserData = await prisma.user.create({
			data: {
				email: "authunverified@test.com",
				password: hashedPassword,
				name: "Unverified User",
				roleId: roleId,
				isVerified: false,
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
		unverifiedUser = unverifiedUserData;
	});

	afterAll(async () => {
		await prisma.user.deleteMany({
			where: {
				email: {
					in: [
						"authtest@test.com",
						"authsuper@test.com",
						"authinactive@test.com",
						"authunverified@test.com",
					],
				},
			},
		});
		await prisma.permission.deleteMany({
			where: { codeName: { in: ["test_view", "test_edit"] } },
		});
		await prisma.role.delete({ where: { id: roleId } });
		await prisma.$disconnect();
	});

	describe("authorize - single permission", () => {
		it("should call next() when user has required permission", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize("test_view");
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next() for super user without permission", () => {
			const req = { user: superUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize("nonexistent_permission");
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next(error) when user lacks permission", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize("nonexistent_permission");
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0]).toBeDefined();
			expect(next.mock.calls[0][0].message).toContain("do not have permission");
		});

		it("should call next(error) when user is not authenticated", () => {
			const req = {} as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize("test_view");
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"Authentication required",
			);
		});

		it("should call next(error) when user is inactive", () => {
			const req = { user: inactiveUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize("test_view");
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"inactive or not verified",
			);
		});

		it("should call next(error) when user is unverified", () => {
			const req = { user: unverifiedUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize("test_view");
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"inactive or not verified",
			);
		});
	});

	describe("authorize - multiple permissions (any)", () => {
		it("should call next() when user has any of the required permissions", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize(["test_view", "nonexistent"], false);
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next(error) when user has none of the permissions", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize(["nonexistent1", "nonexistent2"], false);
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain("any of");
		});
	});

	describe("authorize - multiple permissions (all)", () => {
		it("should call next() when user has all required permissions", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize(["test_view", "test_edit"], true);
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next(error) when user is missing at least one permission", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorize(["test_view", "nonexistent"], true);
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain("all of");
		});
	});

	describe("requireStaff", () => {
		it("should call next() for staff user", async () => {
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isStaff: true },
			});
			const staffUser = await prisma.user.findUnique({
				where: { id: regularUser.id },
				include: {
					role: {
						include: {
							permissions: true,
						},
					},
				},
			});

			const req = { user: staffUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = requireStaff();
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();

			// Reset
			await prisma.user.update({
				where: { id: regularUser.id },
				data: { isStaff: false },
			});
		});

		it("should call next() for super user", () => {
			const req = { user: superUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = requireStaff();
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next(error) for non-staff user", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = requireStaff();
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain("Staff access required");
		});

		it("should call next(error) when user is not authenticated", () => {
			const req = {} as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = requireStaff();
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"Authentication required",
			);
		});
	});

	describe("requireSuperUser", () => {
		it("should call next() for super user", () => {
			const req = { user: superUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = requireSuperUser();
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next(error) for non-super user", () => {
			const req = { user: regularUser } as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = requireSuperUser();
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"Superuser access required",
			);
		});

		it("should call next(error) when user is not authenticated", () => {
			const req = {} as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = requireSuperUser();
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"Authentication required",
			);
		});
	});

	describe("authorizeResourceAccess", () => {
		it("should call next() when user can access their own resource", () => {
			const req = {
				user: regularUser,
				params: { id: regularUser.id },
			} as unknown as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorizeResourceAccess(
				"test_view",
				(req) => req.params.id,
			);
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next(error) when user cannot access another's resource", () => {
			const req = {
				user: regularUser,
				params: { id: "different-user-id" },
			} as unknown as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorizeResourceAccess(
				"test_view",
				(req) => req.params.id,
			);
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"do not have permission to access this resource",
			);
		});

		it("should call next() for super user accessing any resource", () => {
			const req = {
				user: superUser,
				params: { id: "any-user-id" },
			} as unknown as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorizeResourceAccess(
				"test_view",
				(req) => req.params.id,
			);
			middleware(req, res, next);

			expect(next).toHaveBeenCalledWith();
		});

		it("should call next(error) when user is not authenticated", () => {
			const req = {
				params: { id: "some-id" },
			} as unknown as Request;
			const res = {} as Response;
			const next = vi.fn();

			const middleware = authorizeResourceAccess(
				"test_view",
				(req) => req.params.id,
			);
			middleware(req, res, next);

			expect(next).toHaveBeenCalled();
			expect(next.mock.calls[0][0].message).toContain(
				"Authentication required",
			);
		});
	});
});
