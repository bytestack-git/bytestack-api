// src/infrastructure/database/redis/connect/connection.ts
import { createClient, RedisClientType } from "redis";
import { config } from "../../../../shared/config";

export class RedisConnect {
  private static _client: RedisClientType;

  constructor() {
    this._initializeClient();
    this._initializeEventListeners();
  }

  private _initializeClient(): void {
    RedisConnect._client = createClient({
      username: config.redis.REDIS_USERNAME,
      password: config.redis.REDIS_PASSWORD,
      socket: {
        host: config.redis.REDIS_HOST,
        port: config.redis.REDIS_PORT,
      },
    });
  }

  private _initializeEventListeners(): void {
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

  async connectRedis() {
    try {
      await RedisConnect._client.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  static async disconnectRedis() {
    if (!RedisConnect._client) {
      console.warn("Redis client is not initialized; skipping disconnection");
      return;
    }
    try {
      await RedisConnect._client.disconnect();
      console.log("Redis disconnected successfully");
    } catch (error) {
      console.error("Redis disconnection error:", error);
      throw error;
    }
  }

  static getClient(): RedisClientType {
    if (!RedisConnect._client) {
      throw new Error("Redis client is not initialized");
    }
    return RedisConnect._client;
  }
}
