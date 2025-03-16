import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import { IEmailService } from "../../../domain/interfaces/serviceInterface/email/email.service.interface";
import { IEmailEntity } from "../../../domain/entities/services/email.entity";
import { config } from "../../../shared/config/config";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.email.SERVICE,
      auth: config.email.AUTH,
    });
  }

  async sendEmail(options: IEmailEntity): Promise<void> {
    const mailOptions = {
      ...options,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Email Send Error:", error.message);
      }
      
      throw new Error(ERROR_MSG.EMAIL_SEND_FAILED);
    }
  }
}
