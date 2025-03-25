import { injectable, inject } from "tsyringe";
import { ILoginUseCase } from "../../../domain/interfaces/usecaseInterface/auth/login.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { loginSchema, LoginDTO } from "../../../shared/validation/schemas";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { BaseError } from "../../../domain/errors/base.error";
import { ZodError } from "zod";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("IHashService") private hashService: IHashService
  ) {}

  async execute(data: LoginDTO): Promise<{
    status: number;
    message: string;
    success: boolean;
    user: Partial<IUserEntity>;
    tokens?: { accessToken: string; refreshToken: string };
  }> {
    // Validate input using schema
    let validatedData: LoginDTO;
    try {
      validatedData = loginSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BaseError(
          ERROR_MSG.INVALID_DATA,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }
      throw new BaseError(
        "Failed to validate input data",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
    const { email, password } = validatedData;

    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password || !user._id) {
      throw new BaseError(
        ERROR_MSG.INVALID_EMAIL_PASSWORD,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    // Verify password
    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) {
      throw new BaseError(
        ERROR_MSG.INVALID_EMAIL_PASSWORD,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    const userId = user._id.toString();

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(
      userId,
      "access",
      "user"
    );
    const refreshToken = this.tokenService.generateRefreshToken(userId, "user");

    // Store refresh token
    await this.tokenService.storeRefreshToken(
      userId,
      refreshToken,
      this.tokenService.getRefreshTokenExpiry()
    );

    const userData = {
      email: user.email,
      avatar: user.avatar,
      name: user.name,
    };

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.LOGIN_SUCCESSFUL,
      success: true,
      user: userData,
      tokens: { accessToken, refreshToken },
    };
  }
}
