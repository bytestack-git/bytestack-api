// src/infrastructure/di/resolver.ts
import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";
import { SendOtpController } from "../../presentation/controllers/auth/send-otp.controller";

import "./container";
import "./service.registry";

export const signupController =
  container.resolve<SignupController>("ISignupController");

export const sendOtpController =
  container.resolve<SendOtpController>("ISendOtpController");
