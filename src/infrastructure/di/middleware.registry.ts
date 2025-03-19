import { container } from "tsyringe";
import { AuthMiddleware } from "../../presentation/middleware/auth.middleware";
import { IAuthMiddleware } from "../../domain/interfaces/middlewareInterface/auth/auth.middleware.interface";

container.register<IAuthMiddleware>("AuthMiddleware", {
  useClass: AuthMiddleware,
});
