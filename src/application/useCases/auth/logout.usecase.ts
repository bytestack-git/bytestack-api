import { injectable, inject } from "tsyringe";
import { ILogoutUseCase } from "../../../domain/interfaces/usecaseInterface/auth/logout.usecase.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { ITokenPayload } from "../../../domain/entities/models/token.entity";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async execute(
    accessToken: string
  ): Promise<{ status: number; message: string; success: boolean }> {
    // Validate input
    if (!accessToken) {
      throw new BaseError(
        "Access token is required",
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    // Verify access token
    let payload;
    try {
      payload = this.tokenService.verifyToken(accessToken);
      if (!payload) {
        throw new BaseError(
          "Invalid access token",
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }
    } catch (error) {
      if (error instanceof BaseError) {
        throw error; // Propagate BaseError from verifyToken
      }
      throw new BaseError(
        "Invalid or expired access token",
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    // Blacklist the token if it hasn't expired
    const { iat } = payload;
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpiry = this.tokenService.getAccessTokenExpiry();
    const remainingTTL = tokenExpiry - (currentTime - iat);
    if (remainingTTL > 0) {
      try {
        await this.tokenService.blacklistToken(accessToken, remainingTTL);
      } catch (error) {
        throw new BaseError(
          "Failed to blacklist access token",
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          false
        );
      }
    }

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.LOGOUT_SUCCESSFUL,
      success: true,
    };
  }
}
