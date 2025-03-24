import { injectable, inject } from "tsyringe";
import { ISendEmailUseCase } from "../../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IEmailService } from "../../../domain/interfaces/serviceInterface/email/email.service.interface";
import { IOTPGeneratorService } from "../../../domain/interfaces/serviceInterface/otp/otp-generate.service.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
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
    private otpGeneratorService: IOTPGeneratorService,
    @inject("ITokenService") private tokenService: ITokenService
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
        const errorMessage = error.errors.map((err) => err.message).join(", ");
        throw new BaseError(
          `Invalid data provided: ${errorMessage}`,
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

    if (type === "password-updated" && !user) {
      throw new BaseError(
        ERROR_MSG.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    // Generate content based on type
    let subject: string;
    let html: string;

    if (type === "forgot-password") {
      if (!user?._id) {
        throw new BaseError(
          ERROR_MSG.EMAIL_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
          true
        );
      }

      const resetToken = this.tokenService.generateAccessToken(
        user!._id.toString(),
        "reset"
      );

      const resetLink = `${config.domain.ORIGIN}/reset-password?token=${resetToken}`;
      const template = getEmailTemplate(type, undefined, resetLink);
      subject = template.subject;
      html = template.html;
    } else if (type === "password-updated") {
      const template = getEmailTemplate(type);
      subject = template.subject;
      html = template.html;
    } else {
      const otp = this.otpGeneratorService.generateOTP();
      console.log("=> OTP", otp);
      await this.otpCacheService.storeOTP(email, otp, 180);

      const template = getEmailTemplate(type, otp);
      subject = template.subject;
      html = template.html;
    }

    // Send email
    await this.emailService.sendEmail({
      from: `${config.domain.DOMAIN_NAME} <${config.email.AUTH.user}>`,
      to: email,
      subject,
      html,
    });
    return {
      status: HTTP_STATUS.OK,
      message:
        type === "forgot-password"
          ? "Password reset link sent to your email"
          : type === "resend-otp"
            ? "New OTP has been sent to your email"
            : SUCCESS_MSG.OTP_SENT,
      success: true,
    };
  }
}
