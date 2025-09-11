import { injectable, inject } from "tsyringe";
import { IOTPVerificationService } from "../../../domain/interfaces/serviceInterface/otp/otp-verification.service.interface";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/profile/user.repository.interface";
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
import { BaseError } from "../../../domain/errors/base.error";
import { ZodError } from "zod";
import { generateProfileSlug } from "../../../shared/utils/slug.utils";

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
    let validatedData: UserSignupDTO;
    try {
      validatedData = userSignupSchema.parse(data);
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
    const { name, email, password, otp } = validatedData;

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BaseError(
        ERROR_MSG.EMAIL_ALREADY_EXIST,
        HTTP_STATUS.CONFLICT,
        true
      );
    }

    // Check if OTP exists
    const otpData = await this.otpCacheService.getOTP(email);
    if (!otpData) {
      throw new BaseError(ERROR_MSG.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST, true);
    }

    // Verify OTP
    await this.otpVerificationService.verifyOTP(email, otp);

    // Hash the password
    const hashedPassword = await this.hashService.hash(password);
    const slug = await generateProfileSlug(email, this.userRepository);
    console.log(slug);

    // Create user entity
    const user: IUserEntity = {
      name,
      email,
      slug,
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

    // Save the user
    try {
      await this.userRepository.save(user);
    } catch {
      throw new BaseError(
        "Failed to save user",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    return {
      status: HTTP_STATUS.CREATED,
      message: SUCCESS_MSG.SIGNUP_SUCCESSFUL,
      success: true,
    };
  }
}
