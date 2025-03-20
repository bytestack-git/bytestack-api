import { injectable, inject } from "tsyringe";
import { IRefreshTokenUseCase } from "../../../domain/interfaces/usecaseInterface/auth/refresh-token.usecase.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<{
    status: number;
    message: string;
    success: boolean;
    accessToken: string;
  }> {
    // Validate input
    if (!refreshToken) {
      throw new BaseError(
        ERROR_MSG.REQUIRED_FIELD_MISSING,
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = this.tokenService.verifyToken(refreshToken);
      if (!payload) {
        throw new BaseError(
          "Invalid refresh token",
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new BaseError(
        "Invalid or expired refresh token",
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    // Check if user exists
    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new BaseError(
        ERROR_MSG.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    // Generate new access token
    let newAccessToken: string;
    try {
      newAccessToken = this.tokenService.generateAccessToken(payload.id);
    } catch (error) {
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
