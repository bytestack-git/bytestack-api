import { injectable, inject } from "tsyringe";
import { ISendEmailUseCase } from "../../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { IOTPService } from "../../../domain/interfaces/serviceInterface/auth/otp.service.interface";
import { IEmailService } from "../../../domain/interfaces/serviceInterface/email/email.service.interface";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { config } from "../../../shared/config/config";
import { getEmailTemplate } from "../../services/email/email-templates.service";

@injectable()
export class SendEmailUseCase implements ISendEmailUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IEmailService") private emailService: IEmailService,
    @inject("IOTPService") private otpService: IOTPService
  ) {}

  async execute(
    email: string,
    type: "otp" | "forgot-password" | "resend-otp"
  ): Promise<{ status: number; message: string; success: boolean }> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(ERROR_MSG.INVALID_DATA);
    }

    const user = await this.userRepository.findByEmail(email);
    if (user && type === "otp") {
      throw new Error(ERROR_MSG.EMAIL_ALREADY_EXIST);
    }

    const otp = this.otpService.generateOTP();

    await this.otpService.storeOTP(email, otp, 180);

    const { subject, html } = getEmailTemplate(type, otp);

    await this.emailService.sendEmail({
      from: `${config.domain.DOMAIN_NAME} <${config.email.AUTH.user}>`,
      to: email,
      subject,
      html,
    });

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.OTP_SENT,
      success: true,
    };
  }
}
