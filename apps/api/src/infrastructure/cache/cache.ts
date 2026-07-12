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
				connectTimeout: 5000,
				reconnectStrategy: false,
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
		try {
			if (!this.isConnected && !this.client.isOpen) {
				await this.client.connect();
				this.isConnected = true;
			}
		} catch (error) {
			logger.error("Failed to connect to Redis:", error);
			this.isConnected = false;
		}
	}

	async disconnect(): Promise<void> {
		try {
			if (this.isConnected && this.client.isOpen) {
				await this.client.disconnect();
				this.isConnected = false;
			}
		} catch (error) {
			logger.error("Failed to disconnect from Redis:", error);
		}
	}

	async get(key: string): Promise<string | null> {
		try {
			if (!this.client.isOpen) {
				await this.connect();
			}
			return await this.client.get(key);
		} catch (error) {
			logger.error(`Redis GET error for key ${key}:`, error);
			return null;
		}
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		try {
			if (!this.client.isOpen) {
				await this.connect();
			}
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
			if (!this.client.isOpen) {
				await this.connect();
			}
			await this.client.del(key);
		} catch (error) {
			logger.error(`Redis DEL error for key ${key}:`, error);
		}
	}

	async exists(key: string): Promise<boolean> {
		try {
			if (!this.client.isOpen) {
				await this.connect();
			}
			const result = await this.client.exists(key);
			return result === 1;
		} catch (error) {
			logger.error(`Redis EXISTS error for key ${key}:`, error);
			return false;
		}
	}

	async flush(): Promise<void> {
		try {
			if (!this.client.isOpen) {
				await this.connect();
			}
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
			if (!this.client.isOpen) {
				await this.connect();
			}
			return await this.client.keys(pattern);
		} catch (error) {
			logger.error(`Redis KEYS error for pattern ${pattern}:`, error);
			return [];
		}
	}

	// Increment/Decrement
	async incr(key: string): Promise<number> {
		try {
			if (!this.client.isOpen) {
				await this.connect();
			}
			return await this.client.incr(key);
		} catch (error) {
			logger.error(`Redis INCR error for key ${key}:`, error);
			return 0;
		}
	}

	async decr(key: string): Promise<number> {
		try {
			if (!this.client.isOpen) {
				await this.connect();
			}
			return await this.client.decr(key);
		} catch (error) {
			logger.error(`Redis DECR error for key ${key}:`, error);
			return 0;
		}
	}
	async delPattern(pattern: string): Promise<void> {
		try {
			if (!this.client.isOpen) {
				await this.connect();
			}
			const keys = await this.client.keys(pattern);
			await Promise.all(keys.map((key) => this.client.del(key)));
		} catch (error) {
			logger.error(`Redis DEL PATTERN error for pattern ${pattern}:`, error);
		}
	}
}

const cached = new RedisCache();
export default cached;
