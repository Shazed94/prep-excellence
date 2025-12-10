import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";
import coachingRoutes from "./apps/coaching/routes";
import lmsRoutes from "./apps/lms/routes";
import oneToOneRoutes from "./apps/onetoone/routes";
import paymentRoutes from "./apps/payment/routes";
import roleRoutes from "./apps/role/routes";
import guidanceRouter from "./apps/services/routes";
import { authRouter, userRouter } from "./apps/user/routes";
import config from "./config";
import metricsService from "./infrastructure/metrics/metrics";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { rateLimiter } from "./middleware/rateLimiter";
import logger from "./utils/logger";


export function initializeApp(): Application {
	const app: Application = express();

	// Security middleware
	app.use(helmet());
	app.use(cors(config.cors));

	// Request parsing
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ extended: true, limit: "10mb" }));

	// Logging
	if (config.nodeEnv !== "test") {
		app.use(
			morgan("combined", {
				stream: { write: (message) => logger.info(message.trim()) },
			}),
		);
	}

	// Metrics middleware (track HTTP requests)
	app.use(metricsService.middleware());

	// Rate limiting
	app.use(rateLimiter);

	// Health check
	app.get("/health", (_req: Request, res: Response) => {
		res.status(200).json({
			status: "ok",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			environment: config.nodeEnv,
		});
	});

	// Metrics endpoint
	app.get("/metrics", async (_req: Request, res: Response) => {
		try {
			res.set("Content-Type", "text/plain");
			const metrics = await metricsService.getMetrics();
			res.send(metrics);
		} catch (error) {
			logger.error("Failed to get metrics:", error);
			res.status(500).send("Failed to get metrics");
		}
	});

	// API routes
	app.use("/api/v1", authRouter);
	app.use("/api/v1", userRouter);
	app.use("/api/v1", roleRoutes); // Role and permission management
	app.use("/api/v1/roles", guidanceRouter);

	// Learning platform routes
	app.use("/api/v1/lms", lmsRoutes);
	app.use("/api/v1/coaching", coachingRoutes);
	app.use("/api/v1/onetoone", oneToOneRoutes);
	app.use("/api/v1", paymentRoutes);

	// 404 handler
	app.use(notFound);

	// Error handler (must be last)
	app.use(errorHandler);

	return app;
}

const app = initializeApp();

export default app;
