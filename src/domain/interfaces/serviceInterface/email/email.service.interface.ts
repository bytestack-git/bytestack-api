import { IEmailEntity } from "../../../entities/services/email.entity";

export interface IEmailService {
  sendEmail(options: IEmailEntity): Promise<void>;
}
