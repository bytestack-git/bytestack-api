import { container } from "tsyringe";
import { AuthMiddleware } from "../../presentation/middleware/auth.middleware";
import { IAuthMiddleware } from "../../domain/interfaces/middlewareInterface/auth/auth.middleware.interface";
import { IAdminMiddleware } from "../../domain/interfaces/middlewareInterface/auth/admin.middleware.interface";
import { AdminMiddleware } from "../../presentation/middleware/admin.middleware";

container.register<IAuthMiddleware>("IAuthMiddleware", {
  useClass: AuthMiddleware,
});

container.register<IAdminMiddleware>("IAdminMiddleware", {
  useClass: AdminMiddleware,
});
