import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IAuthMiddleware } from "../../domain/interfaces/middlewareInterface/auth/auth.middleware.interface";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
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

      req.user = { id: payload.id };
      next();
    } catch (error) {
      next(error);
    }
  }
}
