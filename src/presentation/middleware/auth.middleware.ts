import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IAuthMiddleware } from "../../domain/interfaces/middlewareInterface/auth/auth.middleware.interface";
import { BaseError } from "../../domain/errors/base.error";
import { ICacheService } from "../../domain/interfaces/serviceInterface/cache/cache.service.interface";

declare module "express-serve-static-core" {
  interface Request {
    user: { id: string };
  }
}

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("ICacheService") private cacheService: ICacheService
  ) {}

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

      const isBanned = await this.cacheService.isUserBlocked(payload.id);
      if (isBanned) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        throw new BaseError("Your account has been banned", 404, true);
      }

      req.user = { id: payload.id };
      next();
    } catch (error) {
      next(error);
    }
  }
}
