import { describe, expect, it, vi } from "vitest";
import logger from "@/utils/logger";

describe("Logger Utility", () => {
	// Spy on console.log to verify logging behavior
	const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

	describe("info logging", () => {
		it("should log info messages", () => {
			logger.info("Test info message");
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.level).toBe("INFO");
			expect(loggedData.message).toBe("Test info message");
		});

		it("should log info with metadata", () => {
			logger.info("Test with meta", { userId: "123", action: "login" });
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.meta).toEqual({ userId: "123", action: "login" });
		});
	});

	describe("warn logging", () => {
		it("should log warning messages", () => {
			logger.warn("Test warning message");
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.level).toBe("WARN");
			expect(loggedData.message).toBe("Test warning message");
		});

		it("should log warnings with metadata", () => {
			logger.warn("Resource limit approaching", { limit: 90, current: 85 });
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.meta).toEqual({ limit: 90, current: 85 });
		});
	});

	describe("error logging", () => {
		it("should log error messages", () => {
			logger.error("Test error message");
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.level).toBe("ERROR");
			expect(loggedData.message).toBe("Test error message");
		});

		it("should log error objects as JSON strings", () => {
			const errorObj = { code: "ERR_001", details: "Something went wrong" };
			logger.error(errorObj);
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.level).toBe("ERROR");
			expect(loggedData.message).toBe(JSON.stringify(errorObj));
		});

		it("should log errors with metadata", () => {
			logger.error("Database connection failed", {
				host: "localhost",
				port: 5432,
			});
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.meta).toEqual({ host: "localhost", port: 5432 });
		});
	});

	describe("debug logging", () => {
		it("should log debug messages", () => {
			logger.debug("Test debug message");
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.level).toBe("DEBUG");
			expect(loggedData.message).toBe("Test debug message");
		});

		it("should log debug with metadata", () => {
			logger.debug("Cache miss", { key: "user:123", ttl: 300 });
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.meta).toEqual({ key: "user:123", ttl: 300 });
		});
	});

	describe("timestamp formatting", () => {
		it("should include timestamp in UTC format", () => {
			logger.info("Timestamp test");
			expect(consoleLogSpy).toHaveBeenCalled();
			const loggedData = JSON.parse(
				consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0],
			);
			expect(loggedData.timestamp).toBeDefined();
			expect(loggedData.timestamp).toMatch(
				/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
			);
		});
	});
});
