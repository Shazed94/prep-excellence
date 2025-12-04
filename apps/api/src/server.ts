import { createServer } from "http";
import emailService from "./infrastructure/email/email";
import queueService from "./infrastructure/queue/queue";
import minioService from "./infrastructure/storage/minio";
import socketService from "./infrastructure/websocket/socket";
import logger from "./utils/logger";

// Initialize queue processors
// import taskPollerService from './infrastructure/scheduler/task-poller';
import "./lib/queue-processors";
import app from "./app";
import config from "./config";
import cached from "./infrastructure/cache/cache";
import {
	initializeScheduledJobs,
	stopScheduledJobs,
} from "./lib/scheduled-jobs";

const startServer = async () => {
	try {
		// Connect to Redis
		await cached.connect();

		// Connect to RabbitMQ
		await queueService.connect();

		// Verify email configuration
		await emailService.verifyConnection();

		// Initialize MinIO bucket
		await minioService.initializeBucket();

		// Initialize scheduled jobs (cron tasks)
		initializeScheduledJobs();

		// Start database task poller (for dynamic scheduled tasks)
		// taskPollerService.start();

		// Create HTTP server
		const httpServer = createServer(app);

		// Initialize Socket.IO
		socketService.initialize(httpServer);

		// Start HTTP server
		httpServer.listen(config.port, "0.0.0.0", () => {
			logger.info(
				`Server running on port ${config.port} in ${config.nodeEnv} mode`,
			);
			logger.info(`Socket.IO ready on port ${config.port}`);
			logger.info(
				`Metrics available at http://localhost:${config.port}/metrics`,
			);
		});

		// Graceful shutdown
		const gracefulShutdown = async (signal: string) => {
			logger.info(`${signal} received. Starting graceful shutdown...`);

			httpServer.close(async () => {
				logger.info("HTTP server closed");

				// Stop scheduled jobs
				stopScheduledJobs();

				// Stop task poller
				// taskPollerService.stop();

				// Close Socket.IO
				await socketService.close();

				// Close Redis connection
				await cached.disconnect();

				// Close all queues
				await queueService.closeAllQueues();

				logger.info("All connections closed");
				process.exit(0);
			});

			// Force shutdown after 30 seconds
			setTimeout(() => {
				logger.error("Forced shutdown after timeout");
				process.exit(1);
			}, 30000);
		};

		process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
		process.on("SIGINT", () => gracefulShutdown("SIGINT"));
	} catch (error) {
		logger.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
