import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.string().transform(Number).pipe(z.number().positive()).default(3000),

	// Database
	DATABASE_URL: z.url(),

	STORAGE_PUBLIC_URL: z.url(),

	// Redis
	REDIS_HOST: z.string().default("localhost"),
	REDIS_PORT: z.string().transform(Number).default(6379),
	REDIS_PASSWORD: z.string().optional(),

	// RabbitMQ
	RABBITMQ_URL: z.string().default("amqp://localhost:5672"),
	RABBITMQ_PREFETCH: z
		.string()
		.default("10")
		.transform(Number)
		.pipe(z.number().positive()),

	// Scheduler
	SCHEDULER_ENABLED: z
		.string()
		.default("true")
		.transform((val) => val !== "false"),
	SCHEDULER_TIMEZONE: z.string().default("UTC"),

	// JWT
	JWT_SECRET: z.string().min(32),
	JWT_EXPIRES_IN: z.string().default("7d"),
	JWT_REFRESH_SECRET: z.string().min(32),
	JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

	// AWS S3
	AWS_REGION: z.string().optional(),
	AWS_ACCESS_KEY_ID: z.string().optional(),
	AWS_SECRET_ACCESS_KEY: z.string().optional(),
	AWS_S3_BUCKET: z.string().optional(),

	// MinIO
	MINIO_ENDPOINT: z.string().default("localhost"),
	MINIO_PORT: z.string().transform(Number).default(9000),
	MINIO_USE_SSL: z
		.string()
		.transform((val) => val === "true")
		.default(false),
	MINIO_ACCESS_KEY: z.string().default("minioadmin"),
	MINIO_SECRET_KEY: z.string().default("minioadmin"),
	MINIO_BUCKET: z.string().default("prepexcellence"),
	MINIO_REGION: z.string().default("us-east-1"),

	// Socket.IO
	SOCKET_CORS_ORIGIN: z.string().optional(),

	// Frontend URL
	FRONTEND_URL: z.string().default("http://localhost:3000"),

	// Email
	EMAIL_HOST: z.string().default("smtp.gmail.com"),
	EMAIL_PORT: z.string().transform(Number).default(587),
	EMAIL_USER: z.string().optional(),
	EMAIL_PASSWORD: z.string().optional(),
	EMAIL_FROM: z.string().optional(),
	EMAIL_USE_SES: z
		.string()
		.transform((val) => val === "true")
		.default(false),

	// Rate Limiting
	RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(900000), // 15 minutes
	RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default(100),

	// CORS
	CORS_ORIGIN: z.string().default("*"),
});

const env = envSchema.parse(process.env);

const config = {
	nodeEnv: env.NODE_ENV,
	port: env.PORT,

	database: {
		url: env.DATABASE_URL,
	},

	redis: {
		host: env.REDIS_HOST,
		port: env.REDIS_PORT,
		password: env.REDIS_PASSWORD,
	},

	rabbitmq: {
		url: env.RABBITMQ_URL,
		prefetch: env.RABBITMQ_PREFETCH,
	},

	scheduler: {
		enabled: env.SCHEDULER_ENABLED,
		timezone: env.SCHEDULER_TIMEZONE,
	},

	jwt: {
		secret: env.JWT_SECRET,
		expiresIn: env.JWT_EXPIRES_IN,
		refreshSecret: env.JWT_REFRESH_SECRET,
		refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
	},

	aws: {
		region: env.AWS_REGION,
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
		s3Bucket: env.AWS_S3_BUCKET,
	},

	minio: {
		endpoint: env.MINIO_ENDPOINT,
		port: env.MINIO_PORT,
		useSSL: env.MINIO_USE_SSL,
		accessKey: env.MINIO_ACCESS_KEY,
		secretKey: env.MINIO_SECRET_KEY,
		bucket: env.MINIO_BUCKET,
		region: env.MINIO_REGION,
	},

	frontendUrl: env.CORS_ORIGIN,

	email: {
		host: env.EMAIL_HOST,
		port: env.EMAIL_PORT,
		user: env.EMAIL_USER,
		password: env.EMAIL_PASSWORD,
		from: env.EMAIL_FROM || env.EMAIL_USER || "noreply@example.com",
		useSes: env.EMAIL_USE_SES,
	},

	rateLimit: {
		windowMs: env.RATE_LIMIT_WINDOW_MS,
		maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
	},

	cors: {
		origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(","),
		credentials: true,
	},

	socket: {
		corsOrigin: env.CORS_ORIGIN || env.CORS_ORIGIN,
	},
	storage_url: {
		public_url: env.STORAGE_PUBLIC_URL || "localhost:3000",
	},
} as const;

export default config;
