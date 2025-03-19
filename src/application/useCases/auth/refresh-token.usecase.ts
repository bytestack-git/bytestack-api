import { injectable, inject } from "tsyringe";
import { IRefreshTokenUseCase } from "../../../domain/interfaces/usecaseInterface/auth/refresh-token.usecase.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async execute(
    refreshToken: string
  ): Promise<{
    status: number;
    message: string;
    success: boolean;
    accessToken: string;
  }> {
    const payload = this.tokenService.verifyToken(refreshToken);
    if (!payload) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = this.tokenService.generateAccessToken(payload.id);
    return {
      status: 200,
      message: "Token refreshed successfully",
      success: true,
      accessToken: newAccessToken,
    };
  }
}
