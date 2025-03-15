import { injectable, inject } from "tsyringe";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { ISignupUseCase } from "../../../domain/interfaces/usecaseInterface/auth/signup.usecase.interface";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { HTTP_STATUS, ERROR_MSG, SUCCESS_MSG } from "../../../shared/constants";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";

@injectable()
export class SignupUseCase implements ISignupUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IHashService") private hashService: IHashService
  ) {}

  async execute(
    name: string,
    email: string,
    password: string
  ): Promise<{ status: number; message: string; success: boolean }> {
    if (!name || !email || !password) {
      throw new Error(ERROR_MSG.REQUIRED_FIELD_MISSING);
    }

    if (password.length < 6) throw new Error(ERROR_MSG.INVALID_DATA);

    const userExist = await this.userRepository.findByEmail(email);
    if (userExist) throw new Error(ERROR_MSG.CONFLICT);

    const hashedPassword = await this.hashService.hash(password);

    const user: IUserEntity = {
      name: name,
      email: email,
      password: hashedPassword,
      avatar: "default_avatar.png",
      isBlogger: false,
      isSubscribed: false,
      subType: null,
      subEndDate: null,
      trialEndDate: null,
      followedTopics: [],
      techInterests: [],
      searchHistory: [],
      isBanned: false,
    };

    await this.userRepository.save(user);

    return {
      status: HTTP_STATUS.CREATED,
      message: SUCCESS_MSG.SIGNUP_SUCCESSFUL,
      success: true,
    };
  }
}
