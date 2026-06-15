import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import auditLogRoutes from "./apps/auditLog/routes";
import coachingRoutes from "./apps/coaching/routes";
import lmsRoutes from "./apps/lms/routes";
import oneToOneRoutes from "./apps/onetoone/routes";
import paymentRoutes from "./apps/payment/routes";
import roleRoutes from "./apps/role/routes";
import satPracticeRoutes from "./apps/satPractice/routes";
import serviceRouters from "./apps/services/routes";
import userRouter from "./apps/user/routes";
import config from "./config";
import swaggerOptions from "./config/swagger";
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

	// Swagger documentation
	const swaggerSpec = swaggerJsdoc(swaggerOptions);
	app.use(
		"/docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, {
			explorer: true,
			customCss: ".swagger-ui .topbar { display: none }",
			customSiteTitle: "PrepExcellence API Documentation",
		}),
	);

	// Swagger JSON endpoint
	app.get("/api-docs.json", (_req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});

	/**
	 * @swagger
	 * /health:
	 *   get:
	 *     summary: Health check endpoint
	 *     description: Returns the health status of the API
	 *     tags: [Health]
	 *     responses:
	 *       200:
	 *         description: API is healthy
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status:
	 *                   type: string
	 *                   example: ok
	 *                 timestamp:
	 *                   type: string
	 *                   format: date-time
	 *                 uptime:
	 *                   type: number
	 *                   description: Server uptime in seconds
	 *                 environment:
	 *                   type: string
	 *                   example: development
	 */
	// Health check
	app.get("/health", (_req: Request, res: Response) => {
		res.status(200).json({
			status: "ok",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			environment: config.nodeEnv,
		});
	});

	/**
	 * @swagger
	 * /metrics:
	 *   get:
	 *     summary: Prometheus metrics endpoint
	 *     description: Returns Prometheus-formatted metrics for monitoring
	 *     tags: [Health]
	 *     responses:
	 *       200:
	 *         description: Metrics in Prometheus format
	 *         content:
	 *           text/plain:
	 *             schema:
	 *               type: string
	 *       500:
	 *         description: Failed to get metrics
	 */
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
	app.use("/api/v1", userRouter);
	app.use("/api/v1", roleRoutes);
	app.use("/api/v1", serviceRouters);
	app.use("/api/v1/audit-logs", auditLogRoutes);

	// Learning platform routes
	app.use("/api/v1/lms", lmsRoutes);
	app.use("/api/v1/coaching", coachingRoutes);
	app.use("/api/v1/onetoone", oneToOneRoutes);
	app.use("/api/v1", paymentRoutes);

	app.use("/api/v1/sat-practice", satPracticeRoutes);

	// 404 handler
	app.use(notFound);

	// Error handler (must be last)
	app.use(errorHandler);

	return app;
}

const app = initializeApp();

export default app;
