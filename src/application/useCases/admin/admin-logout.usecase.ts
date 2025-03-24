import { injectable, inject } from "tsyringe";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { IAdminLogoutUseCase } from "../../../domain/interfaces/usecaseInterface/admin/admin-logout.usecase.interface";

@injectable()
export class AdminLogoutUseCase implements IAdminLogoutUseCase {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<{
    status: number;
    message: string;
    success: boolean;
  }> {
    // Verify the refresh token
    const payload = this.tokenService.verifyToken(refreshToken, "refresh");
    if (payload.role !== "admin") {
      throw new BaseError("Admin access required", HTTP_STATUS.FORBIDDEN, true);
    }

    // Blacklist the refresh token
    await this.tokenService.blacklistToken(
      refreshToken,
      this.tokenService.getRefreshTokenExpiry()
    );

    return {
      status: 200,
      message: SUCCESS_MSG.LOGOUT_SUCCESSFUL,
      success: true,
    };
  }
}
