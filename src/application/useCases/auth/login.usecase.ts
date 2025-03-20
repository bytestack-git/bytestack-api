import { injectable, inject } from "tsyringe";
import { ILoginUseCase } from "../../../domain/interfaces/usecaseInterface/auth/login.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { loginSchema, LoginDTO } from "../../../shared/validation/schemas";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { IUserEntity } from "../../../domain/entities/models/user.entity";

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
    user: IUserEntity;
    tokens?: { accessToken: string; refreshToken: string };
  }> {
    loginSchema.parse(data);
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password || !user._id) {
      throw Error(ERROR_MSG.INVALID_EMAIL_PASSWORD);
    }

    const isMatch = this.hashService.compare(password, user.password);
    if (!isMatch) throw new Error(ERROR_MSG.INVALID_EMAIL_PASSWORD);

    const userId = user._id.toString();

    const accessToken = this.tokenService.generateAccessToken(userId);
    const refreshToken = this.tokenService.generateRefreshToken(userId);

    return {
      status: 200,
      message: "Login successful",
      success: true,
      user: user,
      tokens: { accessToken, refreshToken },
    };
  }
}
