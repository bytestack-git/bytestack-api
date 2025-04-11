import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IGoogleOAuthLoginUseCase } from "../../../domain/interfaces/usecaseInterface/auth/google-oauth.usecase.interface";
import { IGoogleOAuthController } from "../../../domain/interfaces/controllerInterface/auth/google-oauth.controller.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import {
  oauthCodeSchema,
  OAuthCodeDTO,
} from "../../../shared/validation/schemas";
import { ZodError } from "zod";

@injectable()
export class GoogleOAuthController implements IGoogleOAuthController {
  constructor(
    @inject("IGoogleOAuthLoginUseCase")
    private googleOAuthLoginUseCase: IGoogleOAuthLoginUseCase
  ) {}

  async handleGoogleOAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let validatedData: OAuthCodeDTO;
      try {
        validatedData = oauthCodeSchema.parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new BaseError(
            "Invalid code data",
            HTTP_STATUS.BAD_REQUEST,
            true
          );
        }
        throw new BaseError(
          "Failed to validate code",
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          false
        );
      }

      const { code } = validatedData;

      const {
        status,
        message,
        success,
        tokens,
        user: userData,
      } = await this.googleOAuthLoginUseCase.execute(code);

      if (tokens) {
        res.cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      res.status(status).json({ message, success, user: userData });
    } catch (error) {
      next(error);
    }
  }
}
