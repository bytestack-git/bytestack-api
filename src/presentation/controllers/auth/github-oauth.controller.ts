import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { IGitHubOAuthLoginUseCase } from "../../../domain/interfaces/usecaseInterface/auth/github-oauth.usecase.interface";
import { OAuthCodeDTO, oauthCodeSchema } from "../../../shared/validation/schemas";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class GitHubOAuthController implements IController {
  constructor(
    @inject("IGitHubOAuthLoginUseCase")
    private gitHubOAuthLoginUseCase: IGitHubOAuthLoginUseCase
  ) {}

  async handle(
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
      } = await this.gitHubOAuthLoginUseCase.execute(code);

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
