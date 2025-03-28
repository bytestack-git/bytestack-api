import { injectable, inject } from "tsyringe";
import { IGoogleOAuthLoginUseCase } from "../../../domain/interfaces/usecaseInterface/auth/google-oauth.usecase.interface";
import { IGoogleOAuthService } from "../../../domain/interfaces/serviceInterface/auth/google-oauth.service.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class GoogleOAuthLoginUseCase implements IGoogleOAuthLoginUseCase {
  constructor(
    @inject("IGoogleOAuthService")
    private googleOAuthService: IGoogleOAuthService,
    @inject("ITokenService") private tokenService: ITokenService
  ) {}

  async execute(code: string): Promise<{
    status: number;
    message: string;
    success: boolean;
    user: Partial<IUserEntity>;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const accessToken =
      await this.googleOAuthService.exchangeGoogleCodeForToken(code);

    const oauthUser =
      await this.googleOAuthService.validateGoogleToken(accessToken);

    const user =
      await this.googleOAuthService.findOrCreateGoogleUser(oauthUser);

    if (user.isBanned) {
      throw new BaseError(
        "Your account has been banned",
        HTTP_STATUS.FORBIDDEN,
        true
      );
    }

    if (!user._id) {
      throw new BaseError(
        ERROR_MSG.INVALID_DATA,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        true
      );
    }

    const userId = user._id.toString();

    const accessTokenJwt = this.tokenService.generateAccessToken(
      userId,
      "access",
      "user"
    );
    const refreshToken = this.tokenService.generateRefreshToken(userId, "user");

    const userData = {
      email: user.email,
      avatar: user.avatar,
      name: user.name,
    };

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.LOGIN_SUCCESSFUL,
      success: true,
      user: userData,
      tokens: { accessToken: accessTokenJwt, refreshToken },
    };
  }
}
