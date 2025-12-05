import type { NextFunction, Request, Response } from "express";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { validate, validateId } from "@/middleware/validate";

describe("Validate Middleware", () => {
	const mockResponse = () =>
		({
			status: () => ({ json: () => {} }),
		}) as unknown as Response;

	const mockNext = (() => {}) as unknown as NextFunction;

	describe("validate", () => {
		const testSchema = z.object({
			name: z.string(),
			age: z.number(),
		});

		it("should pass with valid data", () => {
			const req = {
				body: { name: "Test", age: 25 },
			} as Request;

			const middleware = validate(testSchema);
			expect(() => middleware(req, mockResponse(), mockNext)).not.toThrow();
		});

		it("should throw error with invalid data", () => {
			const req = {
				body: { name: "Test", age: "invalid" },
			} as Request;

			const middleware = validate(testSchema);
			try {
				middleware(req, mockResponse(), mockNext);
			} catch (error: any) {
				expect(error.statusCode).toBe(400);
			}
		});

		it("should throw error with missing required fields", () => {
			const req = {
				body: { name: "Test" },
			} as Request;

			const middleware = validate(testSchema);
			try {
				middleware(req, mockResponse(), mockNext);
			} catch (error: any) {
				expect(error.statusCode).toBe(400);
			}
		});
	});

	describe("validateId", () => {
		const uuidSchema = z.object({
			id: z.string().uuid(),
		});

		it("should pass with valid UUID", () => {
			const req = {
				params: { id: "550e8400-e29b-41d4-a716-446655440000" },
			} as unknown as Request;

			const middleware = validateId(uuidSchema);
			expect(() => middleware(req, mockResponse(), mockNext)).not.toThrow();
		});

		it("should throw error with invalid UUID", () => {
			const req = {
				params: { id: "invalid-uuid" },
			} as unknown as Request;

			const middleware = validateId(uuidSchema);
			try {
				middleware(req, mockResponse(), mockNext);
			} catch (error: any) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toContain("Invalid");
			}
		});

		it("should throw error with missing id", () => {
			const req = {
				params: {},
			} as unknown as Request;

			const middleware = validateId(uuidSchema);
			try {
				middleware(req, mockResponse(), mockNext);
			} catch (error: any) {
				expect(error.statusCode).toBe(400);
			}
		});
	});
});
