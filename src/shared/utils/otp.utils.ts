import { randomInt } from "crypto";

export const generateOTP = (): string => {
  const otp = randomInt(100000, 999999);
  return otp.toString();
};
