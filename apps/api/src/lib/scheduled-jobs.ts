import config from "../config";
import schedulerService from "../infrastructure/scheduler/scheduler";
import logger from "../utils/logger";

/**
 * Cron Pattern Quick Reference:
 * ┌────────────── second (optional, 0-59)
 * │ ┌──────────── minute (0-59)
 * │ │ ┌────────── hour (0-23)
 * │ │ │ ┌──────── day of month (1-31)
 * │ │ │ │ ┌────── month (1-12)
 * │ │ │ │ │ ┌──── day of week (0-6, Sunday=0)
 * │ │ │ │ │ │
 * * * * * * *


// Define all scheduled jobs here
export const scheduledJobs: ScheduledJob[] = [
    // Example: Daily report generation
    {
        name: 'daily-report',
        cronPattern: '0 9 * * *', // Every day at 9:00 AM
        queueName: QUEUE_NAMES.EMAIL,
        jobName: 'generate-daily-report',
        data: { reportType: 'daily' },
        enabled: true,
        timezone: 'America/New_York',
        priority: 5,
    },

    // Example: Weekly cleanup
    {
        name: 'weekly-cleanup',
        cronPattern: '0 2 * * 0', // Every Sunday at 2:00 AM
        queueName: QUEUE_NAMES.DATA_PROCESSING,
        jobName: 'cleanup-old-data',
        data: { olderThanDays: 90 },
        enabled: true,
        timezone: 'UTC',
        priority: 3,
    },

    // Example: Check payment status every 30 minutes
    {
      
queueName: QUEUE_NAMES.NOTIFICATION,
    jobName: 'check-payment-status',
        data: { },
enabled: true,
    timezone: 'UTC',
        priority: 7,
    },

// Example: Monthly subscription renewal reminder
{
    name: 'monthly-subscription-reminder',
        cronPattern: '0 10 1 * *', // First day of month at 10:00 AM
            queueName: QUEUE_NAMES.EMAIL,
                jobName: 'send-subscription-reminder',
                    data: { },
    enabled: true,
        timezone: 'America/New_York',
            priority: 6,
    },

    // Example: Backup database (commented out by default)
    // {
    //     name: 'database-backup',
    //     cronPattern: '0 3 * * *', // Every day at 3:00 AM
    //     queueName: QUEUE_NAMES.DATA_PROCESSING,
    //     jobName: 'backup-database',
    //     data: { backupType: 'full' },
    //     enabled: false,
    //     timezone: 'UTC',
    //     priority: 10,
    // },

    // Example: Send reminder emails every hour during business hours
    // {
    //     name: 'hourly-reminder-emails',
    //     cronPattern: '0 9-17 * * 1-5', // Mon-Fri, 9 AM - 5 PM
    //     queueName: QUEUE_NAMES.EMAIL,
    //     jobName: 'send-reminder-emails',
    //     data: {},
    //     enabled: true,
    //     timezone: 'America/New_York',
    //     priority: 5,
    // },
];

/**
 * Initialize all scheduled jobs
 * Call this function during application startup
 */
export const initializeScheduledJobs = (): void => {
	if (!config.scheduler.enabled) {
		logger.info("[Scheduled Jobs] Scheduler is disabled via config");
		return;
	}

	logger.info("[Scheduled Jobs] Initializing scheduled jobs...");

	try {
		schedulerService.registerJobs([]);

		const stats = schedulerService.getStats();
		logger.info(
			`[Scheduled Jobs] Initialized ${stats.total} jobs (${stats.enabled} enabled, ${stats.disabled} disabled)`,
		);
	} catch (error) {
		logger.error(
			"[Scheduled Jobs] Failed to initialize scheduled jobs:",
			error,
		);
		throw error;
	}
}; /**
 * Gracefully stop all scheduled jobs
 * Call this during application shutdown
 */
export const stopScheduledJobs = (): void => {
	logger.info("[Scheduled Jobs] Stopping all scheduled jobs...");
	schedulerService.stopAll();
};
