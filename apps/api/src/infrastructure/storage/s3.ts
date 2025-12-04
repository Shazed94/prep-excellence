import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../../config";
import logger from "../../utils/logger";

class S3Service {
	private s3Client: S3Client;
	private bucket: string;

	constructor() {
		this.s3Client = new S3Client({
			region: config.aws.region!,
			credentials: {
				accessKeyId: config.aws.accessKeyId!,
				secretAccessKey: config.aws.secretAccessKey!,
			},
		});
		this.bucket = config.aws.s3Bucket!;
	}

	async uploadFile(
		key: string,
		body: Buffer,
		contentType: string,
	): Promise<string> {
		try {
			const command = new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: body,
				ContentType: contentType,
			});

			await this.s3Client.send(command);
			return `https://${this.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
		} catch (error) {
			logger.error("S3 upload error:", error);
			throw error;
		}
	}

	async deleteFile(key: string): Promise<void> {
		try {
			const command = new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key,
			});

			await this.s3Client.send(command);
		} catch (error) {
			logger.error("S3 delete error:", error);
			throw error;
		}
	}

	async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: key,
			});

			return await getSignedUrl(this.s3Client, command, { expiresIn });
		} catch (error) {
			logger.error("S3 signed URL error:", error);
			throw error;
		}
	}
}

export default new S3Service();
