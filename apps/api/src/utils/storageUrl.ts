/**
 * Storage URL Utility
 *
 * Converts internal storage paths to public-facing URLs.
 * Works with any S3-compatible storage (MinIO, AWS S3, Cloudflare R2, etc.)
 *
 * Configuration via environment variables:
 * - STORAGE_PUBLIC_URL: Public CDN/domain for serving files (e.g., https://cdn.example.com)
 * - STORAGE_TYPE: optional, for internal tracking (minio, s3, r2, etc.)
 */

/**
 * Convert internal storage path to public URL
 *
 * @param path Internal storage path (e.g., "videos/123/thumbnail.jpg")
 * @returns Public URL (e.g., "https://cdn.example.com/videos/123/thumbnail.jpg")
 *
 * @example
 * // Using MinIO with custom domain
 * process.env.STORAGE_PUBLIC_URL = "https://cdn.prepexcellence.com"
 * toPublicUrl("videos/123/master.m3u8") // => "https://cdn.prepexcellence.com/videos/123/master.m3u8"
 *
 * @example
 * // Using AWS S3
 * process.env.STORAGE_PUBLIC_URL = "https://mybucket.s3.us-east-1.amazonaws.com"
 * toPublicUrl("videos/123/thumbnail.jpg") // => "https://mybucket.s3.us-east-1.amazonaws.com/videos/123/thumbnail.jpg"
 *
 * @example
 * // Using Cloudflare R2
 * process.env.STORAGE_PUBLIC_URL = "https://pub-xyz.r2.dev"
 * toPublicUrl("uploads/video.mp4") // => "https://pub-xyz.r2.dev/uploads/video.mp4"
 */
export function toPublicUrl(path: string | null | undefined): string | null {
	if (!path) return null;

	// Strip any existing storage URL prefixes (s3://, minio://, storage://, etc.)
	const cleanPath = stripStoragePrefix(path);

	// Get public URL from environment
	const baseUrl = process.env.STORAGE_PUBLIC_URL || "http://localhost:9000";

	// Combine base URL with path
	return `${baseUrl.replace(/\/$/, "")}/${cleanPath.replace(/^\//, "")}`;
}

/**
 * Strip common S3-compatible storage URL prefixes
 *
 * @param path Path that may contain a storage prefix
 * @returns Clean path without prefix
 *
 * @example
 * stripStoragePrefix("s3://videos/123/file.mp4") // => "videos/123/file.mp4"
 * stripStoragePrefix("minio://uploads/raw.mp4") // => "uploads/raw.mp4"
 * stripStoragePrefix("videos/123/file.mp4") // => "videos/123/file.mp4" (unchanged)
 */
export function stripStoragePrefix(path: string): string {
	const prefixes = ["s3://", "minio://", "storage://", "r2://", "do://"];

	for (const prefix of prefixes) {
		if (path.startsWith(prefix)) {
			return path.substring(prefix.length);
		}
	}

	return path;
}

/**
 * Convert public URL back to internal storage path
 * Useful for cleanup operations
 *
 * @param url Public URL
 * @returns Internal storage path
 *
 * @example
 * process.env.STORAGE_PUBLIC_URL = "https://cdn.example.com"
 * toStoragePath("https://cdn.example.com/videos/123/file.mp4") // => "videos/123/file.mp4"
 */
export function toStoragePath(url: string | null | undefined): string | null {
	if (!url) return null;

	const baseUrl = process.env.STORAGE_PUBLIC_URL || "http://localhost:9000";

	// Remove base URL if present
	if (url.startsWith(baseUrl)) {
		return url.substring(baseUrl.length).replace(/^\//, "");
	}

	// Also handle storage prefixes
	return stripStoragePrefix(url);
}

export default {
	toPublicUrl,
	stripStoragePrefix,
	toStoragePath,
};
