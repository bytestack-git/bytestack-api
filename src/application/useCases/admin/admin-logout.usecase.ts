import { injectable, inject } from "tsyringe";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { IAdminLogoutUseCase } from "../../../domain/interfaces/usecaseInterface/admin/admin-logout.usecase.interface";

@injectable()
export class AdminLogoutUseCase implements IAdminLogoutUseCase {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<void> {
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
  }
}
