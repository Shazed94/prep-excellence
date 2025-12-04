import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import config from "../../config";
import logger from "../../utils/logger";

interface EmailOptions {
	to: string | string[];
	subject: string;
	text?: string;
	html?: string;
	attachments?: Array<{
		filename: string;
		path?: string;
		content?: string | Buffer;
	}>;
}

class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = this.createTransporter();
	}

	private createTransporter(): Transporter {
		if (config.email.useSes && config.aws.region) {
			// AWS SES configuration
			return nodemailer.createTransport({
				host: `email-smtp.${config.aws.region}.amazonaws.com`,
				port: 587,
				secure: false,
				auth: {
					user: config.aws.accessKeyId,
					pass: config.aws.secretAccessKey,
				},
			});
		} else {
			// Gmail/SMTP configuration
			return nodemailer.createTransport({
				host: config.email.host,
				port: config.email.port,
				secure: config.email.port === 465, // true for 465, false for other ports
				auth: {
					user: config.email.user,
					pass: config.email.password,
				},
			});
		}
	}

	async sendEmail(options: EmailOptions): Promise<void> {
		try {
			const mailOptions: SendMailOptions = {
				from: config.email.from,
				to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
				subject: options.subject,
				text: options.text,
				html: options.html,
				attachments: options.attachments,
			};

			const info = await this.transporter.sendMail(mailOptions);
			logger.info(`Email sent successfully: ${info.messageId}`);
		} catch (error) {
			logger.error("Error sending email:", error);
			throw error;
		}
	}

	async sendWelcomeEmail(to: string, name: string): Promise<void> {
		const subject = "Welcome to PrepExcellence!";
		const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to PrepExcellence!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for signing up! We're excited to have you on board.</p>
        <p>Get started by exploring our platform and preparing for your next big opportunity.</p>
        <p>Best regards,<br>The PrepExcellence Team</p>
      </div>
    `;
		const text = `Hi ${name},\n\nThank you for signing up! We're excited to have you on board.\n\nBest regards,\nThe PrepExcellence Team`;

		await this.sendEmail({ to, subject, html, text });
	}

	async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
		const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
		const subject = "Reset Your Password";
		const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The PrepExcellence Team</p>
      </div>
    `;
		const text = `You requested to reset your password.\n\nClick here to reset: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`;

		await this.sendEmail({ to, subject, html, text });
	}

	async sendVerificationEmail(
		to: string,
		verificationToken: string,
	): Promise<void> {
		const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
		const subject = "Verify Your Email Address";
		const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Email Verification</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>Best regards,<br>The PrepExcellence Team</p>
      </div>
    `;
		const text = `Please verify your email address by clicking here: ${verifyUrl}\n\nThis link will expire in 24 hours.`;

		await this.sendEmail({ to, subject, html, text });
	}

	async sendNotificationEmail(
		to: string,
		title: string,
		message: string,
	): Promise<void> {
		const subject = title;
		const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${title}</h2>
        <p>${message}</p>
        <p>Best regards,<br>The PrepExcellence Team</p>
      </div>
    `;

		await this.sendEmail({ to, subject, html, text: message });
	}

	// Test email configuration
	async verifyConnection(): Promise<boolean> {
		try {
			await this.transporter.verify();
			logger.info("Email transporter is ready");
			return true;
		} catch (error) {
			logger.error("Email transporter verification failed:", error);
			return false;
		}
	}
}

export default new EmailService();
