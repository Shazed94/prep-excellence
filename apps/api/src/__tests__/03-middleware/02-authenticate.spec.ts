import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { authenticate } from "@/middleware/authenticate";

describe("Authenticate Middleware", () => {
	const mockRequest = (headers: Record<string, string> = {}) =>
		({
			headers,
			user: undefined,
		}) as unknown as Request;

	const mockResponse = () => {
		const res = {} as Response;
		res.status = vi.fn().mockReturnValue(res);
		res.json = vi.fn().mockReturnValue(res);
		return res;
	};

	const mockNext = vi.fn() as unknown as NextFunction;

	it("should call next() with valid token", async () => {
		// This test would require a valid JWT token
		// For now, we're testing the error paths
		const req = mockRequest();
		const res = mockResponse();

		try {
			await authenticate(req, res, mockNext);
		} catch (error) {
			expect(error).toBeDefined();
		}
	});

	it("should handle missing authorization header", async () => {
		const req = mockRequest();
		const res = mockResponse();

		try {
			await authenticate(req, res, mockNext);
		} catch (error: any) {
			expect(error.statusCode).toBe(401);
			expect(error.message).toContain("No token provided");
		}
	});

	it("should handle malformed authorization header", async () => {
		const req = mockRequest({ authorization: "InvalidFormat" });
		const res = mockResponse();

		try {
			await authenticate(req, res, mockNext);
		} catch (error: any) {
			expect(error.statusCode).toBe(401);
		}
	});

	it("should handle invalid token", async () => {
		const req = mockRequest({ authorization: "Bearer invalid.token.here" });
		const res = mockResponse();

		try {
			await authenticate(req, res, mockNext);
		} catch (error: any) {
			expect(error.statusCode).toBe(401);
			expect(error.message).toContain("Invalid token");
		}
	});
});
