import { injectable, inject } from "tsyringe";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { ISignupUseCase } from "../../../domain/interfaces/usecaseInterface/auth/signup.usecase.interface";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { IOTPService } from "../../../domain/interfaces/serviceInterface/auth/otp.service.interface";
import { UserDTO } from "../../../shared/dtos/user.dto";

@injectable()
export class SignupUseCase implements ISignupUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IHashService") private hashService: IHashService,
    @inject("IOTPService") private otpService: IOTPService
  ) {}

  async execute(
    userData: UserDTO
  ): Promise<{ status: number; message: string; success: boolean }> {
    const { name, email, password, otp } = userData;

    if (!name || !email || !password || !otp) {
      throw new Error(ERROR_MSG.REQUIRED_FIELD_MISSING);
    }

    if (password.length < 6) throw new Error(ERROR_MSG.INVALID_DATA);

    // Verify OTP
    const otpData = await this.otpService.getOTP(email);

    if (!otpData) throw new Error(ERROR_MSG.OTP_EXPIRED);

    // Verify OTP
    const isOTPValid = await this.otpService.verifyOTP(email, otp);

    if (!isOTPValid) throw new Error(ERROR_MSG.INVALID_OTP);

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
