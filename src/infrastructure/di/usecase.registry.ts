import { container } from "tsyringe";
import { SignupUseCase } from "../../application/useCases/auth/signup.usecase";
import { ISignupUseCase } from "../../domain/interfaces/usecaseInterface/auth/signup.usecase.interface";
import { SendEmailUseCase } from "../../application/useCases/auth/send-email.usecase";
import { ISendEmailUseCase } from "../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import { ResetPasswordUseCase } from "../../application/useCases/auth/reset-password.usecase";
import { IResetPasswordUseCase } from "../../domain/interfaces/usecaseInterface/auth/reset-password.usecase.interface";
import { IRefreshTokenUseCase } from "../../domain/interfaces/usecaseInterface/auth/refresh-token.usecase.interface";
import { RefreshTokenUseCase } from "../../application/useCases/auth/refresh-token.usecase";
import { LoginUseCase } from "../../application/useCases/auth/login.usecase";
import { ILoginUseCase } from "../../domain/interfaces/usecaseInterface/auth/login.usecase.interface";
import { LogoutUseCase } from "../../application/useCases/auth/logout.usecase";
import { ILogoutUseCase } from "../../domain/interfaces/usecaseInterface/auth/logout.usecase.interface";
import { GetUserUseCase } from "../../application/useCases/user/get-user.usecase";
import { IGetUserUseCase } from "../../domain/interfaces/usecaseInterface/user/get-user.usecase.interface";
import { IForgotPasswordUseCase } from "../../domain/interfaces/usecaseInterface/auth/forgot-password.usecase.interface";
import { ForgotPasswordUseCase } from "../../application/useCases/auth/forgot-password.usecase";
import { IAdminSigninUseCase } from "../../domain/interfaces/usecaseInterface/admin/signin.usecase.interface";
import { AdminSigninUseCase } from "../../application/useCases/admin/signin.usecase";
import { IAdminLogoutUseCase } from "../../domain/interfaces/usecaseInterface/admin/admin-logout.usecase.interface";
import { AdminLogoutController } from "../../presentation/controllers/admin/admin-logout.controller";
import { AdminLogoutUseCase } from "../../application/useCases/admin/admin-logout.usecase";
import { IGetAllUsersUsecase } from "../../domain/interfaces/usecaseInterface/admin/get-all-users.usecase.interface";
import { GetAllUsersUsecase } from "../../application/useCases/admin/get-all-users.usecase";
import { IUpdateUserUsecase } from "../../domain/interfaces/usecaseInterface/admin/update-user.usecase.interface";
import { UpdateUserUsecase } from "../../application/useCases/admin/update-user.usecase";

container.register<ISignupUseCase>("ISignupUseCase", {
  useClass: SignupUseCase,
});
container.register<ISendEmailUseCase>("ISendEmailUseCase", {
  useClass: SendEmailUseCase,
});

container.register<IResetPasswordUseCase>("IResetPasswordUseCase", {
  useClass: ResetPasswordUseCase,
});

container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase", {
  useClass: ForgotPasswordUseCase,
});

container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
  useClass: RefreshTokenUseCase,
});

container.register<ILoginUseCase>("ILoginUseCase", {
  useClass: LoginUseCase,
});

container.register<ILogoutUseCase>("ILogoutUseCase", {
  useClass: LogoutUseCase,
});

container.register<IGetUserUseCase>("IGetUserUseCase", {
  useClass: GetUserUseCase,
});

container.register<IAdminSigninUseCase>("IAdminSigninUseCase", {
  useClass: AdminSigninUseCase,
});

container.register<IAdminLogoutUseCase>("IAdminLogoutUseCase", {
  useClass: AdminLogoutUseCase,
});

container.register<IGetAllUsersUsecase>("IGetAllUsersUsecase", {
  useClass: GetAllUsersUsecase,
});

container.register<IUpdateUserUsecase>("IUpdateUserUsecase", {
  useClass: UpdateUserUsecase,
});
