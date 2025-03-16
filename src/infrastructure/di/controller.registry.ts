import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";
import { SendOtpController } from "../../presentation/controllers/auth/send-otp.controller";

container.register("ISignupController", { useClass: SignupController });
container.register("ISendOtpController", { useClass: SendOtpController });
 