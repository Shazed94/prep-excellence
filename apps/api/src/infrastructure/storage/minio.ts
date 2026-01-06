import * as http from "node:http";
import * as https from "node:https";
import type { Readable } from "node:stream";
import * as Minio from "minio";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import logger from "../../utils/logger";

export interface UploadResult {
	url: string;
	key: string;
	bucket: string;
	etag: string;
	size?: number;
}

export interface PresignedUrlOptions {
	expiresIn?: number; // seconds
	responseHeaders?: Record<string, string>;
}

class MinioService {
	private client: Minio.Client;
	private bucket: string;
	private endpoint: string;
	private port: number;
	private useSSL: boolean;

	constructor() {
		this.endpoint = config.minio.endpoint;
		this.port = config.minio.port;
		this.useSSL = config.minio.useSSL;
		this.bucket = config.minio.bucket;

		// Create appropriate agent based on SSL configuration with aggressive timeout settings
		// These settings are necessary for connections through Cloudflare CDN which add latency
		const agentOptions = {
			keepAlive: true,
			keepAliveMsecs: 60000, // Keep connections alive for 60 seconds
			maxSockets: 50, // Allow more concurrent connections
			maxFreeSockets: 10,
			timeout: 120000, // 120 second socket timeout (connection + idle)
			freeSocketTimeout: 30000, // 30 seconds before closing idle sockets
		};

		const transportAgent = this.useSSL
			? new https.Agent(agentOptions)
			: new http.Agent(agentOptions);

		this.client = new Minio.Client({
			endPoint: this.endpoint,
			port: this.port,
			useSSL: this.useSSL,
			accessKey: config.minio.accessKey,
			secretKey: config.minio.secretKey,
			region: config.minio.region,
			transportAgent,
		});

		logger.info(`MinIO client initialized: ${this.endpoint}:${this.port}`);
	}

	/**
	 * Initialize bucket if it doesn't exist
	 */
	async initializeBucket(): Promise<void> {
		try {
			const exists = await this.client.bucketExists(this.bucket);

			if (!exists) {
				await this.client.makeBucket(this.bucket, config.minio.region);
				logger.info(`MinIO bucket created: ${this.bucket}`);

				// Set default bucket policy (public read if needed)
				// Uncomment if you want public read access
				// const policy = {
				//     Version: '2012-10-17',
				//     Statement: [
				//         {
				//             Effect: 'Allow',
				//             Principal: { AWS: ['*'] },
				//             Action: ['s3:GetObject'],
				//             Resource: [`arn:aws:s3:::${this.bucket}/*`],
				//         },
				//     ],
				// };
				// await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
			} else {
				logger.info(`MinIO bucket exists: ${this.bucket}`);
			}
		} catch (error) {
			logger.error("MinIO bucket initialization error:", error);
			throw new AppError("Failed to initialize MinIO bucket", 500);
		}
	}

	/**
	 * Upload file from buffer
	 */
	async uploadFile(
		key: string,
		buffer: Buffer,
		contentType: string,
		metadata?: Record<string, string>,
	): Promise<UploadResult> {
		try {
			const metaData = {
				"Content-Type": contentType,
				...metadata,
			};

			const result = await this.client.putObject(
				this.bucket,
				key,
				buffer,
				buffer.length,
				metaData,
			);

			const url = this.getPublicUrl(key);

			return {
				url,
				key,
				bucket: this.bucket,
				etag: result.etag,
				size: buffer.length,
			};
		} catch (error) {
			logger.error("MinIO upload error:", error);
			throw new AppError("Failed to upload file to MinIO", 500);
		}
	}

	/**
	 * Upload file from stream
	 */
	async uploadStream(
		key: string,
		stream: Readable,
		size: number,
		contentType: string,
		metadata?: Record<string, string>,
	): Promise<UploadResult> {
		try {
			const metaData = {
				"Content-Type": contentType,
				...metadata,
			};

			const result = await this.client.putObject(
				this.bucket,
				key,
				stream,
				size,
				metaData,
			);

			const url = this.getPublicUrl(key);

			return {
				url,
				key,
				bucket: this.bucket,
				etag: result.etag,
				size,
			};
		} catch (error) {
			logger.error("MinIO stream upload error:", error);
			throw new AppError("Failed to upload stream to MinIO", 500);
		}
	}

	/**
	 * Download file as buffer
	 */
	async downloadFile(key: string): Promise<Buffer> {
		try {
			const stream = await this.client.getObject(this.bucket, key);
			const chunks: Buffer[] = [];

			return new Promise((resolve, reject) => {
				stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
				stream.on("error", reject);
				stream.on("end", () => resolve(Buffer.concat(chunks)));
			});
		} catch (error) {
			logger.error("MinIO download error:", error);
			throw new AppError("Failed to download file from MinIO", 500);
		}
	}

