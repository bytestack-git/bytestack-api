import { injectable, inject } from "tsyringe";
import { ILogoutUseCase } from "../../../domain/interfaces/usecaseInterface/auth/logout.usecase.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async execute(
    accessToken: string
  ): Promise<{ status: number; message: string; success: boolean }> {
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const payload = this.tokenService.verifyToken(accessToken);
    if (!payload) {
      throw new Error("Invalid access token");
    }

    const { iat } = payload;
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpiry = this.tokenService.getAccessTokenExpiry();
    const remainingTTL = tokenExpiry - (currentTime - payload.iat);
    if (remainingTTL > 0) {
      await this.tokenService.blacklistToken(accessToken, remainingTTL);
    }

    return {
      status: 200,
      message: "Logout successful",
      success: true,
    };
  }
}
