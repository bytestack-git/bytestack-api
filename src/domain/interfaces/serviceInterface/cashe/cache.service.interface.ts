export interface ICacheService {
  // Generic key-value operations
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;

  // Specific operations for blocked users (using Redis sets)
  addBlockedUser(userId: string): Promise<void>;
  removeBlockedUser(userId: string): Promise<void>;
  isUserBlocked(userId: string): Promise<boolean>;
}
