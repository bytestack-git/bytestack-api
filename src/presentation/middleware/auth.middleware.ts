import { injectable, inject, container } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IAuthMiddleware } from "../../domain/interfaces/middlewareInterface/auth/auth.middleware.interface";
import { IUserRepository } from "../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { BaseError } from "../../domain/errors/base.error";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string };
  }
}

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        res
          .status(401)
          .json({ message: "Access token not found", success: false });
        return;
      }

      const isBlacklisted =
        await this.tokenService.isTokenBlacklisted(accessToken);
      if (isBlacklisted) {
        res
          .status(401)
          .json({ message: "Token is blacklisted", success: false });
        return;
      }

      const payload = this.tokenService.verifyToken(accessToken);
      if (!payload) {
        res
          .status(401)
          .json({ message: "Invalid or expired access token", success: false });
        return;
      }

      const userRepository =
        container.resolve<IUserRepository>("IUserRepository");
      const user = await userRepository.findById(payload.id);

      if (user && user.isBanned) {
        res.clearCookie("userToken");
        throw new BaseError("Your account has been banned", 403, true);
      }

      req.user = { id: payload.id };
      next();
    } catch (error) {
      next(error);
    }
  }
}
