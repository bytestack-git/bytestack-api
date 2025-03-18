import { createClient, RedisClientType } from "redis";
import { config } from "../../../../shared/config/config";

export class RedisConnect {
  private static _client: RedisClientType | null = null;
  private static _instance: RedisConnect | null = null;

  private constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    RedisConnect._client = createClient({
      username: config.redis.REDIS_USERNAME,
      password: config.redis.REDIS_PASSWORD,
      socket: {
        host: config.redis.REDIS_HOST,
        port: config.redis.REDIS_PORT,
        connectTimeout: 10000, // 10s timeout
        keepAlive: 5000, // Keep connection alive
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000), // Retry delay
      },
    });

    RedisConnect._client.on("error", (error) => {
      console.error("Redis connection error:", error.message);
    });

    RedisConnect._client.on("connect", () => {
      console.log("Redis connected successfully");
    });

    RedisConnect._client.on("end", () => {
      console.warn("Redis connection closed");
    });
  }

  public static async getInstance(): Promise<RedisConnect> {
    if (!RedisConnect._instance) {
      RedisConnect._instance = new RedisConnect();

      if (!RedisConnect._client) {
        throw new Error("Redis client is not initialized");
      }

      try {
        await RedisConnect._client.connect();
      } catch (error) {
        console.error("Redis connection failed:", error);
      }
    }
    return RedisConnect._instance;
  }

  public static async getClient(): Promise<RedisClientType> {
    await RedisConnect.getInstance();
    if (!RedisConnect._client || !RedisConnect._client.isOpen) {
      console.warn("Redis client is not open. Reconnecting...");
      await RedisConnect._client?.connect();
    }
    if (!RedisConnect._client) {
      throw new Error("Redis client is not available");
    }
    return RedisConnect._client;
  }

  public static async disconnectRedis(): Promise<void> {
    if (RedisConnect._client && RedisConnect._client.isOpen) {
      await RedisConnect._client.quit();
      RedisConnect._client = null;
      RedisConnect._instance = null;
      console.log("Redis disconnected successfully");
    }
  }
}
