import { container } from "tsyringe";
import { SignupController } from "../../presentation/controllers/auth/signup.controller";

container.register("ISignupController", { useClass: SignupController });
