import type { NextFunction, Request, Response } from "express";
import {
	Counter,
	collectDefaultMetrics,
	Gauge,
	Histogram,
	Registry,
} from "prom-client";
import logger from "../../utils/logger";

class MetricsService {
	private registry: Registry;

	// HTTP Metrics
	private httpRequestsTotal: Counter;
	private httpRequestDuration: Histogram;
	private httpRequestsInProgress: Gauge;
	private httpRequestSize: Histogram;
	private httpResponseSize: Histogram;

	// Application Metrics
	private activeUsersGauge: Gauge;
	private socketConnectionsGauge: Gauge;
	private queueJobsCounter: Counter;
	private queueJobDuration: Histogram;
	private cacheHitsCounter: Counter;
	private cacheMissesCounter: Counter;
	private emailsSentCounter: Counter;
	private emailErrorsCounter: Counter;

	// Business Metrics
	private userRegistrationsCounter: Counter;
	private userLoginsCounter: Counter;
	private fileUploadsCounter: Counter;
	private fileUploadSize: Histogram;

	// Database Metrics
	private dbQueryDuration: Histogram;
	private dbConnectionsGauge: Gauge;
	private dbErrorsCounter: Counter;

	constructor() {
		this.registry = new Registry();

		// Collect default metrics (CPU, memory, etc.)
		collectDefaultMetrics({ register: this.registry });

		// Initialize HTTP metrics
		this.httpRequestsTotal = new Counter({
			name: "http_requests_total",
			help: "Total number of HTTP requests",
			labelNames: ["method", "route", "status_code"],
			registers: [this.registry],
		});

		this.httpRequestDuration = new Histogram({
			name: "http_request_duration_seconds",
			help: "Duration of HTTP requests in seconds",
			labelNames: ["method", "route", "status_code"],
			buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
			registers: [this.registry],
		});

		this.httpRequestsInProgress = new Gauge({
			name: "http_requests_in_progress",
			help: "Number of HTTP requests currently in progress",
			labelNames: ["method"],
			registers: [this.registry],
		});

		this.httpRequestSize = new Histogram({
			name: "http_request_size_bytes",
			help: "Size of HTTP requests in bytes",
			labelNames: ["method", "route"],
			buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
			registers: [this.registry],
		});

		this.httpResponseSize = new Histogram({
			name: "http_response_size_bytes",
			help: "Size of HTTP responses in bytes",
			labelNames: ["method", "route", "status_code"],
			buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
			registers: [this.registry],
		});

		// Initialize application metrics
		this.activeUsersGauge = new Gauge({
			name: "active_users",
			help: "Number of currently active users",
			registers: [this.registry],
		});

		this.socketConnectionsGauge = new Gauge({
			name: "socket_connections",
			help: "Number of active WebSocket connections",
			registers: [this.registry],
		});

		this.queueJobsCounter = new Counter({
			name: "queue_jobs_total",
			help: "Total number of queue jobs processed",
			labelNames: ["queue", "status"],
			registers: [this.registry],
		});

		this.queueJobDuration = new Histogram({
			name: "queue_job_duration_seconds",
			help: "Duration of queue job processing in seconds",
			labelNames: ["queue", "job_type"],
			buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
			registers: [this.registry],
		});

		this.cacheHitsCounter = new Counter({
			name: "cache_hits_total",
			help: "Total number of cache hits",
			labelNames: ["cache_type"],
			registers: [this.registry],
		});

		this.cacheMissesCounter = new Counter({
			name: "cache_misses_total",
			help: "Total number of cache misses",
			labelNames: ["cache_type"],
			registers: [this.registry],
		});

		this.emailsSentCounter = new Counter({
			name: "emails_sent_total",
			help: "Total number of emails sent",
			labelNames: ["email_type", "status"],
			registers: [this.registry],
		});

		this.emailErrorsCounter = new Counter({
			name: "email_errors_total",
			help: "Total number of email errors",
			labelNames: ["email_type", "error_type"],
			registers: [this.registry],
		});

		// Initialize business metrics
		this.userRegistrationsCounter = new Counter({
			name: "user_registrations_total",
			help: "Total number of user registrations",
			registers: [this.registry],
		});

		this.userLoginsCounter = new Counter({
			name: "user_logins_total",
			help: "Total number of user logins",
			labelNames: ["status"],
			registers: [this.registry],
		});

		this.fileUploadsCounter = new Counter({
			name: "file_uploads_total",
			help: "Total number of file uploads",
			labelNames: ["file_type", "status"],
			registers: [this.registry],
		});

		this.fileUploadSize = new Histogram({
			name: "file_upload_size_bytes",
			help: "Size of uploaded files in bytes",
			labelNames: ["file_type"],
			buckets: [1000, 10000, 100000, 1000000, 10000000, 100000000],
			registers: [this.registry],
		});

		// Initialize database metrics
		this.dbQueryDuration = new Histogram({
			name: "db_query_duration_seconds",
			help: "Duration of database queries in seconds",
			labelNames: ["operation", "model"],
			buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
			registers: [this.registry],
		});

		this.dbConnectionsGauge = new Gauge({
			name: "db_connections",
			help: "Number of active database connections",
			registers: [this.registry],
		});

		this.dbErrorsCounter = new Counter({
			name: "db_errors_total",
			help: "Total number of database errors",
			labelNames: ["operation", "error_type"],
			registers: [this.registry],
		});

		logger.info("Metrics service initialized");
	}

