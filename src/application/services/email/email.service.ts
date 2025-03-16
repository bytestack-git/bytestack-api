import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import { IEmailService } from "../../../domain/interfaces/serviceInterface/email/email.service.interface";
import { IEmailEntity } from "../../../domain/entities/services/email.entity";
import { config } from "../../../shared/config/config";

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

    await this.transporter.sendMail(mailOptions);
  }
}
