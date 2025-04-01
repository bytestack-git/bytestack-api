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
import { ICacheService } from "../../domain/interfaces/serviceInterface/cache/cache.service.interface";
import { CacheService } from "../../application/services/cache/cache.service";
import { IGoogleOAuthService } from "../../domain/interfaces/serviceInterface/auth/google-oauth.service.interface";
import { GoogleOAuthService } from "../../application/services/auth/google-oauth.service";
import { IGitHubOAuthService } from "../../domain/interfaces/serviceInterface/auth/github-oauth.service.interface";
import { GitHubOAuthService } from "../../application/services/auth/github-oauth.service";
import { IS3Service } from "../../domain/interfaces/serviceInterface/s3/s3.service.interface";
import { S3Service } from "../../application/services/s3/s3.service";

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

container.register<ICacheService>("ICacheService", {
  useClass: CacheService,
});

container.register<IGoogleOAuthService>("IGoogleOAuthService", {
  useClass: GoogleOAuthService,
});

container.register<IGitHubOAuthService>("IGitHubOAuthService", {
  useClass: GitHubOAuthService,
});

container.register<IS3Service>("IS3Service", {
  useClass: S3Service,
});
