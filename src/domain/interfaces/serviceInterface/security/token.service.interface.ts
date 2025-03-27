import { ITokenPayload } from "../../../entities/models/token.entity";

export interface ITokenService {
  generateAccessToken(
    userId: string,
    purpose?: "access" | "reset",
    role?: "admin" | "user",
  ): string;
  generateRefreshToken(userId: string, role?: "admin" | "user"): string;
  verifyToken(
    token: string,
    expectedPurpose?: "access" | "refresh" | "reset"
  ): ITokenPayload;
  blacklistToken(token: string, expirationSeconds: number): Promise<void>;
  isTokenBlacklisted(token: string): Promise<boolean>;
  storeRefreshToken(
    userId: string,
    token: string,
    expirationSeconds: number
  ): Promise<void>;
  getRefreshToken(userId: string): Promise<string | null>;
  deleteRefreshToken(userId: string): Promise<void>;
  getAccessTokenExpiry(): number;
  getRefreshTokenExpiry(): number;
}
