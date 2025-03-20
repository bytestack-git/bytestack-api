import { injectable, inject } from "tsyringe";
import { IOTPGeneratorService } from "../../../domain/interfaces/serviceInterface/otp/otp-generate.service.interface";
import { ISendEmailUseCase } from "../../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IEmailService } from "../../../domain/interfaces/serviceInterface/email/email.service.interface";
import {
  sendEmailSchema,
  SendEmailDTO,
} from "../../../shared/validation/schemas";
import { getEmailTemplate } from "../../services/email/email-templates.service";
import { BaseError } from "../../../domain/errors/base.error";
import { ZodError } from "zod";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { config } from "../../../shared/config/config";

@injectable()
export class SendEmailUseCase implements ISendEmailUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IEmailService") private emailService: IEmailService,
    @inject("IOTPCacheService") private otpCacheService: IOTPCacheService,
    @inject("IOTPGeneratorService")
    private otpGeneratorService: IOTPGeneratorService
  ) {}

  async execute(
    data: SendEmailDTO
  ): Promise<{ status: number; message: string; success: boolean }> {
    // Validate input using schema
    let validatedData: SendEmailDTO;
    try {
      validatedData = sendEmailSchema.parse(data);
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
    const { email, type } = validatedData;

    // Validate email type
    const validTypes = ["otp", "forgot-password"];
    if (!validTypes.includes(type)) {
      throw new BaseError(
        ERROR_MSG.INVALID_EMAIL_TYPE,
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    // Check user existence based on type
    const user = await this.userRepository.findByEmail(email);

    if (user && type === "otp") {
      throw new BaseError(
        ERROR_MSG.EMAIL_ALREADY_EXIST,
        HTTP_STATUS.CONFLICT,
        true
      );
    }

    if (type === "forgot-password" && !user) {
      throw new BaseError(
        ERROR_MSG.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    // Generate and store OTP
    const otp = this.otpGeneratorService.generateOTP();
    await this.otpCacheService.storeOTP(email, otp, 180);

    // Send email
    const { subject, html } = getEmailTemplate(type, otp);
    try {
      await this.emailService.sendEmail({
        from: `${config.domain.DOMAIN_NAME} <${config.email.AUTH.user}>`,
        to: email,
        subject,
        html,
      });
    } catch (error) {
      throw new BaseError(
        "Failed to send email",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.OTP_SENT,
      success: true,
    };
  }
}
