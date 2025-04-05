import { container } from "tsyringe";
import { SignupUseCase } from "../../application/useCases/user/auth/signup.usecase";
import { ISignupUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/signup.usecase.interface";
import { SendEmailUseCase } from "../../application/useCases/user/auth/send-email.usecase";
import { ISendEmailUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/send-email.usecase.interface";
import { ResetPasswordUseCase } from "../../application/useCases/user/auth/reset-password.usecase";
import { IResetPasswordUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/reset-password.usecase.interface";
import { IRefreshTokenUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/refresh-token.usecase.interface";
import { RefreshTokenUseCase } from "../../application/useCases/user/auth/refresh-token.usecase";
import { LoginUseCase } from "../../application/useCases/user/auth/login.usecase";
import { ILoginUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/login.usecase.interface";
import { LogoutUseCase } from "../../application/useCases/user/auth/logout.usecase";
import { ILogoutUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/logout.usecase.interface";
import { GetUserUseCase } from "../../application/useCases/user/profile/get-user.usecase";
import { IGetUserUseCase } from "../../domain/interfaces/usecaseInterface/user/profile/get-user.usecase.interface";
import { IForgotPasswordUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/forgot-password.usecase.interface";
import { ForgotPasswordUseCase } from "../../application/useCases/user/auth/forgot-password.usecase";
import { IAdminSigninUseCase } from "../../domain/interfaces/usecaseInterface/admin/signin.usecase.interface";
import { AdminSigninUseCase } from "../../application/useCases/admin/signin.usecase";
import { IAdminLogoutUseCase } from "../../domain/interfaces/usecaseInterface/admin/admin-logout.usecase.interface";
import { AdminLogoutUseCase } from "../../application/useCases/admin/admin-logout.usecase";
import { IGetAllUsersUsecase } from "../../domain/interfaces/usecaseInterface/admin/get-all-users.usecase.interface";
import { GetAllUsersUsecase } from "../../application/useCases/admin/get-all-users.usecase";
import { IUpdateUserUsecase } from "../../domain/interfaces/usecaseInterface/admin/update-user.usecase.interface";
import { UpdateUserUsecase } from "../../application/useCases/admin/update-user.usecase";
import { IGoogleOAuthLoginUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/google-oauth.usecase.interface";
import { GoogleOAuthLoginUseCase } from "../../application/useCases/user/auth/google-oauth.usecase";
import { IGitHubOAuthLoginUseCase } from "../../domain/interfaces/usecaseInterface/user/auth/github-oauth.usecase.interface";
import { GitHubOAuthLoginUseCase } from "../../application/useCases/user/auth/github-oauth.usecase";
import { IUpdateProfileUseCase } from "../../domain/interfaces/usecaseInterface/user/profile/update-profile.usecase.interface";
import { UpdateProfileUseCase } from "../../application/useCases/user/profile/update-profile.usecase";
import { IGetProfileUseCase } from "../../domain/interfaces/usecaseInterface/user/profile/get-profile.usecase.interface";
import { GetProfileUseCase } from "../../application/useCases/user/profile/get-profile.usecase";
import { IGetBloggersUseCase } from "../../domain/interfaces/usecaseInterface/user/profile/get-bloggers.usecase.interface";
import { GetBloggersUseCase } from "../../application/useCases/user/profile/get-bloggers.usecase";

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

container.register<IGoogleOAuthLoginUseCase>("IGoogleOAuthLoginUseCase", {
  useClass: GoogleOAuthLoginUseCase,
});

container.register<IGitHubOAuthLoginUseCase>("IGitHubOAuthLoginUseCase", {
  useClass: GitHubOAuthLoginUseCase,
});

container.register<IUpdateProfileUseCase>("IUpdateProfileUsecase", {
  useClass: UpdateProfileUseCase,
});

container.register<IGetProfileUseCase>("IGetProfileUseCase", {
  useClass: GetProfileUseCase,
});

container.register<IGetBloggersUseCase>("IGetBloggersUseCase", {
  useClass: GetBloggersUseCase,
});
