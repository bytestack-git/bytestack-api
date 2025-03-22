import { container } from "tsyringe";
import { HashService } from "../../application/services/security/hash.service";
import { IHashService } from "../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { OTPCacheService } from "../../application/services/otp/otp-cache.service";
import { IOTPCacheService } from "../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { EmailService } from "../../application/services/email/email.service";
import { IEmailService } from "../../domain/interfaces/serviceInterface/email/email.service.interface";
import { OTPVerificationService } from "../../application/services/otp/otp-verification.service";
import { IOTPVerificationService } from "../../domain/interfaces/serviceInterface/otp/otp-verification.service.interface";
import { OTPGeneratorService } from "../../application/services/otp/otp-generator";
import { IOTPGeneratorService } from "../../domain/interfaces/serviceInterface/otp/otp-generate.service.interface";
import { TokenService } from "../../application/services/security/token.service";
import { ITokenService } from "../../domain/interfaces/serviceInterface/security/token.service.interface";

container.register<IHashService>("IHashService", { useClass: HashService });

container.register<IOTPCacheService>("IOTPCacheService", {
  useClass: OTPCacheService,
});

container.register<IOTPVerificationService>("IOTPVerificationService", {
  useClass: OTPVerificationService,
});

container.register<IEmailService>("IEmailService", { useClass: EmailService });

container.register<IOTPGeneratorService>("IOTPGeneratorService", {
  useClass: OTPGeneratorService,
});

container.register<ITokenService>("ITokenService", { useClass: TokenService });
