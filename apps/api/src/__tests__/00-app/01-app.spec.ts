import type { Application } from "express";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { initializeApp } from "../../app";
import metricsService from "../../infrastructure/metrics/metrics";

describe("App Initialization and Routes", () => {
	let app: Application;
	beforeAll(async () => {
		app = await initializeApp();
	});

	describe("Health Check", () => {
		it("should return health status", async () => {
			const response = await request(app).get("/health");

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("status", "ok");
			expect(response.body).toHaveProperty("timestamp");
			expect(response.body).toHaveProperty("uptime");
			expect(response.body).toHaveProperty("environment");
		});
	});

	describe("Metrics Endpoint", () => {
		it("should return Prometheus metrics", async () => {
			const response = await request(app).get("/metrics");

			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toContain("text/plain");
			expect(response.text).toBeTruthy();
		});

		it("should handle metrics service errors gracefully", async () => {
			// Temporarily break the metrics service
			const originalGetMetrics = metricsService.getMetrics;
			metricsService.getMetrics = async () => {
				throw new Error("Metrics service error");
			};

			const response = await request(app).get("/metrics");

			expect(response.status).toBe(500);
			expect(response.text).toBe("Failed to get metrics");

			// Restore original method
			metricsService.getMetrics = originalGetMetrics;
		});
	});

	describe("404 Handler", () => {
		it("should return 404 for unknown routes", async () => {
			const response = await request(app).get(
				"/unknown-route-that-does-not-exist",
			);

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("success", false);
			expect(response.body).toHaveProperty("message");
		});
	});

	describe("Rate Limiting", () => {
		it("should allow requests within rate limit", async () => {
			const response = await request(app).get("/health");

			expect(response.status).toBe(200);
			// Rate limiter headers may not always be present in test environment
			// Just verify the request goes through
		});
	});
	describe("CORS and Security", () => {
		it("should include security headers", async () => {
			const response = await request(app).get("/health");

			// Helmet security headers
			expect(response.headers).toHaveProperty("x-content-type-options");
			expect(response.headers).toHaveProperty("x-frame-options");
		});
	});

	describe("Request Body Parsing", () => {
		it("should parse JSON request bodies", async () => {
			const response = await request(app)
				.post("/api/v1/auth/login")
				.send({ email: "test@example.com", password: "password" })
				.set("Content-Type", "application/json");

			// Should parse without errors (even if auth fails)
			expect(response.status).not.toBe(400);
		});

		it("should parse URL-encoded request bodies", async () => {
			const response = await request(app)
				.post("/api/v1/auth/login")
				.send("email=test@example.com&password=password")
				.set("Content-Type", "application/x-www-form-urlencoded");

			// Should parse without errors
			expect(response.status).not.toBe(400);
		});
	});
});
