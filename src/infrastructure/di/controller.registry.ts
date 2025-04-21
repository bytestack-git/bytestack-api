import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";
import { SendOtpController } from "../../presentation/controllers/auth/send-otp.controller";
import { ResetPasswordController } from "../../presentation/controllers/auth/reset-password.controller";
import { LoginController } from "../../presentation/controllers/auth/login.controller";
import { IRefreshTokenController } from "../../domain/interfaces/controllerInterface/auth/refresh-token.controller.interface";
import { RefreshTokenController } from "../../presentation/controllers/auth/refresh-token.controller";
import { LogoutController } from "../../presentation/controllers/auth/logout.controller";
import { GetUserController } from "../../presentation/controllers/profile/get-user.controller";
import { IGetUserController } from "../../domain/interfaces/controllerInterface/profile/get-user.controller.interface";
import { ForgotPasswordController } from "../../presentation/controllers/auth/forgot-password.controller";
import { AdminSigninController } from "../../presentation/controllers/admin/signin.controller";
import { AdminLogoutController } from "../../presentation/controllers/admin/admin-logout.controller";
import { GetAllUsersController } from "../../presentation/controllers/admin/get-all-users.controller";
import { UpdateUserController } from "../../presentation/controllers/admin/update-user.controller";
import { GoogleOAuthController } from "../../presentation/controllers/auth/google-oauth.controller";
import { GitHubOAuthController } from "../../presentation/controllers/auth/github-oauth.controller";
import { IUpdateProfileController } from "../../domain/interfaces/controllerInterface/profile/update-profile.controller.interface";
import { UpdateProfileController } from "../../presentation/controllers/profile/update-profile.controller";
import { IFileUploadController } from "../../domain/interfaces/controllerInterface/file-upload/file-upload.controller.interface";
import { FileUploadController } from "../../presentation/controllers/file-upload/file-upload.controller";
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
import { IController } from "../../domain/interfaces/controllerInterface/common/controller.interface";

// user
container.register<IController>("ISignupController", {
  useClass: SignupController,
});

container.register<IController>("ISendOtpController", {
  useClass: SendOtpController,
});

container.register<IController>("IResetPasswordController", {
  useClass: ResetPasswordController,
});

container.register<IController>("ILoginController", {
  useClass: LoginController,
});

container.register<IRefreshTokenController>("IRefreshTokenController", {
  useClass: RefreshTokenController,
});

container.register<IController>("IForgotPasswordController", {
  useClass: ForgotPasswordController,
});

container.register<IController>("ILogoutController", {
  useClass: LogoutController,
});

container.register<IGetUserController>("IGetUserController", {
  useClass: GetUserController,
});

container.register<IFileUploadController>("IFileUploadController", {
  useClass: FileUploadController,
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
container.register<IController>("IAdminSigninController", {
  useClass: AdminSigninController,
});

container.register<IController>("IAdminLogoutController", {
  useClass: AdminLogoutController,
});

container.register<IController>("IGetAllUsersController", {
  useClass: GetAllUsersController,
});

container.register<IController>("IUpdateUserController", {
  useClass: UpdateUserController,
});

container.register<IController>("IGoogleOAuthController", {
  useClass: GoogleOAuthController,
});

container.register<IController>("IGitHubOAuthController", {
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
