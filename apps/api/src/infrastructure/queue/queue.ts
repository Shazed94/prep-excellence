import { randomUUID } from "node:crypto";
import * as amqp from "amqplib";
import config from "../../config";
import logger from "../../utils/logger";

export interface JobOptions {
	priority?: number;
	delay?: number;
	attempts?: number;
	timeout?: number;
}

export interface Job<T = any> {
	id: string;
	queueName: string;
	jobName: string;
	data: T;
	attempts: number;
	maxAttempts: number;
	timestamp: number;
}

type JobProcessor<T = any> = (job: Job<T>) => Promise<any>;

interface QueueInfo {
	channel: amqp.Channel;
	processors: Map<string, { processor: JobProcessor; concurrency: number }>;
	activeJobs: number;
}

class QueueService {
	private connection: amqp.ChannelModel | null = null;
	private queues: Map<string, QueueInfo> = new Map();
	private isConnecting: boolean = false;
	private reconnectTimeout: NodeJS.Timeout | null = null;

	async connect(): Promise<void> {
		if (this.connection || this.isConnecting) {
			return;
		}

		this.isConnecting = true;
		try {
			this.connection = await amqp.connect(config.rabbitmq.url);
			logger.info("Connected to RabbitMQ");

			this.connection.on("error", (err: Error) => {
				logger.error("RabbitMQ connection error:", err);
				this.handleConnectionError();
			});

			this.connection.on("close", () => {
				logger.warn("RabbitMQ connection closed");
				this.handleConnectionError();
			});
		} catch (error) {
			logger.error("Failed to connect to RabbitMQ:", error);
			this.scheduleReconnect();
		} finally {
			this.isConnecting = false;
		}
	}

	private handleConnectionError(): void {
		this.connection = null;
		this.queues.clear();
		this.scheduleReconnect();
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimeout) {
			return;
		}

