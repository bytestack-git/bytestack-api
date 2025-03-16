import { createClient, RedisClientType } from "redis";
import { config } from "../../../../shared/config/config";

export class RedisConnect {
  private static _client: RedisClientType | null = null;
  private static _instance: RedisConnect | null = null;

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
    RedisConnect._client?.on("error", (error) => {
      throw new Error(`Redis connection error: ${error}`);
    });
  }

  public static async getInstance(): Promise<RedisConnect> {
    if (!RedisConnect._instance) {
      RedisConnect._instance = new RedisConnect();

      if (!RedisConnect._client) {
        throw new Error("Redis client is not initialized");
      }

      await RedisConnect._client.connect();
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
    if (RedisConnect._client && RedisConnect._client.isOpen) {
      await RedisConnect._client.quit();
      RedisConnect._client = null;
      RedisConnect._instance = null;
    }
  }
}