	// HTTP Metrics Methods
	trackHttpRequest(
		method: string,
		route: string,
		statusCode: number,
		duration: number,
		requestSize?: number,
		responseSize?: number,
	): void {
		this.httpRequestsTotal.labels(method, route, statusCode.toString()).inc();
		this.httpRequestDuration
			.labels(method, route, statusCode.toString())
			.observe(duration);

		if (requestSize) {
			this.httpRequestSize.labels(method, route).observe(requestSize);
		}

		if (responseSize) {
			this.httpResponseSize
				.labels(method, route, statusCode.toString())
				.observe(responseSize);
		}
	}

	incrementHttpRequestsInProgress(method: string): void {
		this.httpRequestsInProgress.labels(method).inc();
	}

	decrementHttpRequestsInProgress(method: string): void {
		this.httpRequestsInProgress.labels(method).dec();
	}

	// Application Metrics Methods
	setActiveUsers(count: number): void {
		this.activeUsersGauge.set(count);
	}

	setSocketConnections(count: number): void {
		this.socketConnectionsGauge.set(count);
	}

	trackQueueJob(
		queue: string,
		status: "completed" | "failed",
		duration?: number,
		jobType?: string,
	): void {
		this.queueJobsCounter.labels(queue, status).inc();

		if (duration && jobType) {
			this.queueJobDuration.labels(queue, jobType).observe(duration);
		}
	}

	trackCacheHit(cacheType: string = "redis"): void {
		this.cacheHitsCounter.labels(cacheType).inc();
	}

	trackCacheMiss(cacheType: string = "redis"): void {
		this.cacheMissesCounter.labels(cacheType).inc();
	}

	trackEmailSent(emailType: string, status: "success" | "failed"): void {
		this.emailsSentCounter.labels(emailType, status).inc();
	}

	trackEmailError(emailType: string, errorType: string): void {
		this.emailErrorsCounter.labels(emailType, errorType).inc();
	}

	// Business Metrics Methods
	trackUserRegistration(): void {
		this.userRegistrationsCounter.inc();
	}

	trackUserLogin(status: "success" | "failed"): void {
		this.userLoginsCounter.labels(status).inc();
	}

	trackFileUpload(
		fileType: string,
		size: number,
		status: "success" | "failed",
	): void {
		this.fileUploadsCounter.labels(fileType, status).inc();

		if (status === "success") {
			this.fileUploadSize.labels(fileType).observe(size);
		}
	}

	// Database Metrics Methods
	trackDbQuery(operation: string, model: string, duration: number): void {
		this.dbQueryDuration.labels(operation, model).observe(duration);
	}

	setDbConnections(count: number): void {
		this.dbConnectionsGauge.set(count);
	}

	trackDbError(operation: string, errorType: string): void {
		this.dbErrorsCounter.labels(operation, errorType).inc();
	}

	// Custom Metrics Methods
	createCounter(
		name: string,
		help: string,
		labelNames: string[] = [],
	): Counter {
		return new Counter({
			name,
			help,
			labelNames,
			registers: [this.registry],
		});
	}

	createGauge(name: string, help: string, labelNames: string[] = []): Gauge {
		return new Gauge({
			name,
			help,
			labelNames,
			registers: [this.registry],
		});
	}

	createHistogram(
		name: string,
		help: string,
		labelNames: string[] = [],
		buckets?: number[],
	): Histogram {
		return new Histogram({
			name,
			help,
			labelNames,
			buckets,
			registers: [this.registry],
		});
	}

	// Get metrics
	async getMetrics(): Promise<string> {
		return await this.registry.metrics();
	}

	getRegistry(): Registry {
		return this.registry;
	}

	// Middleware
	middleware() {
		return (req: Request, res: Response, next: NextFunction) => {
			const start = Date.now();
			const route = req.route?.path || req.path;

			this.incrementHttpRequestsInProgress(req.method);

			// Get request size
			const requestSize = parseInt(req.get("content-length") || "0", 10);

			res.on("finish", () => {
				const duration = (Date.now() - start) / 1000;
				const responseSize = parseInt(res.get("content-length") || "0", 10);

				this.trackHttpRequest(
					req.method,
					route,
					res.statusCode,
					duration,
					requestSize,
					responseSize,
				);
				this.decrementHttpRequestsInProgress(req.method);
			});

			next();
		};
	}
}

export default new MetricsService();
