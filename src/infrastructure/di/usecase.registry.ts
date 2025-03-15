import { container } from "tsyringe";
import { SignupUseCase } from "../../application/useCases/auth/signup.usecase";
import { ISignupUseCase } from "../../domain/interfaces/usecaseInterface/auth/signup.usecase.interface";

container.register<ISignupUseCase>("ISignupUseCase", {
  useClass: SignupUseCase,
});
