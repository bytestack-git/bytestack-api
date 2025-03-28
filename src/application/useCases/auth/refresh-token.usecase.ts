import { injectable, inject } from "tsyringe";
import { IRefreshTokenUseCase } from "../../../domain/interfaces/usecaseInterface/auth/refresh-token.usecase.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<{
    status: number;
    message: string;
    success: boolean;
    accessToken?: string;
  }> {
    // Validate input

    if (!refreshToken) {
      throw new BaseError(
        "Refresh token not found",
        HTTP_STATUS.FORBIDDEN,
        true
      );
    }

    // Verify refresh token
    const payload = this.tokenService.verifyToken(refreshToken);

    if (!payload) {
      throw new BaseError(
        "Invalid or expired refresh token",
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    // Generate new access token
    let newAccessToken: string;
    try {
      newAccessToken = this.tokenService.generateAccessToken(
        payload.id,
        "access",
        payload.role
      );
    } catch {
      throw new BaseError(
        "Failed to generate access token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    return {
      status: HTTP_STATUS.OK,
      message: "Token refreshed successfully",
      success: true,
      accessToken: newAccessToken,
    };
  }
}
