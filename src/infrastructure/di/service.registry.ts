import { container } from "tsyringe";
import { HashService } from "../../application/services/security/hash.service";
import { IHashService } from "../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { OTPService } from "../../application/services/auth/otp.service";
import { IOTPService } from "../../domain/interfaces/serviceInterface/auth/otp.service.interface";
import { EmailService } from "../../application/services/email/email.service";
import { IEmailService } from "../../domain/interfaces/serviceInterface/email/email.service.interface";

container.register<IHashService>("IHashService", { useClass: HashService });
container.register<IOTPService>("IOTPService", { useClass: OTPService });
container.register<IEmailService>("IEmailService", { useClass: EmailService });
