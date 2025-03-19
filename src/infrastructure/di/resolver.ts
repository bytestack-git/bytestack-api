// src/infrastructure/di/resolver.ts
import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";
import { SendOtpController } from "../../presentation/controllers/auth/send-otp.controller";
import { ResetPasswordController } from "../../presentation/controllers/auth/reset-password.controller";

import "./container";
import "./service.registry";
import { LoginController } from "../../presentation/controllers/auth/login.controller";
import { RefreshTokenController } from "../../presentation/controllers/auth/refresh-token.controller";
import { LogoutController } from "../../presentation/controllers/auth/logout.controller";
import { AuthMiddleware } from "../../presentation/middleware/auth.middleware";

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

export const logoutController =
  container.resolve<LogoutController>("ILogoutController");

export const authMiddleware =
  container.resolve<AuthMiddleware>("AuthMiddleware");
