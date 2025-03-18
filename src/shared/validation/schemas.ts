// src/shared/validation/schemas.ts
import { z } from "zod";

// Custom email regex
export const emailSchema = z
  .string()
  .nonempty("Email is required")
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Please enter a valid email address",
  });

// OTP schema
export const otpSchema = z
  .string()
  .length(6, { message: "OTP must be 6 digits" })
  .regex(/^\d+$/, { message: "OTP must contain only numbers" });

// Internal OTP type enum
const internalOtpType = ["otp", "resend-otp", "forgot-password"] as const;
export type InternalOtpType = (typeof internalOtpType)[number];

// Send email schema
export const sendEmailSchema = z.object({
  email: emailSchema,
  type: z
    .string()
    .refine((val) => internalOtpType.includes(val as InternalOtpType), {
      message: "Invalid request type",
    }),
});

// User signup schema
export const userSignupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).trim(),
  email: emailSchema,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      }
    ),
  otp: otpSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: otpSchema,
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
});

// Type inference
export type SendEmailDTO = z.infer<typeof sendEmailSchema>;
export type UserSignupDTO = z.infer<typeof userSignupSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
