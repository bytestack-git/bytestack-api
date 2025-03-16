import { createClient, RedisClientType } from "redis";
import { config } from "../../../../shared/config/config";

export class RedisConnect {
  private static _client: RedisClientType | undefined;
  private static _instance: RedisConnect | undefined;

  private constructor() {
    this.initializeClient();
    this.initializeEventListeners();
  }

  private initializeClient(): void {
    RedisConnect._client = createClient({
      username: config.redis.REDIS_USERNAME,
      password: config.redis.REDIS_PASSWORD,
      socket: {
        host: config.redis.REDIS_HOST,
        port: config.redis.REDIS_PORT,
        connectTimeout: 10000,
      },
    });
  }

  private initializeEventListeners(): void {
    if (!RedisConnect._client) return;

    RedisConnect._client.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    RedisConnect._client.on("connect", () => {
      console.log("Redis connected successfully");
    });

    RedisConnect._client.on("end", () => {
      console.log("Redis connection closed");
    });
  }

  public static async getInstance(): Promise<RedisConnect> {
    if (!RedisConnect._instance) {
      RedisConnect._instance = new RedisConnect();
      await RedisConnect._client?.connect();
    }
    return RedisConnect._instance;
  }

  public static async getClient(): Promise<RedisClientType> {
    await RedisConnect.getInstance();
    if (!RedisConnect._client) {
      throw new Error("Redis client is not initialized");
    }
    if (!RedisConnect._client.isOpen) {
      await RedisConnect._client.connect();
    }
    return RedisConnect._client;
  }

  public static async disconnectRedis(): Promise<void> {
    if (!RedisConnect._client) {
      console.warn("Redis client is not initialized; skipping disconnection");
      return;
    }
    try {
      if (RedisConnect._client.isOpen) {
        await RedisConnect._client.quit();
      }
      RedisConnect._client = undefined;
      RedisConnect._instance = undefined;
      console.log("Redis disconnected successfully");
    } catch (error) {
      console.error("Redis disconnection error:", error);
      throw error;
    }
  }
}
