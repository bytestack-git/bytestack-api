import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";
import { SendOtpController } from "../../presentation/controllers/auth/send-otp.controller";
import { ResetPasswordController } from "../../presentation/controllers/auth/reset-password.controller";
import { LoginController } from "../../presentation/controllers/auth/login.controller";
import { IRefreshTokenController } from "../../domain/interfaces/controllerInterface/auth/refresh-token.controller.interface";
import { RefreshTokenController } from "../../presentation/controllers/auth/refresh-token.controller";
import { LogoutController } from "../../presentation/controllers/auth/logout.controller";
import { GetUserController } from "../../presentation/controllers/profile/get-user.controller";
import { ForgotPasswordController } from "../../presentation/controllers/auth/forgot-password.controller";
import { AdminSigninController } from "../../presentation/controllers/admin/signin.controller";
import { AdminLogoutController } from "../../presentation/controllers/admin/admin-logout.controller";
import { GetAllUsersController } from "../../presentation/controllers/admin/get-all-users.controller";
import { UpdateUserController } from "../../presentation/controllers/admin/update-user.controller";
import { GoogleOAuthController } from "../../presentation/controllers/auth/google-oauth.controller";
import { GitHubOAuthController } from "../../presentation/controllers/auth/github-oauth.controller";
import { UpdateProfileController } from "../../presentation/controllers/profile/update-profile.controller";
import { FileUploadController } from "../../presentation/controllers/file-upload/file-upload.controller";
import { GetProfileController } from "../../presentation/controllers/profile/get-profile.controller";
import { GetBloggersController } from "../../presentation/controllers/profile/get-bloggers.controller";
import { FollowsController } from "../../presentation/controllers/profile/follows.controller";
import { FindFollowsController } from "../../presentation/controllers/profile/find-follows.controller";
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

container.register<IController>("IGetUserController", {
  useClass: GetUserController,
});

container.register<IController>("IFileUploadController", {
  useClass: FileUploadController,
});

container.register<IController>("IGetProfileController", {
  useClass: GetProfileController,
});

container.register<IController>("IGetBloggersController", {
  useClass: GetBloggersController,
});

container.register<IController>("IFollowsController", {
  useClass: FollowsController,
});

container.register<IController>("IFindFollowsController", {
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
container.register<IController>("IUpdateProfileController", {
  useClass: UpdateProfileController,
});

// blog
container.register<IController>("ICreateBlogController", {
  useClass: CreateBlogController,
});
