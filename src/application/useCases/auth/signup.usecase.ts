import { injectable, inject } from "tsyringe";
import { IOTPVerificationService } from "../../../domain/interfaces/serviceInterface/otp/otp-verification.service.interface";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { ISignupUseCase } from "../../../domain/interfaces/usecaseInterface/auth/signup.usecase.interface";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import {
  UserSignupDTO,
  userSignupSchema,
} from "../../../shared/validation/schemas";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class SignupUseCase implements ISignupUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IHashService") private hashService: IHashService,
    @inject("IOTPCacheService") private otpCacheService: IOTPCacheService,
    @inject("IOTPVerificationService")
    private otpVerificationService: IOTPVerificationService
  ) {}

  async execute(
    data: UserSignupDTO
  ): Promise<{ status: number; message: string; success: boolean }> {
    const validatedData = userSignupSchema.parse(data);
    const { name, email, password, otp } = validatedData;

    const otpData = await this.otpCacheService.getOTP(email);

    if (!otpData) throw new Error(ERROR_MSG.OTP_EXPIRED);

    const isOTPValid = await this.otpVerificationService.verifyOTP(email, otp);

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
