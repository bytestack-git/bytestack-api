import { sign, verify } from "jsonwebtoken";
import { injectable } from "tsyringe";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { ITokenPayload } from "../../../domain/entities/models/token.entity";
import { getRedisClient } from "../../../infrastructure/database/redis/init";
import { config } from "../../../shared/config/config";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";

@injectable()
export class TokenService implements ITokenService {
  private readonly JWT_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";

  constructor() {
    this.JWT_SECRET = config.jwt.JWT_SECRET as string;
  }

  private async getClient() {
    try {
      return await getRedisClient();
    } catch (error) {
      throw new BaseError(
        "Failed to connect to Redis client",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  generateAccessToken(
    userId: string,
    purpose: "access" | "reset" = "access",
    role?: "admin" | "user"
  ): string {
    const payload: Partial<ITokenPayload> = { id: userId, purpose };
    if (role) {
      payload.role = role;
    }
    return sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  generateRefreshToken(userId: string, role?: "admin" | "user"): string {
    const payload: Partial<ITokenPayload> = { id: userId, purpose: "refresh" };
    if (role) {
      payload.role = role;
    }
    return sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  verifyToken(
    token: string,
    expectedPurpose?: "access" | "refresh" | "reset"
  ): ITokenPayload {
    try {
      const payload = verify(token, this.JWT_SECRET) as ITokenPayload;
      if (!payload || !payload.id) {
        throw new BaseError(
          "Invalid token payload",
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }

      if (expectedPurpose && payload.purpose !== expectedPurpose) {
        throw new BaseError(
          `Token purpose mismatch: expected ${expectedPurpose}, got ${payload.purpose}`,
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }

      return payload;
    } catch (error) {
      throw new BaseError(
        "Invalid or expired token",
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }
  }

  async blacklistToken(
    token: string,
    expirationSeconds: number
  ): Promise<void> {
    const client = await this.getClient();
    try {
      await client.setEx(`blacklist:${token}`, expirationSeconds, "1");
    } catch (error) {
      throw new BaseError(
        "Failed to blacklist token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
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
    if (expirationSeconds <= 0) {
      throw new BaseError(
        "Expiration seconds must be positive",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    const client = await this.getClient();
    try {
      await client.setEx(`refresh:${userId}`, expirationSeconds, token);
    } catch (error) {
      throw new BaseError(
        "Failed to store refresh token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
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
