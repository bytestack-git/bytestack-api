import { injectable } from "tsyringe";
import { ICacheService } from "../../../domain/interfaces/serviceInterface/cache/cache.service.interface";
import { getRedisClient } from "../../../infrastructure/database/redis/init";

@injectable()
export class CacheService implements ICacheService {
  private readonly BLOCKED_USERS_KEY = "blocked:users";

  private async getClient() {
    return await getRedisClient();
  }

  // --- Generic Key-Value Operations ---

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    const client = await this.getClient();
    await client.setEx(key, ttlSeconds, value);
  }

  async get(key: string): Promise<string | null> {
    const client = await this.getClient();
    return await client.get(key);
  }

  async delete(key: string): Promise<void> {
    const client = await this.getClient();
    await client.del(key);
  }

  // --- Specific Operations for Blocked Users ---

  async addBlockedUser(userId: string): Promise<void> {
    const client = await this.getClient();
    await client.sAdd(this.BLOCKED_USERS_KEY, userId);
  }

  async removeBlockedUser(userId: string): Promise<void> {
    const client = await this.getClient();
    await client.sRem(this.BLOCKED_USERS_KEY, userId);
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    const client = await this.getClient();
    return await client.sIsMember(this.BLOCKED_USERS_KEY, userId);
  }
}
