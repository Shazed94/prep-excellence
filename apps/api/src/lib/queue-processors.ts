import emailService from "../infrastructure/email/email";
import queueService, { type Job } from "../infrastructure/queue/queue";
import logger from "../utils/logger";

// Queue names
export const QUEUE_NAMES = {
	EMAIL: "email",
	NOTIFICATION: "notification",
	DATA_PROCESSING: "data-processing",
} as const;

// Job types
export const JOB_TYPES = {
	SEND_WELCOME_EMAIL: "send-welcome-email",
	SEND_PASSWORD_RESET: "send-password-reset",
	SEND_VERIFICATION: "send-verification",
	SEND_NOTIFICATION: "send-notification",
	// Scheduled job types
	GENERATE_DAILY_REPORT: "generate-daily-report",
	CLEANUP_OLD_DATA: "cleanup-old-data",
	CHECK_PAYMENT_STATUS: "check-payment-status",
	SEND_SUBSCRIPTION_REMINDER: "send-subscription-reminder",
} as const;

// Email job data types
interface WelcomeEmailData {
	email: string;
	name: string;
}

interface PasswordResetData {
	email: string;
	resetToken: string;
}

interface VerificationEmailData {
	email: string;
	verificationToken: string;
}

interface NotificationEmailData {
	email: string;
	title: string;
	message: string;
}

// Email Queue Processors
queueService.processJob<WelcomeEmailData>(
	QUEUE_NAMES.EMAIL,
	JOB_TYPES.SEND_WELCOME_EMAIL,
	5, // concurrency
	async (job: Job<WelcomeEmailData>) => {
		logger.info(`Processing welcome email job ${job.id}`);
		await emailService.sendWelcomeEmail(job.data.email, job.data.name);
	},
);

queueService.processJob<PasswordResetData>(
	QUEUE_NAMES.EMAIL,
	JOB_TYPES.SEND_PASSWORD_RESET,
	5,
	async (job: Job<PasswordResetData>) => {
		logger.info(`Processing password reset email job ${job.id}`);
		await emailService.sendPasswordResetEmail(
			job.data.email,
			job.data.resetToken,
		);
	},
);

queueService.processJob<VerificationEmailData>(
	QUEUE_NAMES.EMAIL,
	JOB_TYPES.SEND_VERIFICATION,
	5,
	async (job: Job<VerificationEmailData>) => {
		logger.info(`Processing verification email job ${job.id}`);
		await emailService.sendVerificationEmail(
			job.data.email,
			job.data.verificationToken,
		);
	},
);

queueService.processJob<NotificationEmailData>(
	QUEUE_NAMES.EMAIL,
	JOB_TYPES.SEND_NOTIFICATION,
	10,
	async (job: Job<NotificationEmailData>) => {
		logger.info(`Processing notification email job ${job.id}`);
		await emailService.sendNotificationEmail(
			job.data.email,
			job.data.title,
			job.data.message,
		);
	},
);

// ============================================
// Scheduled Job Processors
// ============================================

// Daily report generation
queueService.processJob(
	QUEUE_NAMES.EMAIL,
	JOB_TYPES.GENERATE_DAILY_REPORT,
	1,
	async (job: Job) => {
		logger.info(`[Scheduled] Generating daily report - Job ${job.id}`);
		// TODO: Implement daily report generation logic
		// Example: Query database, generate report, send emails
		logger.info(`Daily report generated successfully`);
	},
);

// Cleanup old data
queueService.processJob(
	QUEUE_NAMES.DATA_PROCESSING,
	JOB_TYPES.CLEANUP_OLD_DATA,
	1,
	async (job: Job) => {
		logger.info(`[Scheduled] Cleaning up old data - Job ${job.id}`);
		const { olderThanDays } = job.data;
		// TODO: Implement cleanup logic
		// Example: Delete records older than X days
		logger.info(`Cleanup completed for data older than ${olderThanDays} days`);
	},
);

// Check payment status
queueService.processJob(
	QUEUE_NAMES.NOTIFICATION,
	JOB_TYPES.CHECK_PAYMENT_STATUS,
	2,
	async (job: Job) => {
		logger.info(`[Scheduled] Checking payment status - Job ${job.id}`);
		// TODO: Implement payment status check logic
		// Example: Query payment gateway, update database, send notifications
		logger.info(`Payment status check completed`);
	},
);

// Send subscription reminders
queueService.processJob(
	QUEUE_NAMES.EMAIL,
	JOB_TYPES.SEND_SUBSCRIPTION_REMINDER,
	3,
	async (job: Job) => {
		logger.info(`[Scheduled] Sending subscription reminders - Job ${job.id}`);
		// TODO: Implement subscription reminder logic
		// Example: Find expiring subscriptions, send reminder emails
		logger.info(`Subscription reminders sent successfully`);
	},
);

// Helper functions to add jobs
export const emailJobs = {
	sendWelcomeEmail: async (email: string, name: string) => {
		return await queueService.addJob<WelcomeEmailData>(
			QUEUE_NAMES.EMAIL,
			JOB_TYPES.SEND_WELCOME_EMAIL,
			{ email, name },
			{ priority: 1 },
		);
	},

	sendPasswordResetEmail: async (email: string, resetToken: string) => {
		return await queueService.addJob<PasswordResetData>(
			QUEUE_NAMES.EMAIL,
			JOB_TYPES.SEND_PASSWORD_RESET,
			{ email, resetToken },
			{ priority: 2 },
		);
	},

	sendVerificationEmail: async (email: string, verificationToken: string) => {
		return await queueService.addJob<VerificationEmailData>(
			QUEUE_NAMES.EMAIL,
			JOB_TYPES.SEND_VERIFICATION,
			{ email, verificationToken },
			{ priority: 1 },
		);
	},

	sendNotificationEmail: async (
		email: string,
		title: string,
		message: string,
	) => {
		return await queueService.addJob<NotificationEmailData>(
			QUEUE_NAMES.EMAIL,
			JOB_TYPES.SEND_NOTIFICATION,
			{ email, title, message },
			{ priority: 3 },
		);
	},
};

logger.info("Queue processors initialized");
