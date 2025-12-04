// import config from '../../config';
// import logger from '../../utils/logger';
// import queueService from '../queue/queue';

// class TaskPollerService {
//     private isRunning: boolean = false;
//     private pollInterval: NodeJS.Timeout | null = null;
//     private pollingIntervalMs: number = 60000; // Check every minute

//     /**
//      * Start polling for due tasks
//      */
//     start(intervalMs?: number): void {
//         if (this.isRunning) {
//             logger.warn('[Task Poller] Already running');
//             return;
//         }

//         if (!config.scheduler.enabled) {
//             logger.info('[Task Poller] Scheduler is disabled via config');
//             return;
//         }

//         this.pollingIntervalMs = intervalMs || this.pollingIntervalMs;
//         this.isRunning = true;

//         logger.info(`[Task Poller] Starting with ${this.pollingIntervalMs}ms interval`);

//         // Run immediately
//         this.pollAndQueueTasks();

//         // Then run periodically
//         this.pollInterval = setInterval(() => {
//             this.pollAndQueueTasks();
//         }, this.pollingIntervalMs);
//     }

//     /**
//      * Stop polling
//      */
//     stop(): void {
//         if (this.pollInterval) {
//             clearInterval(this.pollInterval);
//             this.pollInterval = null;
//         }
//         this.isRunning = false;
//         logger.info('[Task Poller] Stopped');
//     }

//     /**
//      * Poll database for due tasks and queue them
//      */
//     private async pollAndQueueTasks(): Promise<void> {
//         if (!this.isRunning) return;

//         try {
//             const dueTasks = [{"queueName": "test", "jobName": "test" ,"jobData": "test","id":"test","name":"test"}];

//             if (!dueTasks) {
//                 logger.debug('[Task Poller] No due tasks found');
//                 return;
//             }

//             if (dueTasks.length === 0) {
//                 logger.debug('[Task Poller] No due tasks found');
//                 return;
//             }

//             logger.info(`[Task Poller] Found ${dueTasks.length} due tasks`);

//             for (const task of dueTasks) {
//                 try {
//                     // Mark as running
//                     // await scheduledTaskService.markTaskAsRunning(task.id);

//                     // Queue the job in RabbitMQ
//                     await queueService.addJob(
//                         task.queueName,
//                         task.jobName,
//                         {
//                             ...(typeof task.jobData === 'object' ? task.jobData : {}),
//                             _scheduledTaskId: task.id, // Include task ID for tracking
//                             _taskName: task.name,
//                         },
//                     );

//                     logger.info(
//                         `[Task Poller] Queued task: ${task.name} (${task.id}) -> ${task.queueName}/${task.jobName}`
//                     );

//                     // Note: Task status will be updated by the job processor after execution
//                 } catch (error) {
//                     logger.error(`[Task Poller] Failed to queue task ${task.name} (${task.id}):`, error);

//                     // // Mark task as failed
//                     // await scheduledTaskService.markTaskAsFailed(
//                     //     task.id,
//                     //     error instanceof Error ? error.message : 'Unknown error'
//                     // );
//                 }
//             }
//         } catch (error) {
//             logger.error('[Task Poller] Error during polling:', error);
//         }
//     }

//     /**
//      * Get poller status
//      */
//     getStatus(): {
//         isRunning: boolean;
//         pollingIntervalMs: number;
//     } {
//         return {
//             isRunning: this.isRunning,
//             pollingIntervalMs: this.pollingIntervalMs,
//         };
//     }

//     /**
//      * Manually trigger a poll (useful for testing)
//      */
//     async triggerPoll(): Promise<void> {
//         logger.info('[Task Poller] Manual poll triggered');
//         await this.pollAndQueueTasks();
//     }
// }

// export default new TaskPollerService();
