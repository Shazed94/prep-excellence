import emailService from "../infrastructure/email/email";
import queueService, { type Job } from "../infrastructure/queue/queue";
import logger from "../utils/logger";

// Queue names
export const QUEUE_NAMES = {
	EMAIL: "email",
	NOTIFICATION: "notification",
	DATA_PROCESSING: "data-processing",
	VIDEO_PROCESSING: "video-processing",
	VIDEO_CALLBACK: "video-callback", // For Go service to notify API
} as const;

// Job types
export const JOB_TYPES = {
	SEND_WELCOME_EMAIL: "send-welcome-email",
	SEND_PASSWORD_RESET: "send-password-reset",
	SEND_VERIFICATION: "send-verification",
	SEND_NOTIFICATION: "send-notification",
	// Video processing job types (sent TO Go service)
	PROCESS_VIDEO_HLS: "process-video-hls",
	// Video callback job types (received FROM Go service)
	VIDEO_METADATA_READY: "video-metadata-ready", // Quick callback with metadata/thumbnail
	VIDEO_PROCESSING_COMPLETE: "video-processing-complete",
	VIDEO_PROCESSING_FAILED: "video-processing-failed",
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

// ============================================
// Video Processing Job Interfaces
// ============================================

/**
 * Job data sent TO Go video processor
 * Flow: API uploads raw video to MinIO -> sends this job -> Go processes
 */
interface ProcessVideoHLSData {
	videoId: string;
	rawVideoUrl: string; // MinIO URL of the raw uploaded video
	outputBasePath: string; // Base path where HLS files will be stored (e.g., "videos/video-123")
	resolutions?: string[]; // Optional: ["1080p", "720p", "480p", "360p"] - defaults to all
	thumbnailTimestamp?: number; // Optional: seconds into video for thumbnail (default: 5)
	deleteRawAfterProcessing?: boolean; // Optional: delete raw video after processing (default: true)
}

/**
 * Job data received FROM Go video processor (metadata ready callback - sent first)
 */
interface VideoMetadataReadyData {
	videoId: string;
	thumbnailOptions: Array<{
		id: string; // e.g., "thumb_0", "thumb_1"
		url: string; // MinIO URL
		timestamp: number; // Timestamp in video where thumbnail was extracted
		index: number; // 0-4
	}>;
	duration: number; // Video duration in seconds
	metadata: {
		width: number;
		height: number;
		codec: string;
		bitrate: number;
		fps: number;
	};
	status: "metadata_extracted";
	extractedAt: string; // ISO timestamp
}

/**
 * Job data received FROM Go video processor (success callback)
 */
interface VideoProcessingCompleteData {
	videoId: string;
	masterPlaylistUrl: string; // URL to master.m3u8
	variantPlaylists: Array<{
		resolution: string;
		playlistUrl: string; // URL to specific resolution playlist
		bandwidth: number;
	}>;
	thumbnailUrl: string;
	duration: number; // Video duration in seconds
	metadata: {
		width: number;
		height: number;
		codec: string;
		bitrate: number;
		fps: number;
	};
	processedAt: string; // ISO timestamp
}

/**
 * Job data received FROM Go video processor (failure callback)
 */
interface VideoProcessingFailedData {
	videoId: string;
	error: string;
	failedAt: string; // ISO timestamp
}

// ============================================
// Video Callback Processors (FROM Go Service)
// ============================================

// Process metadata ready callback from Go service (sent first for quick feedback)
queueService.processJob<VideoMetadataReadyData>(
	QUEUE_NAMES.VIDEO_CALLBACK,
	JOB_TYPES.VIDEO_METADATA_READY,
	10, // High concurrency for quick updates
	async (job: Job<VideoMetadataReadyData>) => {
		logger.info(`Video metadata ready for ${job.data.videoId}`);

		// TODO: Update database with initial metadata and thumbnail options
		// This allows the uploader to see video info and choose a thumbnail
		// while HLS processing continues in the background
		// Example:
		// await prisma.video.update({
		//   where: { id: job.data.videoId },
		//   data: {
		//     status: 'awaiting_thumbnail_selection', // Waiting for user to choose
		//     thumbnailOptions: job.data.thumbnailOptions, // Store array of options
		//     duration: job.data.duration,
		//     metadata: job.data.metadata,
		//     metadataExtractedAt: new Date(job.data.extractedAt),
		//   }
		// });

		logger.info(
			`Updated video ${job.data.videoId} with metadata and ${job.data.thumbnailOptions?.length || 0} thumbnail options`,
		);
	},
);

// Process completion callback from Go service
queueService.processJob<VideoProcessingCompleteData>(
	QUEUE_NAMES.VIDEO_CALLBACK,
	JOB_TYPES.VIDEO_PROCESSING_COMPLETE,
	5,
	async (job: Job<VideoProcessingCompleteData>) => {
		logger.info(`Video processing completed for ${job.data.videoId}`);

		// TODO: Update database with video metadata
		// Example:
		// await prisma.video.update({
		//   where: { id: job.data.videoId },
		//   data: {
		//     status: 'ready',
		//     masterPlaylistUrl: job.data.masterPlaylistUrl,
		//     thumbnailUrl: job.data.thumbnailUrl,
		//     duration: job.data.duration,
		//     metadata: job.data.metadata,
		//     processedAt: new Date(job.data.processedAt),
		//   }
		// });

		logger.info(`Updated video ${job.data.videoId} status to ready`);
	},
);

// Process failure callback from Go service
queueService.processJob<VideoProcessingFailedData>(
	QUEUE_NAMES.VIDEO_CALLBACK,
	JOB_TYPES.VIDEO_PROCESSING_FAILED,
	3,
	async (job: Job<VideoProcessingFailedData>) => {
		logger.error(
			`Video processing failed for ${job.data.videoId}: ${job.data.error}`,
		);

		// TODO: Update database with error status
		// Example:
		// await prisma.video.update({
		//   where: { id: job.data.videoId },
		//   data: {
		//     status: 'failed',
		//     error: job.data.error,
		//     failedAt: new Date(job.data.failedAt),
		//   }
		// });

		logger.error(`Marked video ${job.data.videoId} as failed`);
	},
);

// ============================================
// Helper Functions to Enqueue Video Jobs
// ============================================

/**
 * Video job helpers - Send jobs TO Go service
 * Note: These jobs are consumed by the Go video-processor service
 */
export const videoJobs = {
	/**
	 * Process video into HLS format with multiple resolutions
	 *
	 * Flow:
	 * 1. Upload raw video to MinIO first
	 * 2. Call this function with the MinIO URL
	 * 3. Go service will process and create HLS chunks
	 * 4. Go service will callback via VIDEO_CALLBACK queue when done
	 *
	 * @param videoId - Unique video identifier
	 * @param rawVideoUrl - MinIO URL of uploaded raw video
	 * @param outputBasePath - Base path for HLS output (e.g., "videos/video-123")
	 * @param options - Optional processing options
	 */
	processVideoHLS: async (
		videoId: string,
		rawVideoUrl: string,
		outputBasePath: string,
		options?: {
			resolutions?: string[];
			thumbnailTimestamp?: number;
			deleteRawAfterProcessing?: boolean;
		},
	) => {
		return await queueService.addJob<ProcessVideoHLSData>(
			QUEUE_NAMES.VIDEO_PROCESSING,
			JOB_TYPES.PROCESS_VIDEO_HLS,
			{
				videoId,
				rawVideoUrl,
				outputBasePath,
				resolutions: options?.resolutions || ["1080p", "720p", "480p", "360p"],
				thumbnailTimestamp: options?.thumbnailTimestamp || 5,
				deleteRawAfterProcessing: options?.deleteRawAfterProcessing ?? true,
			},
			{ priority: 2, attempts: 3, timeout: 7200000 }, // 2 hour timeout for large videos
		);
	},
};

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
