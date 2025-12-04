import * as cron from "node-cron";
import logger from "../../utils/logger";
import queueService from "../queue/queue";

export interface ScheduledJob {
	name: string;
	cronPattern: string;
	queueName: string;
	jobName: string;
	data?: any;
	enabled?: boolean;
	timezone?: string;
	priority?: number;
}

class SchedulerService {
	private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();
	private jobConfigs: Map<string, ScheduledJob> = new Map();

	/**
	 * Register a new scheduled job
	 * @param job - Scheduled job configuration
	 */
	registerJob(job: ScheduledJob): void {
		// Validate cron pattern
		if (!cron.validate(job.cronPattern)) {
			throw new Error(`Invalid cron pattern: ${job.cronPattern}`);
		}

		// Check if job already exists
		if (this.scheduledJobs.has(job.name)) {
			logger.warn(
				`Scheduled job ${job.name} already exists. Unregistering old job.`,
			);
			this.unregisterJob(job.name);
		}

		const enabled = job.enabled !== false; // Default to true
		const timezone = job.timezone || "UTC";
		const priority = job.priority || 5;

		// Create the cron task
		const task = cron.schedule(
			job.cronPattern,
			async () => {
				const config = this.jobConfigs.get(job.name);
				if (!config || config.enabled === false) {
					logger.debug(`Skipping disabled job: ${job.name}`);
					return;
				}

				try {
					logger.info(`[Scheduler] Triggering job: ${job.name}`);

					await queueService.addJob(
						job.queueName,
						job.jobName,
						job.data || {},
						{ priority },
					);

					logger.info(`[Scheduler] Successfully queued job: ${job.name}`);
				} catch (error) {
					logger.error(`[Scheduler] Failed to trigger job ${job.name}:`, error);
				}
			},
			{
				timezone,
			},
		);

		this.scheduledJobs.set(job.name, task);
		this.jobConfigs.set(job.name, { ...job, enabled, timezone, priority });

		logger.info(
			`[Scheduler] Registered job: ${job.name} | Pattern: ${job.cronPattern} | Timezone: ${timezone} | Enabled: ${enabled}`,
		);
	}

	/**
	 * Register multiple jobs at once
	 * @param jobs - Array of scheduled job configurations
	 */
	registerJobs(jobs: ScheduledJob[]): void {
		for (const job of jobs) {
			this.registerJob(job);
		}
	}

	/**
	 * Unregister a scheduled job
	 * @param name - Job name to unregister
	 */
	unregisterJob(name: string): boolean {
		const task = this.scheduledJobs.get(name);
		if (task) {
			task.stop();
			this.scheduledJobs.delete(name);
			this.jobConfigs.delete(name);
			logger.info(`[Scheduler] Unregistered job: ${name}`);
			return true;
		}
		logger.warn(`[Scheduler] Job not found: ${name}`);
		return false;
	}

	/**
	 * Enable a scheduled job
	 * @param name - Job name to enable
	 */
	enableJob(name: string): boolean {
		const config = this.jobConfigs.get(name);
		const task = this.scheduledJobs.get(name);

		if (config && task) {
			config.enabled = true;
			task.start();
			logger.info(`[Scheduler] Enabled job: ${name}`);
			return true;
		}
		logger.warn(`[Scheduler] Job not found: ${name}`);
		return false;
	}

	/**
	 * Disable a scheduled job (without unregistering)
	 * @param name - Job name to disable
	 */
	disableJob(name: string): boolean {
		const config = this.jobConfigs.get(name);
		const task = this.scheduledJobs.get(name);

		if (config && task) {
			config.enabled = false;
			task.stop();
			logger.info(`[Scheduler] Disabled job: ${name}`);
			return true;
		}
		logger.warn(`[Scheduler] Job not found: ${name}`);
		return false;
	}

	/**
	 * Get all registered jobs
	 */
	getJobs(): ScheduledJob[] {
		return Array.from(this.jobConfigs.values());
	}

	/**
	 * Get a specific job configuration
	 * @param name - Job name
	 */
	getJob(name: string): ScheduledJob | undefined {
		return this.jobConfigs.get(name);
	}

	/**
	 * Check if a job is registered
	 * @param name - Job name
	 */
	hasJob(name: string): boolean {
		return this.scheduledJobs.has(name);
	}

	/**
	 * Stop all scheduled jobs
	 */
	stopAll(): void {
		logger.info("[Scheduler] Stopping all scheduled jobs...");
		this.scheduledJobs.forEach((task, name) => {
			task.stop();
			logger.info(`[Scheduler] Stopped job: ${name}`);
		});
		this.scheduledJobs.clear();
		this.jobConfigs.clear();
		logger.info("[Scheduler] All scheduled jobs stopped");
	}

	/**
	 * Start all scheduled jobs
	 */
	startAll(): void {
		logger.info("[Scheduler] Starting all scheduled jobs...");
		this.scheduledJobs.forEach((task, name) => {
			const config = this.jobConfigs.get(name);
			if (config && config.enabled !== false) {
				task.start();
				logger.info(`[Scheduler] Started job: ${name}`);
			}
		});
	}

	/**
	 * Get scheduler statistics
	 */
	getStats(): {
		total: number;
		enabled: number;
		disabled: number;
	} {
		let enabled = 0;
		let disabled = 0;

		this.jobConfigs.forEach((config) => {
			if (config.enabled !== false) {
				enabled++;
			} else {
				disabled++;
			}
		});

		return {
			total: this.jobConfigs.size,
			enabled,
			disabled,
		};
	}
}

export default new SchedulerService();
