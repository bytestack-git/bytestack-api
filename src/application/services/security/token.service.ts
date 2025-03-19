import { sign, verify } from "jsonwebtoken";
import { injectable } from "tsyringe";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { getRedisClient } from "../../../infrastructure/database/redis/init";
import { config } from "../../../shared/config/config";
import { ITokenPayload } from "../../../domain/entities/models/token.entity";

@injectable()
export class TokenService implements ITokenService {
  private readonly JWT_SECRET = config.jwt.JWT_SECRET as string;
  private readonly ACCESS_TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";

  private async getClient() {
    return await getRedisClient();
  }

  generateAccessToken(userId: string): string {
    return sign({ id: userId }, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  generateRefreshToken(userId: string): string {
    return sign({ id: userId }, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  verifyToken(token: string): ITokenPayload | null {
    try {
      return verify(token, this.JWT_SECRET) as ITokenPayload;
    } catch (error) {
      return null;
    }
  }

  async blacklistToken(
    token: string,
    expirationSeconds: number
  ): Promise<void> {
    const client = await this.getClient();
    await client.setEx(`blacklist:${token}`, expirationSeconds, "1");
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const client = await this.getClient();
    const isBlacklisted = await client.get(`blacklist:${token}`);
    return !!isBlacklisted;
  }

  async storeRefreshToken(
    userId: string,
    token: string,
    expirationSeconds: number
  ): Promise<void> {
    const client = await this.getClient();
    await client.setEx(`refresh:${userId}`, expirationSeconds, token);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const client = await this.getClient();
    return await client.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    const client = await this.getClient();
    await client.del(`refresh:${userId}`);
  }

  getAccessTokenExpiry(): number {
    return 15 * 60;
  }

  getRefreshTokenExpiry(): number {
    return 7 * 24 * 60 * 60;
  }
}
