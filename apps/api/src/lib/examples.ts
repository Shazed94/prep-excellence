// Example: How to use Redis, Bull Queue, and Email services

import redisCache from "../infrastructure/cache/cache";
import emailService from "../infrastructure/email/email";
import queueService from "../infrastructure/queue/queue";
import { emailJobs } from "../lib/queue-processors";

// ============================================
// 1. REDIS CACHE EXAMPLES
// ============================================

export class CacheExamples {
	// Cache user data
	async cacheUserData(userId: string, userData: any) {
		const cacheKey = `user:${userId}`;
		await redisCache.setJSON(cacheKey, userData, 3600); // Cache for 1 hour
	}

	// Get cached user data
	async getCachedUserData(userId: string) {
		const cacheKey = `user:${userId}`;
		return await redisCache.getJSON(cacheKey);
	}

	// Invalidate cache
	async invalidateUserCache(userId: string) {
		await redisCache.del(`user:${userId}`);
	}

	// Cache API response with pattern
	async cacheApiResponse(endpoint: string, params: any, data: any) {
		const cacheKey = `api:${endpoint}:${JSON.stringify(params)}`;
		await redisCache.setJSON(cacheKey, data, 300); // Cache for 5 minutes
	}

	// Rate limiting with Redis
	async checkRateLimit(
		ip: string,
		maxRequests: number = 100,
	): Promise<boolean> {
		const key = `ratelimit:${ip}`;
		const count = await redisCache.incr(key);

		if (count === 1) {
			// Set expiry for the first request
			await redisCache.set(key, "1", 60); // 60 seconds window
		}

		return count <= maxRequests;
	}
}

// ============================================
// 2. BULL QUEUE EXAMPLES
// ============================================

export class QueueExamples {
	// Send email via queue (recommended for production)
	async sendWelcomeEmailViaQueue(email: string, name: string) {
		await emailJobs.sendWelcomeEmail(email, name);
	}

	// Send password reset email via queue
	async sendPasswordResetViaQueue(email: string, token: string) {
		await emailJobs.sendPasswordResetEmail(email, token);
	}

	// Send bulk emails
	async sendBulkNotifications(users: Array<{ email: string; name: string }>) {
		const jobs = users.map((user) => ({
			name: "send-notification",
			data: {
				email: user.email,
				title: "Important Update",
				message: `Hi ${user.name}, we have an important update for you.`,
			},
		}));

		await queueService.addBulkJobs("email", jobs);
	}

	// Custom queue job
	async processDataInBackground(data: any) {
		await queueService.addJob("data-processing", "process-data", data, {
			priority: 1,
			attempts: 3,
			delay: 2000, // Delay in milliseconds
		});
	}

	// Check queue status
	async getQueueStatus() {
		const counts = await queueService.getJobCounts("email");
		return {
			waiting: counts.waiting,
			active: counts.active,
			completed: counts.completed,
			failed: counts.failed,
		};
	}

	// Pause/Resume queue (for maintenance)
	async pauseEmailQueue() {
		await queueService.pauseQueue("email");
	}

	async resumeEmailQueue() {
		await queueService.resumeQueue("email");
	}
}

// ============================================
// 3. EMAIL SERVICE EXAMPLES
// ============================================

export class EmailExamples {
	// Send immediate email (bypasses queue)
	async sendImmediateEmail(to: string, subject: string, content: string) {
		await emailService.sendEmail({
			to,
			subject,
			html: `<p>${content}</p>`,
			text: content,
		});
	}

	// Send custom branded email
	async sendCustomEmail(to: string, name: string) {
		const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button { background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to PrepExcellence!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for joining us. We're excited to have you on board!</p>
            <p><a href="https://example.com/get-started" class="button">Get Started</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

		await emailService.sendEmail({
			to,
			subject: "Welcome to PrepExcellence!",
			html,
			text: `Hi ${name}, Thank you for joining us!`,
		});
	}

	// Send email with attachments
	async sendEmailWithAttachment(to: string) {
		await emailService.sendEmail({
			to,
			subject: "Your Report",
			html: "<p>Please find your report attached.</p>",
			attachments: [
				{
					filename: "report.pdf",
					path: "/path/to/report.pdf",
				},
			],
		});
	}

	// Test email configuration
	async testEmailSetup() {
		const isConfigured = await emailService.verifyConnection();
		if (isConfigured) {
			console.log("✅ Email service is configured correctly");
		} else {
			console.log("❌ Email service configuration failed");
		}
		return isConfigured;
	}
}

// ============================================
// 4. COMBINED EXAMPLES (Real-world scenarios)
// ============================================

export class RealWorldExamples {
	// User registration flow
	async handleUserRegistration(email: string, name: string, userId: string) {
		// 1. Cache user data
		await redisCache.setJSON(
			`user:${userId}`,
			{ email, name, registeredAt: new Date() },
			86400, // 24 hours
		);

		// 2. Send welcome email via queue
		await emailJobs.sendWelcomeEmail(email, name);

		// 3. Track registration count
		await redisCache.incr("stats:registrations:today");
	}

	// Password reset flow
	async handlePasswordReset(email: string, resetToken: string) {
		// 1. Store reset token in cache with expiry
		await redisCache.set(
			`reset:${resetToken}`,
			email,
			3600, // 1 hour
		);

		// 2. Send reset email via queue
		await emailJobs.sendPasswordResetEmail(email, resetToken);
	}

	// API with caching
	async getPopularItems() {
		const cacheKey = "popular:items";

		// Try cache first
		let items = await redisCache.getJSON(cacheKey);

		if (!items) {
			// Fetch from database (simulated)
			items = [
				{ id: 1, name: "Item 1" },
				{ id: 2, name: "Item 2" },
			];

			// Cache for 5 minutes
			await redisCache.setJSON(cacheKey, items, 300);
		}

		return items;
	}

	// Background data processing
	async processUserActivity(userId: string, activity: any) {
		// 1. Store in cache for quick access
		await redisCache.setJSON(`activity:${userId}`, activity, 3600);

		// 2. Queue for detailed processing
		await queueService.addJob(
			"data-processing",
			"process-activity",
			{ userId, activity },
			{ priority: 3 },
		);
	}

	// Session management
	async createSession(sessionId: string, userData: any) {
		await redisCache.setJSON(
			`session:${sessionId}`,
			userData,
			86400, // 24 hours
		);
	}

	async getSession(sessionId: string) {
		return await redisCache.getJSON(`session:${sessionId}`);
	}

	async destroySession(sessionId: string) {
		await redisCache.del(`session:${sessionId}`);
	}
}

// ============================================
// USAGE IN YOUR SERVICES
// ============================================

/*
// In your auth.service.ts
import { emailJobs } from '../lib/queue-processors';
import redisCache from '../infrastructure/cache/cache.service';

async register(data: RegisterDto) {
  // ... create user ...
  
  // Send welcome email
  await emailJobs.sendWelcomeEmail(user.email, user.name);
  
  // Cache user data
  await redisCache.setJSON(`user:${user.id}`, user, 3600);
  
  return user;
}

// In your user.service.ts
async getUserById(id: string) {
  // Try cache first
  let user = await redisCache.getJSON(`user:${id}`);
  
  if (!user) {
    user = await this.userRepository.findById(id);
    await redisCache.setJSON(`user:${id}`, user, 3600);
  }
  
  return user;
}

async updateUser(id: string, data: any) {
  const user = await this.userRepository.update(id, data);
  
  // Invalidate cache
  await redisCache.del(`user:${id}`);
  
  return user;
}
*/
