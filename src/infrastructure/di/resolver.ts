import { container } from "tsyringe";
import "./container";
import "./service.registry";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";
import { SendOtpController } from "../../presentation/controllers/auth/send-otp.controller";
import { ResetPasswordController } from "../../presentation/controllers/auth/reset-password.controller";
import { LoginController } from "../../presentation/controllers/auth/login.controller";
import { RefreshTokenController } from "../../presentation/controllers/auth/refresh-token.controller";
import { LogoutController } from "../../presentation/controllers/auth/logout.controller";
import { AuthMiddleware } from "../../presentation/middleware/auth.middleware";
import { GetUserController } from "../../presentation/controllers/profile/get-user.controller";
import { ForgotPasswordController } from "../../presentation/controllers/auth/forgot-password.controller";
import { AdminSigninController } from "../../presentation/controllers/admin/signin.controller";
import { AdminMiddleware } from "../../presentation/middleware/admin.middleware";
import { AdminLogoutController } from "../../presentation/controllers/admin/admin-logout.controller";
import { GetAllUsersController } from "../../presentation/controllers/admin/get-all-users.controller";
import { UpdateUserController } from "../../presentation/controllers/admin/update-user.controller";
import { GoogleOAuthController } from "../../presentation/controllers/auth/google-oauth.controller";
import { IGitHubOAuthController } from "../../domain/interfaces/controllerInterface/auth/github-oauth.controller.interface";
import { UpdateProfileController } from "../../presentation/controllers/profile/update-profile.controller";
import { S3Controller } from "../../presentation/controllers/s3/s3.controller";
import { GetProfileController } from "../../presentation/controllers/profile/get-profile.controller";
import { GetBloggersController } from "../../presentation/controllers/profile/get-bloggers.controller";
import { FollowsController } from "../../presentation/controllers/profile/follows.controller";
import { FindFollowsController } from "../../presentation/controllers/profile/find-follows.controller";

export const signupController =
  container.resolve<SignupController>("ISignupController");

export const sendOtpController =
  container.resolve<SendOtpController>("ISendOtpController");

export const resetPasswordController =
  container.resolve<ResetPasswordController>("IResetPasswordController");

export const loginController =
  container.resolve<LoginController>("ILoginController");

export const refreshTokenController = container.resolve<RefreshTokenController>(
  "IRefreshTokenController"
);

export const googleOAuthController = container.resolve<GoogleOAuthController>(
  "IGoogleOAuthController"
);

export const githubOAuthController = container.resolve<IGitHubOAuthController>(
  "IGitHubOAuthController"
);

export const forgotPasswordController =
  container.resolve<ForgotPasswordController>("IForgotPasswordController");

export const logoutController =
  container.resolve<LogoutController>("ILogoutController");

export const getUserController =
  container.resolve<GetUserController>("IGetUserController");

export const updateProfileController =
  container.resolve<UpdateProfileController>("IUpdateProfileController");

export const s3Controller = container.resolve<S3Controller>("IS3Controller");

export const getProfileController = container.resolve<GetProfileController>(
  "IGetProfileController"
);

export const adminSigninController = container.resolve<AdminSigninController>(
  "IAdminSigninController"
);

export const adminLogoutController = container.resolve<AdminLogoutController>(
  "IAdminLogoutController"
);

export const updateUserController = container.resolve<UpdateUserController>(
  "IUpdateUserController"
);

export const getAllUsersController = container.resolve<GetAllUsersController>(
  "IGetAllUsersController"
);

export const authMiddleware =
  container.resolve<AuthMiddleware>("IAuthMiddleware");

export const adminMiddleware =
  container.resolve<AdminMiddleware>("IAdminMiddleware");

export const getBloggersController = container.resolve<GetBloggersController>(
  "IGetBloggersController"
);

export const followsController =
  container.resolve<FollowsController>("IFollowsController");

export const findFollowsController = container.resolve<FindFollowsController>(
  "IFindFollowsController"
);
