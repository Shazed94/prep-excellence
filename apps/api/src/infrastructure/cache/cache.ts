import { createClient, type RedisClientType } from "redis";
import config from "../../config";
import logger from "../../utils/logger";

class RedisCache {
	private client: RedisClientType;
	private isConnected: boolean = false;

	constructor() {
		this.client = createClient({
			socket: {
				host: config.redis.host,
				port: config.redis.port,
			},
			password: config.redis.password,
		});

		this.client.on("error", (err) => {
			logger.error("Redis Client Error:", err);
		});

		this.client.on("connect", () => {
			logger.info("Redis Client Connected");
			this.isConnected = true;
		});

		this.client.on("disconnect", () => {
			logger.warn("Redis Client Disconnected");
			this.isConnected = false;
		});
	}

	async connect(): Promise<void> {
		if (!this.isConnected) {
			await this.client.connect();
		}
	}

	async disconnect(): Promise<void> {
		if (this.isConnected) {
			await this.client.disconnect();
		}
	}

	async get(key: string): Promise<string | null> {
		try {
			return await this.client.get(key);
		} catch (error) {
			logger.error(`Redis GET error for key ${key}:`, error);
			return null;
		}
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		try {
			if (ttl) {
				await this.client.setEx(key, ttl, value);
			} else {
				await this.client.set(key, value);
			}
		} catch (error) {
			logger.error(`Redis SET error for key ${key}:`, error);
		}
	}

	async del(key: string): Promise<void> {
		try {
			await this.client.del(key);
		} catch (error) {
			logger.error(`Redis DEL error for key ${key}:`, error);
		}
	}

	async exists(key: string): Promise<boolean> {
		try {
			const result = await this.client.exists(key);
			return result === 1;
		} catch (error) {
			logger.error(`Redis EXISTS error for key ${key}:`, error);
			return false;
		}
	}

	async flush(): Promise<void> {
		try {
			await this.client.flushAll();
		} catch (error) {
			logger.error("Redis FLUSH error:", error);
		}
	}

	// JSON helpers
	async getJSON<T>(key: string): Promise<T | null> {
		try {
			const value = await this.get(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			logger.error(`Redis GET JSON error for key ${key}:`, error);
			return null;
		}
	}

	async setJSON(key: string, value: any, ttl?: number): Promise<void> {
		try {
			await this.set(key, JSON.stringify(value), ttl);
		} catch (error) {
			logger.error(`Redis SET JSON error for key ${key}:`, error);
		}
	}

	// Pattern matching
	async keys(pattern: string): Promise<string[]> {
		try {
			return await this.client.keys(pattern);
		} catch (error) {
			logger.error(`Redis KEYS error for pattern ${pattern}:`, error);
			return [];
		}
	}

	// Increment/Decrement
	async incr(key: string): Promise<number> {
		try {
			return await this.client.incr(key);
		} catch (error) {
			logger.error(`Redis INCR error for key ${key}:`, error);
			return 0;
		}
	}

	async decr(key: string): Promise<number> {
		try {
			return await this.client.decr(key);
		} catch (error) {
			logger.error(`Redis DECR error for key ${key}:`, error);
			return 0;
		}
	}
}

const cached = new RedisCache();
export default cached;
