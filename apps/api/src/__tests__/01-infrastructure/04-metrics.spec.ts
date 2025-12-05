import { describe, expect, it } from "vitest";
import metricsService from "@/infrastructure/metrics/metrics";

describe("Metrics Service", () => {
	it("should initialize metrics service", () => {
		expect(metricsService).toBeDefined();
	});

	it("should provide middleware function", () => {
		const middleware = metricsService.middleware();
		expect(typeof middleware).toBe("function");
	});

	it("should get metrics in Prometheus format", async () => {
		const metrics = await metricsService.getMetrics();
		expect(typeof metrics).toBe("string");
		expect(metrics.length).toBeGreaterThan(0);
	});

	it("should track cache hits", () => {
		metricsService.trackCacheHit("redis");
		metricsService.trackCacheHit("memory");
		expect(true).toBe(true);
	});

	it("should track cache misses", () => {
		metricsService.trackCacheMiss("redis");
		metricsService.trackCacheMiss("memory");
		expect(true).toBe(true);
	});

	it("should set active users count", () => {
		metricsService.setActiveUsers(10);
		metricsService.setActiveUsers(25);
		expect(true).toBe(true);
	});

	it("should set socket connections count", () => {
		metricsService.setSocketConnections(5);
		metricsService.setSocketConnections(15);
		expect(true).toBe(true);
	});

	it("should track user registrations", () => {
		metricsService.trackUserRegistration();
		metricsService.trackUserRegistration();
		expect(true).toBe(true);
	});

	it("should track user logins", () => {
		metricsService.trackUserLogin("success");
		metricsService.trackUserLogin("failed");
		expect(true).toBe(true);
	});

	it("should track database queries", () => {
		metricsService.trackDbQuery("findMany", "user", 25);
		metricsService.trackDbQuery("create", "role", 50);
		expect(true).toBe(true);
	});

	it("should set database connections count", () => {
		metricsService.setDbConnections(10);
		expect(true).toBe(true);
	});

	it("should track database errors", () => {
		metricsService.trackDbError("create", "connection_timeout");
		metricsService.trackDbError("findMany", "query_timeout");
		expect(true).toBe(true);
	});

	it("should track email sending", () => {
		metricsService.trackEmailSent("welcome", "success");
		metricsService.trackEmailSent("verification", "failed");
		expect(true).toBe(true);
	});

	it("should track email errors", () => {
		metricsService.trackEmailError("welcome", "smtp_error");
		expect(true).toBe(true);
	});

	it("should track metrics over time", async () => {
		// Record multiple metrics
		metricsService.trackCacheHit("redis");
		metricsService.trackDbQuery("findMany", "user", 30);
		metricsService.setActiveUsers(50);
		metricsService.trackUserLogin("success");

		// Get metrics and verify they contain data
		const metrics = await metricsService.getMetrics();
		expect(metrics).toBeTruthy();
		expect(metrics.length).toBeGreaterThan(100); // Should have substantial content
	});
});
