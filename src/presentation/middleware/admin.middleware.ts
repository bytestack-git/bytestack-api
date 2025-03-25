import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../domain/interfaces/serviceInterface/security/token.service.interface";
import { BaseError } from "../../domain/errors/base.error";
import { HTTP_STATUS } from "../../shared/constants/status-codes";
import { IAdminMiddleware } from "../../domain/interfaces/middlewareInterface/auth/admin.middleware.interface";

@injectable()
export class AdminMiddleware implements IAdminMiddleware {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new BaseError(
          "Access token missing in cookies",
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }

      const isBlacklisted = await this.tokenService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new BaseError(
          "Token is blacklisted",
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }

      const payload = this.tokenService.verifyToken(token, "access");
      if (payload.role !== "admin") {
        throw new BaseError(
          "Admin access required",
          HTTP_STATUS.FORBIDDEN,
          true
        );
      }

      req.user = { id: payload.id };
      next();
    } catch (error) {
      // res.clearCookie("accessToken");
      // res.clearCookie("refreshToken");
      next(error);
    }
  }
}
