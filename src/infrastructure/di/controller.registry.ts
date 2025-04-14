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
import { GetUserController } from "../../presentation/controllers/profile/get-user.controller";
import { IGetUserController } from "../../domain/interfaces/controllerInterface/profile/get-user.controller.interface";
import { IForgotPasswordController } from "../../domain/interfaces/controllerInterface/auth/forgot-password.controller.interface";
import { ForgotPasswordController } from "../../presentation/controllers/auth/forgot-password.controller";
import { IAdminSigninController } from "../../domain/interfaces/controllerInterface/admin/signin.controller.interface";
import { AdminSigninController } from "../../presentation/controllers/admin/signin.controller";
import { AdminLogoutController } from "../../presentation/controllers/admin/admin-logout.controller";
import { IAdminLogoutController } from "../../domain/interfaces/controllerInterface/admin/admin-logout.controller.interface";
import { GetAllUsersController } from "../../presentation/controllers/admin/get-all-users.controller";
import { IUpdateUserController } from "../../domain/interfaces/controllerInterface/admin/update-user.controller.interface";
import { UpdateUserController } from "../../presentation/controllers/admin/update-user.controller";
import { IGoogleOAuthController } from "../../domain/interfaces/controllerInterface/auth/google-oauth.controller.interface";
import { GoogleOAuthController } from "../../presentation/controllers/auth/google-oauth.controller";
import { IGitHubOAuthController } from "../../domain/interfaces/controllerInterface/auth/github-oauth.controller.interface";
import { GitHubOAuthController } from "../../presentation/controllers/auth/github-oauth.controller";
import { IUpdateProfileController } from "../../domain/interfaces/controllerInterface/profile/update-profile.controller.interface";
import { UpdateProfileController } from "../../presentation/controllers/profile/update-profile.controller";
import { IS3Controller } from "../../domain/interfaces/controllerInterface/s3/s3.controller.interface";
import { S3Controller } from "../../presentation/controllers/s3/s3.controller";
import { IGetProfileController } from "../../domain/interfaces/controllerInterface/profile/get-profile.controller.interface";
import { GetProfileController } from "../../presentation/controllers/profile/get-profile.controller";
import { IGetBloggersController } from "../../domain/interfaces/controllerInterface/profile/get-bloggers.controller.interface";
import { GetBloggersController } from "../../presentation/controllers/profile/get-bloggers.controller";
import { IFollowsController } from "../../domain/interfaces/controllerInterface/profile/follows.controller.interface";
import { FollowsController } from "../../presentation/controllers/profile/follows.controller";
import { IFindFollowsController } from "../../domain/interfaces/controllerInterface/profile/find-follows.controller.interface";
import { FindFollowsController } from "../../presentation/controllers/profile/find-follows.controller";
import { ICreateBlogController } from "../../domain/interfaces/controllerInterface/blog/create-blog.controller.interface";
import { CreateBlogController } from "../../presentation/controllers/blog/create-blog.controller";

// user
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

container.register<IS3Controller>("IS3Controller", {
  useClass: S3Controller,
});

container.register<IGetProfileController>("IGetProfileController", {
  useClass: GetProfileController,
});

container.register<IGetBloggersController>("IGetBloggersController", {
  useClass: GetBloggersController,
});

container.register<IFollowsController>("IFollowsController", {
  useClass: FollowsController,
});

container.register<IFindFollowsController>("IFindFollowsController", {
  useClass: FindFollowsController,
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

container.register<IUpdateUserController>("IUpdateUserController", {
  useClass: UpdateUserController,
});

container.register<IGoogleOAuthController>("IGoogleOAuthController", {
  useClass: GoogleOAuthController,
});

container.register<IGitHubOAuthController>("IGitHubOAuthController", {
  useClass: GitHubOAuthController,
});

// user
container.register<IUpdateProfileController>("IUpdateProfileController", {
  useClass: UpdateProfileController,
});

// blog
container.register<ICreateBlogController>("ICreateBlogController", {
  useClass: CreateBlogController,
});
