import path from "node:path";
import multer from "multer";
import { AppError } from "@/utils/AppError";

/**
 * Multer Configuration for File Uploads
 *
 * Uses memory storage to keep files in memory as Buffer objects,
 * which can then be uploaded directly to MinIO
 */

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
	image: 5 * 1024 * 1024, // 5MB for images
	video: 500 * 1024 * 1024, // 500MB for videos
	document: 10 * 1024 * 1024, // 10MB for documents
};

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
	image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
	video: [
		"video/mp4",
		"video/mpeg",
		"video/quicktime",
		"video/x-msvideo",
		"video/webm",
	],
	document: [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	],
};

/**
 * Memory storage configuration
 * Files are stored as Buffer in memory
 */
const storage = multer.memoryStorage();

/**
 * File filter function
 */
const createFileFilter =
	(
		allowedTypes: string[],
		fieldName: string = "file",
	): multer.Options["fileFilter"] =>
	(_req, file, callback) => {
		if (allowedTypes.includes(file.mimetype)) {
			callback(null, true);
		} else {
			callback(
				new AppError(
					`Invalid file type for ${fieldName}. Allowed types: ${allowedTypes.join(
						", ",
					)}`,
					400,
				),
			);
		}
	};

/**
 * Image upload middleware
 * Accepts single image file with field name "logo"
 */
export const uploadImage = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.image,
	},
	fileFilter: createFileFilter(ALLOWED_MIME_TYPES.image, "image"),
}).single("logo");

/**
 * Blog image upload middleware
 * Accepts single image file with field name "image"
 */
export const uploadBlogImage = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.image,
	},
	fileFilter: createFileFilter(ALLOWED_MIME_TYPES.image, "image"),
}).single("image");

/**
 * User profile image upload middleware
 * Accepts single image file with field name "image"
 * Used for student, parent, teacher, and system user profile images
 */
export const uploadUserImage = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.image,
	},
	fileFilter: createFileFilter(ALLOWED_MIME_TYPES.image, "image"),
}).single("image");

/**
 * Course thumbnail upload middleware
 * Accepts single image file with field name "thumbnail"
 */
export const uploadCourseThumbnail = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.image,
	},
	fileFilter: createFileFilter(ALLOWED_MIME_TYPES.image, "image"),
}).single("thumbnail");

/**
 * Video upload middleware
 * Accepts single video file
 */
export const uploadVideo = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.video,
	},
	fileFilter: createFileFilter(ALLOWED_MIME_TYPES.video, "video"),
}).single("video");

/**
 * Document upload middleware
 * Accepts single document file
 */
export const uploadDocument = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.document,
	},
	fileFilter: createFileFilter(ALLOWED_MIME_TYPES.document, "document"),
}).single("document");

/**
 * Multiple images upload middleware
 * Accepts up to 10 images
 */
export const uploadMultipleImages = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.image,
		files: 10,
	},
	fileFilter: createFileFilter(ALLOWED_MIME_TYPES.image, "images"),
}).array("images", 10);

/**
 * Generic file upload middleware
 * Accepts any file type with size limit
 */
export const uploadAny = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.document,
	},
}).single("file");

/**
 * Helper function to generate unique file names
 */
export function generateFileName(
	originalName: string,
	prefix: string = "",
): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 9);
	const extension = path.extname(originalName);
	const basename = path.basename(originalName, extension);

	return `${prefix}${basename}_${timestamp}_${random}${extension}`;
}

/**
 * Helper function to get file extension
 */
export function getFileExtension(filename: string): string {
	return path.extname(filename).toLowerCase();
}

/**
 * Helper function to validate file size
 */
export function validateFileSize(
	size: number,
	maxSize: number,
	fieldName: string = "file",
): void {
	if (size > maxSize) {
		throw new AppError(
			`${fieldName} size exceeds maximum allowed size of ${
				maxSize / (1024 * 1024)
			}MB`,
			400,
		);
	}
}

/**
 * Course media upload middleware (for thumbnail + video in one FormData)
 * Accepts:
 *   - "thumbnail" field (single image, 5MB max)
 *   - "video" field (single video, 500MB max)
 */
export const uploadCourseMedia = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE_LIMITS.video,
	},
	fileFilter: (_req, file, callback) => {
		if (file.fieldname === "thumbnail") {
			if (ALLOWED_MIME_TYPES.image.includes(file.mimetype)) {
				callback(null, true);
			} else {
				callback(
					new AppError(
						`Invalid file type for thumbnail. Allowed: ${ALLOWED_MIME_TYPES.image.join(", ")}`,
						400,
					),
				);
			}
		} else if (file.fieldname === "video") {
			if (ALLOWED_MIME_TYPES.video.includes(file.mimetype)) {
				callback(null, true);
			} else {
				callback(
					new AppError(
						`Invalid file type for video. Allowed: ${ALLOWED_MIME_TYPES.video.join(", ")}`,
						400,
					),
				);
			}
		} else {
			callback(new AppError(`Unexpected field: ${file.fieldname}`, 400));
		}
	},
}).fields([
	{ name: "thumbnail", maxCount: 1 },
	{ name: "video", maxCount: 1 },
]);
