import { injectable, inject } from "tsyringe";
import { IOTPGeneratorService } from "../../../domain/interfaces/serviceInterface/otp/otp-generate.service.interface";
import { ISendEmailUseCase } from "../../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IEmailService } from "../../../domain/interfaces/serviceInterface/email/email.service.interface";
import { sendEmailSchema } from "../../../shared/validation/schemas";
import { SendEmailDTO } from "../../../shared/validation/schemas";
import { getEmailTemplate } from "../../services/email/email-templates.service";
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
    const validatedData = sendEmailSchema.parse(data);
    const { email, type } = validatedData;

    const user = await this.userRepository.findByEmail(email);

    if (user && type === "otp") throw new Error(ERROR_MSG.EMAIL_ALREADY_EXIST);

    if (type === "forgot-password" && !user) {
      throw new Error(ERROR_MSG.EMAIL_NOT_FOUND);
    }

    const otp = this.otpGeneratorService.generateOTP();

    await this.otpCacheService.storeOTP(email, otp, 180);

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
