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
    if (!this.JWT_SECRET) {
      throw new BaseError(
        "JWT_SECRET is not configured",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
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

  generateAccessToken(userId: string): string {
    if (!userId) {
      throw new BaseError(
        "User ID is required to generate access token",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    try {
      return sign({ id: userId }, this.JWT_SECRET, {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
      });
    } catch (error) {
      throw new BaseError(
        "Failed to generate access token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  generateRefreshToken(userId: string): string {
    if (!userId) {
      throw new BaseError(
        "User ID is required to generate refresh token",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    try {
      return sign({ id: userId }, this.JWT_SECRET, {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      });
    } catch (error) {
      throw new BaseError(
        "Failed to generate refresh token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  verifyToken(token: string): ITokenPayload {
    if (!token) {
      throw new BaseError(
        "Token is required for verification",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    try {
      const payload = verify(token, this.JWT_SECRET) as ITokenPayload;
      if (!payload || !payload.id) {
        throw new BaseError(
          "Invalid token payload",
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
    if (!token) {
      throw new BaseError(
        "Token is required for blacklisting",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }
    if (expirationSeconds <= 0) {
      throw new BaseError(
        "Expiration seconds must be positive",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

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
    if (!token) {
      throw new BaseError(
        "Token is required to check blacklist",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    const client = await this.getClient();
    try {
      const isBlacklisted = await client.get(`blacklist:${token}`);
      return !!isBlacklisted;
    } catch (error) {
      throw new BaseError(
        "Failed to check if token is blacklisted",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  async storeRefreshToken(
    userId: string,
    token: string,
    expirationSeconds: number
  ): Promise<void> {
    if (!userId || !token) {
      throw new BaseError(
        "User ID and token are required to store refresh token",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }
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
    if (!userId) {
      throw new BaseError(
        "User ID is required to get refresh token",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    const client = await this.getClient();
    try {
      return await client.get(`refresh:${userId}`);
    } catch (error) {
      throw new BaseError(
        "Failed to retrieve refresh token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    if (!userId) {
      throw new BaseError(
        "User ID is required to delete refresh token",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    const client = await this.getClient();
    try {
      await client.del(`refresh:${userId}`);
    } catch (error) {
      throw new BaseError(
        "Failed to delete refresh token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  getAccessTokenExpiry(): number {
    return 15 * 60; // 15 minutes in seconds
  }

  getRefreshTokenExpiry(): number {
    return 7 * 24 * 60 * 60; // 7 days in seconds
  }
}
