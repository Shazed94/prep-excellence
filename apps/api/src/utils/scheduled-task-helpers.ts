// import { Job } from '../infrastructure/queue/queue';
// import logger from '../utils/logger';

// /**
//  * Wrap a job processor to automatically update scheduled task status
//  */
// export const withScheduledTaskTracking = <T = any>(
//     processor: (job: Job<T>) => Promise<any>
// ) => {
//     return async (job: Job<T>) => {
//         const scheduledTaskId = (job.data as any)?._scheduledTaskId;

//         try {
//             // Execute the actual job
//             const result = await processor(job);

//             // If this job was triggered by a scheduled task, mark it as completed
//             if (scheduledTaskId) {
//                 await scheduledTaskService.markTaskAsCompleted(scheduledTaskId);
//                 logger.info(`Marked scheduled task ${scheduledTaskId} as completed`);
//             }

//             return result;
//         } catch (error) {
//             // If this job was triggered by a scheduled task, mark it as failed
//             if (scheduledTaskId) {
//                 const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//                 await scheduledTaskService.markTaskAsFailed(scheduledTaskId, errorMessage);
//                 logger.error(`Marked scheduled task ${scheduledTaskId} as failed: ${errorMessage}`);
//             }

//             // Re-throw the error for queue retry mechanism
//             throw error;
//         }
//     };
// };

// /**
//  * Check if a job is from a scheduled task
//  */
// export const isScheduledTask = (job: Job): boolean => {
//     return !!(job.data as any)?._scheduledTaskId;
// };

// /**
//  * Get scheduled task ID from job data
//  */
// export const getScheduledTaskId = (job: Job): string | null => {
//     return (job.data as any)?._scheduledTaskId || null;
// };

// /**
//  * Get scheduled task name from job data
//  */
// export const getScheduledTaskName = (job: Job): string | null => {
//     return (job.data as any)?._taskName || null;
// };
