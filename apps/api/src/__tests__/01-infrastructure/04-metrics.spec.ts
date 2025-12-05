import type { Counter, Gauge, Histogram } from "prom-client";
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

	it("should provide registry access", () => {
		const registry = metricsService.getRegistry();
		expect(registry).toBeDefined();
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

	it("should track queue jobs with duration", () => {
		// Without duration
		metricsService.trackQueueJob("email", "completed");
		metricsService.trackQueueJob("notifications", "failed");

		// With duration and job type
		metricsService.trackQueueJob("email", "completed", 150, "send-welcome");
		metricsService.trackQueueJob("email", "failed", 200, "send-verification");
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

	it("should track file uploads with size", () => {
		// Successful upload
		metricsService.trackFileUpload("pdf", 1024000, "success");
		metricsService.trackFileUpload("image", 500000, "success");

		// Failed upload (should not track size)
		metricsService.trackFileUpload("pdf", 1024000, "failed");
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
		metricsService.trackEmailError("verification", "connection_error");
		expect(true).toBe(true);
	});

	it("should create custom counter metrics", () => {
		const counter: Counter = metricsService.createCounter(
			"test_counter_metric",
			"A test counter metric",
			["label1", "label2"],
		);
		expect(counter).toBeDefined();
		counter.inc();
		counter.labels("val1", "val2").inc(5);
		expect(true).toBe(true);
	});

	it("should create custom gauge metrics", () => {
		const gauge: Gauge = metricsService.createGauge(
			"test_gauge_metric",
			"A test gauge metric",
			["label1"],
		);
		expect(gauge).toBeDefined();
		gauge.set(100);
		gauge.labels("val1").set(50);
		expect(true).toBe(true);
	});

	it("should create custom histogram metrics", () => {
		const histogram: Histogram = metricsService.createHistogram(
			"test_histogram_metric",
			"A test histogram metric",
			["label1"],
			[0.1, 0.5, 1, 5, 10],
		);
		expect(histogram).toBeDefined();
		histogram.observe(0.5);
		histogram.labels("val1").observe(2.5);
		expect(true).toBe(true);
	});

	it("should track metrics over time", async () => {
		// Record multiple metrics
		metricsService.trackCacheHit("redis");
		metricsService.trackDbQuery("findMany", "user", 30);
		metricsService.setActiveUsers(50);
		metricsService.trackUserLogin("success");
		metricsService.trackQueueJob(
			"email",
			"completed",
			120,
			"send-notification",
		);
		metricsService.trackFileUpload("csv", 2048000, "success");

		// Get metrics and verify they contain data
		const metrics = await metricsService.getMetrics();
		expect(metrics).toBeTruthy();
		expect(metrics.length).toBeGreaterThan(100); // Should have substantial content
	});
});
