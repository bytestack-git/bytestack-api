import { string, z } from "zod";

export const emailSchema = z
  .string()
  .nonempty("Email is required")
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Please enter a valid email address",
  });

export const otpSchema = z
  .string()
  .length(6, { message: "OTP must be 6 digits" })
  .regex(/^\d+$/, { message: "OTP must contain only numbers" });

export const userSlug = z
  .string()
  .regex(/[^a-zA-Z0-9_]*$/, { message: "user not found" });

const blogStatusEnum = z.enum(["draft", "published", "hidden"]);

const internalOtpType = [
  "otp",
  "resend-otp",
  "forgot-password",
  "password-updated",
] as const;

export const sendEmailSchema = z.object({
  email: emailSchema,
  type: z
    .string()
    .refine((val) => internalOtpType.includes(val as InternalOtpType), {
      message: "Invalid request type",
    }),
});

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
    .trim()
    .regex(/^[a-zA-Z\s]{2,}$/, {
      message: "Name can only contain letters and spaces",
    })
    .optional(),
  headline: z
    .string()
    .trim()
    .regex(/^[\w\s.,'@*(){}[\]\\/|&-]*$/, {
      message:
        "Headline can include letters, spaces, commas, dots, hyphens, apostrophes, @, *, (), {}, &, [], \\ or /",
    })
    .optional(),
  bio: z
    .string()
    .trim()
    .regex(/^[\w\s.,'@*(){}[\]\\/|&#-]*$/, {
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
  avatar: z.string().optional(),
});

export const blogRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(100000, "Content too long"),
  metaTitle: z
    .string()
    .max(70, "Meta title must be 70 characters or less")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description must be 160 characters or less")
    .optional(),
  slug: z.string().max(100, "Slug must be 100 characters or less").optional(),
  topics: z.array(z.string().min(1, "Topic cannot be empty")).min(0).optional(),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).min(0).optional(),
  isPremium: z.boolean().default(false),
  status: blogStatusEnum.default("draft"),
  readTime: z
    .string()
    .max(10, "Read time must be 10 characters or less")
    .optional(),
});

// Type inference
export type InternalOtpType = (typeof internalOtpType)[number];
export type SendEmailDTO = z.infer<typeof sendEmailSchema>;
export type UserSignupDTO = z.infer<typeof userSignupSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type OAuthCodeDTO = z.infer<typeof oauthCodeSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type BlogRequestDTO = z.infer<typeof blogRequestSchema>;
