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
const internalOtpType = [
  "otp",
  "resend-otp",
  "forgot-password",
  "password-updated",
] as const;
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
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(10, { message: "Enter a valid name" })
    .trim(),
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
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
  data: z
    .object({
      isBanned: z.boolean().optional(),
    })
    .refine((data) => data.isBanned !== undefined, {
      message: "At least one field (isBanned) must be provided",
    }),
});

export const oauthCodeSchema = z.object({
  code: z.string(),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    })
    .optional(),
  headline: z
    .string()
    .regex(/^[\w\s.,'@*(){}[\]\\/|-]*$/, {
      message:
        "Headline can include letters, spaces, commas, dots, hyphens, apostrophes, @, *, (), {}, [], \\ or /",
    })
    .optional(),
  bio: z
    .string()
    .regex(/^[\w\s.,'@*(){}[\]\\/|-]*$/, {
      message:
        "Bio can include letters, spaces, commas, dots, hyphens, apostrophes, @, *, (), {}, [], \\ or /",
    })
    .optional(),
  links: z
    .array(z.string().trim().url({ message: "Each link must be a valid URL" }))
    .max(3, { message: "You can add up to 3 links" })
    .optional(),
  techInterests: z
    .array(z.string())
    .max(20, { message: "You can add up to 20 tech interests" })
    .optional(),
  avatar: z.any().optional(),
});

// Type inference
export type SendEmailDTO = z.infer<typeof sendEmailSchema>;
export type UserSignupDTO = z.infer<typeof userSignupSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type OAuthCodeDTO = z.infer<typeof oauthCodeSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
