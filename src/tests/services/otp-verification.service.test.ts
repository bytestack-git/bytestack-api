// src/tests/services/otp/otp-verification.service.test.ts
import "reflect-metadata"
import { container } from "tsyringe";
import { OTPVerificationService } from "../../application/services/otp/otp-verification.service";
import { OTPCacheService } from "../../application/services/otp/otp-cache.service";
import { OTPGeneratorService } from "../../application/services/otp/otp-generator";
import { IOTPCacheService } from "../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IOTPGeneratorService } from "../../domain/interfaces/serviceInterface/otp/otp-generate.service.interface";
import { ERROR_MSG } from "../../shared/constants/error-msg";

// Register dependencies with the container
container.register<IOTPCacheService>("IOTPCacheService", {
  useClass: OTPCacheService,
});
container.register<IOTPGeneratorService>("IOTPGeneratorService", {
  useClass: OTPGeneratorService,
});

describe("OTPVerificationService", () => {
  let otpCacheService: IOTPCacheService;
  let otpVerificationService: OTPVerificationService;
  let otpGeneratorService: IOTPGeneratorService;

  beforeEach(() => {
    // Resolve services from container
    otpCacheService = container.resolve<IOTPCacheService>("IOTPCacheService");
    otpGeneratorService = container.resolve<IOTPGeneratorService>(
      "IOTPGeneratorService"
    );
    otpVerificationService = container.resolve(OTPVerificationService);
  });

  afterEach(async () => {
    // Clean up Redis after each test
    await otpCacheService.deleteOTP("test@example.com");
  });

  it("should verify OTP successfully before expiration", async () => {
    const email = "test@example.com";
    const otp = otpGeneratorService.generateOTP();

    // Store OTP with 5-second TTL
    await otpCacheService.storeOTP(email, otp, 5);

    // Verify OTP
    const isValid = await otpVerificationService.verifyOTP(email, otp);

    expect(isValid).toBe(true);
  });

  it("should fail verification with incorrect OTP", async () => {
    const email = "test@example.com";
    const otp = otpGeneratorService.generateOTP();

    // Store OTP with 5-second TTL
    await otpCacheService.storeOTP(email, otp, 5);

    // Try verifying with wrong OTP
    await expect(
      otpVerificationService.verifyOTP(email, "123456") // Assuming otp isn't 123456
    ).rejects.toThrow(ERROR_MSG.INVALID_OTP);
  });

  it("should fail verification after TTL expires", async () => {
    const email = "test@example.com";
    const otp = otpGeneratorService.generateOTP();

    // Store OTP with 1-second TTL
    await otpCacheService.storeOTP(email, otp, 1);

    // Wait for expiration (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Try verifying after expiration
    await expect(otpVerificationService.verifyOTP(email, otp)).rejects.toThrow(
      ERROR_MSG.INVALID_OTP
    );
  });

  it("should fail verification when no OTP exists", async () => {
    const email = "test@example.com";

    // Try verifying without storing OTP
    await expect(
      otpVerificationService.verifyOTP(email, "123456")
    ).rejects.toThrow(ERROR_MSG.INVALID_OTP);
  });
});
