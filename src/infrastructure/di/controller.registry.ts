import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";
import { SendOtpController } from "../../presentation/controllers/auth/send-otp.controller";
import { ResetPasswordController } from "../../presentation/controllers/auth/reset-password.controller";
import { ISignupController } from "../../domain/interfaces/controllerInterface/auth/signup.controller.interface";
import { ISendOtpController } from "../../domain/interfaces/controllerInterface/auth/send-otp.controller.interface";
import { IResetPasswordController } from "../../domain/interfaces/controllerInterface/auth/reset-password.controller.interface";
import { ILoginController } from "../../domain/interfaces/controllerInterface/auth/login.controller.interface";
import { LoginController } from "../../presentation/controllers/auth/login.controller";
import { IRefreshTokenController } from "../../domain/interfaces/controllerInterface/auth/refresh-token.controller.interface";
import { RefreshTokenController } from "../../presentation/controllers/auth/refresh-token.controller";
import { ILogoutController } from "../../domain/interfaces/controllerInterface/auth/logout.controller.interface";
import { LogoutController } from "../../presentation/controllers/auth/logout.controller";
import { GetUserController } from "../../presentation/controllers/user/get-user.controller";
import { IGetUserController } from "../../domain/interfaces/controllerInterface/user/get-user.controller.interface";
import { IForgotPasswordController } from "../../domain/interfaces/controllerInterface/auth/forgot-password.controller.interface";
import { ForgotPasswordController } from "../../presentation/controllers/auth/forgot-password.controller";
import { IAdminSigninController } from "../../domain/interfaces/controllerInterface/admin/signin.controller.interface";
import { AdminSigninController } from "../../presentation/controllers/admin/signin.controller";
import { AdminLogoutController } from "../../presentation/controllers/admin/admin-logout.controller";
import { IAdminLogoutController } from "../../domain/interfaces/controllerInterface/admin/admin-logout.controller.interface";
import { GetAllUsersController } from "../../presentation/controllers/admin/get-all-users.controller";

container.register<ISignupController>("ISignupController", {
  useClass: SignupController,
});

container.register<ISendOtpController>("ISendOtpController", {
  useClass: SendOtpController,
});

container.register<IResetPasswordController>("IResetPasswordController", {
  useClass: ResetPasswordController,
});

container.register<ILoginController>("ILoginController", {
  useClass: LoginController,
});

container.register<IRefreshTokenController>("IRefreshTokenController", {
  useClass: RefreshTokenController,
});

container.register<IForgotPasswordController>("IForgotPasswordController", {
  useClass: ForgotPasswordController,
});

container.register<ILogoutController>("ILogoutController", {
  useClass: LogoutController,
});

container.register<IGetUserController>("IGetUserController", {
  useClass: GetUserController,
});

//admin
container.register<IAdminSigninController>("IAdminSigninController", {
  useClass: AdminSigninController,
});

container.register<IAdminLogoutController>("IAdminLogoutController", {
  useClass: AdminLogoutController,
});

container.register<IAdminLogoutController>("IGetAllUsersController", {
  useClass: GetAllUsersController,
});
