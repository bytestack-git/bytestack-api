// src/infrastructure/di/resolver.ts
import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";

import "./container"; 

export const signupController = container.resolve<SignupController>("ISignupController");