		this.reconnectTimeout = setTimeout(async () => {
			this.reconnectTimeout = null;
			logger.info("Attempting to reconnect to RabbitMQ...");
			await this.connect();
		}, 5000);
	}

	private async ensureConnection(): Promise<void> {
		if (!this.connection) {
			await this.connect();
		}
		if (!this.connection) {
			throw new Error("Failed to establish RabbitMQ connection");
		}
	}

	private async getOrCreateQueue(queueName: string): Promise<QueueInfo> {
		await this.ensureConnection();

		let queueInfo = this.queues.get(queueName);
		if (queueInfo) {
			return queueInfo;
		}

		const channel = await this.connection?.createChannel();
		if (!channel) {
			throw new Error("Failed to create channel");
		}

		await channel.prefetch(config.rabbitmq.prefetch);

		// Declare the main queue
		await channel.assertQueue(queueName, {
			durable: true,
			arguments: {
				"x-max-priority": 10, // Support priority from 0-10
			},
		});

		// Declare dead letter queue for failed jobs
		const dlqName = `${queueName}.dlq`;
		await channel.assertQueue(dlqName, { durable: true });

		// Declare delayed message exchange and queue
		const delayExchange = `${queueName}.delay`;
		await channel.assertExchange(delayExchange, "direct", { durable: true });

		queueInfo = {
			channel,
			processors: new Map(),
			activeJobs: 0,
		};

		this.queues.set(queueName, queueInfo);
		logger.info(`Queue ${queueName} created and configured`);

		return queueInfo;
	}

	async addJob<T = any>(
		queueName: string,
		jobName: string,
		data: T,
		options: JobOptions = {},
	): Promise<Job<T>> {
		const queueInfo = await this.getOrCreateQueue(queueName);
		const job: Job<T> = {
			id: randomUUID(),
			queueName,
			jobName,
			data,
			attempts: 0,
			maxAttempts: options.attempts || 3,
			timestamp: Date.now(),
		};

		const message = Buffer.from(JSON.stringify(job));
		const publishOptions: any = {
			persistent: true,
			priority: options.priority || 0,
			messageId: job.id,
		};

		if (options.delay && options.delay > 0) {
			// Use delayed message pattern
			const delayExchange = `${queueName}.delay`;
			const delayQueue = `${queueName}.delay.${options.delay}`;

			await queueInfo.channel.assertQueue(delayQueue, {
				durable: true,
				arguments: {
					"x-message-ttl": options.delay,
					"x-dead-letter-exchange": "",
					"x-dead-letter-routing-key": queueName,
				},
			});

			await queueInfo.channel.bindQueue(delayQueue, delayExchange, delayQueue);
			queueInfo.channel.publish(
				delayExchange,
				delayQueue,
				message,
				publishOptions,
			);
		} else {
			queueInfo.channel.sendToQueue(queueName, message, publishOptions);
		}

		logger.debug(`Job ${job.id} added to queue ${queueName}`);
		return job;
	}

	async addBulkJobs<T = any>(
		queueName: string,
		jobs: Array<{ name: string; data: T; opts?: JobOptions }>,
	): Promise<Job<T>[]> {
		const addedJobs: Job<T>[] = [];
		for (const jobDef of jobs) {
			const job = await this.addJob(
				queueName,
				jobDef.name,
				jobDef.data,
				jobDef.opts,
			);
			addedJobs.push(job);
		}
		return addedJobs;
	}

	processJob<T = any>(
		queueName: string,
		jobName: string,
		concurrency: number,
		processor: JobProcessor<T>,
	): void {
		this.getOrCreateQueue(queueName)
			.then((queueInfo) => {
				queueInfo.processors.set(jobName, { processor, concurrency });

				// Start consuming messages
				for (let i = 0; i < concurrency; i++) {
					this.consumeMessages(queueName, queueInfo);
				}

				logger.info(
					`Processor registered for ${jobName} in queue ${queueName} with concurrency ${concurrency}`,
				);
			})
			.catch((error) => {
				logger.error(`Failed to register processor for ${jobName}:`, error);
			});
	}

	private async consumeMessages(
		queueName: string,
		queueInfo: QueueInfo,
	): Promise<void> {
		try {
			await queueInfo.channel.consume(
				queueName,
				async (msg: amqp.ConsumeMessage | null) => {
					if (!msg) {
						return;
					}

					queueInfo.activeJobs++;
					const job: Job = JSON.parse(msg.content.toString());

					try {
						const processorInfo = queueInfo.processors.get(job.jobName);
						if (!processorInfo) {
							logger.warn(`No processor found for job type ${job.jobName}`);
							queueInfo.channel.nack(msg, false, false); // Send to DLQ
							return;
						}

						logger.info(`Processing job ${job.id} (${job.jobName})`);
						await processorInfo.processor(job);

						queueInfo.channel.ack(msg);
						logger.info(`Job ${job.id} completed successfully`);
					} catch (error) {
						logger.error(`Job ${job.id} failed:`, error);
						job.attempts++;

						if (job.attempts < job.maxAttempts) {
							// Retry with exponential backoff
							const delay = Math.min(2000 * 2 ** (job.attempts - 1), 60000);
							logger.info(
								`Retrying job ${job.id} in ${delay}ms (attempt ${job.attempts}/${job.maxAttempts})`,
							);

							// Requeue with delay
							queueInfo.channel.nack(msg, false, false);
							await this.addJob(job.queueName, job.jobName, job.data, {
								attempts: job.maxAttempts,
								delay,
							});
						} else {
							logger.error(
								`Job ${job.id} failed after ${job.maxAttempts} attempts`,
							);
							queueInfo.channel.nack(msg, false, false); // Send to DLQ
						}
					} finally {
						queueInfo.activeJobs--;
					}
				},
				{ noAck: false },
			);
		} catch (error) {
			logger.error(`Error consuming messages from ${queueName}:`, error);
		}
	}

	async getJob(_queueName: string, _jobId: string): Promise<Job | null> {
		// Note: RabbitMQ doesn't have built-in job retrieval by ID
		// This would require implementing a job tracking mechanism
		logger.warn(
			"getJob is not fully supported with RabbitMQ - consider using a job tracking database",
		);
		return null;
	}

	async getJobCounts(queueName: string): Promise<{
		waiting: number;
		active: number;
		completed: number;
		failed: number;
		delayed: number;
	}> {
		const queueInfo = this.queues.get(queueName);
		if (!queueInfo) {
			return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
		}

		try {
			const queueStats = await queueInfo.channel.checkQueue(queueName);
			const dlqStats = await queueInfo.channel
				.checkQueue(`${queueName}.dlq`)
				.catch(() => ({ messageCount: 0 }));

			return {
				waiting: queueStats.messageCount,
				active: queueInfo.activeJobs,
				completed: 0, // Not tracked by RabbitMQ
				failed: dlqStats.messageCount,
				delayed: 0, // Would require checking delay queues
			};
		} catch (error) {
			logger.error(`Failed to get job counts for ${queueName}:`, error);
			return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
		}
	}

	async pauseQueue(queueName: string): Promise<void> {
		const queueInfo = this.queues.get(queueName);
		if (queueInfo) {
			await queueInfo.channel.cancel(queueName);
			logger.info(`Queue ${queueName} paused`);
		}
	}

	async resumeQueue(queueName: string): Promise<void> {
		const queueInfo = this.queues.get(queueName);
		if (queueInfo) {
			// Re-register consumers
			for (const [_jobName, processorInfo] of queueInfo.processors.entries()) {
				for (let i = 0; i < processorInfo.concurrency; i++) {
					await this.consumeMessages(queueName, queueInfo);
				}
			}
			logger.info(`Queue ${queueName} resumed`);
		}
	}

	async emptyQueue(queueName: string): Promise<void> {
		const queueInfo = this.queues.get(queueName);
		if (queueInfo) {
			await queueInfo.channel.purgeQueue(queueName);
			logger.info(`Queue ${queueName} emptied`);
		}
	}

	async closeQueue(queueName: string): Promise<void> {
		const queueInfo = this.queues.get(queueName);
		if (queueInfo) {
			await queueInfo.channel.close();
			this.queues.delete(queueName);
			logger.info(`Queue ${queueName} closed`);
		}
	}

	async closeAllQueues(): Promise<void> {
		for (const [queueName] of this.queues) {
			await this.closeQueue(queueName);
		}

		if (this.connection) {
			await this.connection.close();
			this.connection = null;
			logger.info("RabbitMQ connection closed");
		}

		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}
	}
}

export default new QueueService();
