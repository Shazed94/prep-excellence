import cached from "@/infrastructure/cache/cache";
import logger from "@/utils/logger";

/**
 * Invalidate cache keys matching a pattern
 * @param pattern - Redis key pattern (e.g., "courses:*")
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
	try {
		const keys = await cached.keys(pattern);
		if (keys.length > 0) {
			await Promise.all(keys.map((key) => cached.del(key)));
			logger.info(`Invalidated ${keys.length} cache keys matching: ${pattern}`);
		}
	} catch (error) {
		logger.error(`Failed to invalidate cache pattern ${pattern}:`, error);
	}
}

/**
 * Invalidate multiple cache patterns at once
 * @param patterns - Array of Redis key patterns
 */
export async function invalidateCachePatterns(
	patterns: string[],
): Promise<void> {
	await Promise.all(patterns.map((pattern) => invalidateCachePattern(pattern)));
}