	/**
	 * Get file stream
	 */
	async getFileStream(key: string): Promise<Readable> {
		try {
			return await this.client.getObject(this.bucket, key);
		} catch (error) {
			logger.error("MinIO get stream error:", error);
			throw new AppError("Failed to get file stream from MinIO", 500);
		}
	}

	/**
	 * Delete file
	 */
	async deleteFile(key: string): Promise<void> {
		try {
			await this.client.removeObject(this.bucket, key);
			logger.info(`File deleted from MinIO: ${key}`);
		} catch (error) {
			logger.error("MinIO delete error:", error);
			throw new AppError("Failed to delete file from MinIO", 500);
		}
	}

	/**
	 * Delete multiple files
	 */
	async deleteFiles(keys: string[]): Promise<void> {
		try {
			await this.client.removeObjects(this.bucket, keys);
			logger.info(`${keys.length} files deleted from MinIO`);
		} catch (error) {
			logger.error("MinIO bulk delete error:", error);
			throw new AppError("Failed to delete files from MinIO", 500);
		}
	}

	/**
	 * Check if file exists
	 */
	async fileExists(key: string): Promise<boolean> {
		try {
			await this.client.statObject(this.bucket, key);
			return true;
		} catch (error: any) {
			if (error.code === "NotFound") {
				return false;
			}
			throw error;
		}
	}

	/**
	 * Get file metadata
	 */
	async getFileMetadata(key: string): Promise<Minio.BucketItemStat> {
		try {
			return await this.client.statObject(this.bucket, key);
		} catch (error) {
			logger.error("MinIO stat error:", error);
			throw new AppError("Failed to get file metadata from MinIO", 500);
		}
	}

	/**
	 * Generate presigned URL for download
	 */
	async getPresignedDownloadUrl(
		key: string,
		options: PresignedUrlOptions = {},
	): Promise<string> {
		try {
			const expiresIn = options.expiresIn || 3600; // 1 hour default
			return await this.client.presignedGetObject(
				this.bucket,
				key,
				expiresIn,
				options.responseHeaders,
			);
		} catch (error) {
			logger.error("MinIO presigned URL error:", error);
			throw new AppError("Failed to generate presigned URL", 500);
		}
	}

	/**
	 * Generate presigned URL for upload
	 */
	async getPresignedUploadUrl(
		key: string,
		expiresIn: number = 3600,
	): Promise<string> {
		try {
			return await this.client.presignedPutObject(this.bucket, key, expiresIn);
		} catch (error) {
			logger.error("MinIO presigned upload URL error:", error);
			throw new AppError("Failed to generate presigned upload URL", 500);
		}
	}

	/**
	 * List files with prefix
	 */
	async listFiles(
		prefix: string = "",
		recursive: boolean = false,
	): Promise<Minio.BucketItem[]> {
		try {
			const stream = this.client.listObjectsV2(this.bucket, prefix, recursive);
			const files: Minio.BucketItem[] = [];

			return new Promise((resolve, reject) => {
				stream.on("data", (obj) => files.push(obj));
				stream.on("error", reject);
				stream.on("end", () => resolve(files));
			});
		} catch (error) {
			logger.error("MinIO list error:", error);
			throw new AppError("Failed to list files from MinIO", 500);
		}
	}

	/**
	 * Copy file within bucket
	 */
	async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
		try {
			const conditions = new Minio.CopyConditions();
			await this.client.copyObject(
				this.bucket,
				destinationKey,
				`/${this.bucket}/${sourceKey}`,
				conditions,
			);
			logger.info(`File copied: ${sourceKey} -> ${destinationKey}`);
		} catch (error) {
			logger.error("MinIO copy error:", error);
			throw new AppError("Failed to copy file in MinIO", 500);
		}
	}

	/**
	 * Get public URL for a file (works only if bucket is public)
	 */
	getPublicUrl(key: string): string {
		const protocol = this.useSSL ? "https" : "http";
		const portStr =
			(this.useSSL && this.port === 443) || (!this.useSSL && this.port === 80)
				? ""
				: `:${this.port}`;
		return `${protocol}://${this.endpoint}${portStr}/${this.bucket}/${key}`;
	}

	/**
	 * Get bucket statistics
	 */
	async getBucketStats(): Promise<{ count: number; totalSize: number }> {
		try {
			const files = await this.listFiles("", true);
			const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

			return {
				count: files.length,
				totalSize,
			};
		} catch (error) {
			logger.error("MinIO bucket stats error:", error);
			throw new AppError("Failed to get bucket statistics", 500);
		}
	}

	/**
	 * Health check
	 */
	async healthCheck(): Promise<boolean> {
		try {
			await this.client.bucketExists(this.bucket);
			return true;
		} catch (error) {
			logger.error("MinIO health check failed:", error);
			return false;
		}
	}
}

export default new MinioService();
