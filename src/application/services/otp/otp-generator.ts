import { randomInt } from "crypto";
import { IOTPGeneratorService } from "../../../domain/interfaces/serviceInterface/otp/otp-generate.service.interface";

export class OTPGeneratorService implements IOTPGeneratorService {
  generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }
}
