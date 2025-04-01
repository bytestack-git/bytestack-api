export const ERROR_MSG = {
  // General
  INVALID_REQUEST: "Invalid request. Please check your input and try again.",
  NOT_FOUND: "Resource not found.",
  INTERNAL_SERVER_ERROR:
    "An unexpected error occurred. Please try again later.",
  SERVICE_UNAVAILABLE:
    "Service is currently unavailable. Please try again later.",

  // Validation
  INVALID_DATA: "Invalid data provided.",
  REQUIRED_FIELD_MISSING: "Required field is missing.",
  INVALID_FORMAT: "Invalid format for the provided data.",

  // OTP
  INVALID_OTP: "The OTP you entered is incorrect. Please try again.",
  OTP_EXPIRED: "The OTP has expired. Please request a new one.",

  // Validation Messages
  INVALID_EMAIL_PASSWORD:
    "Invalid email or password. Please check and try again.",

  // Authentication
  CONFLICT: "Email already exists.",
  INVALID_CREDENTIALS: "Invalid username or password.",
  UNAUTHORIZED_ACCESS: "Unauthorized access. Please log in.",
  FORBIDDEN_ACCESS:
    "Access forbidden. You do not have the necessary permissions.",
  TOKEN_EXPIRED: "Session expired. Please log in again.",
  INVALID_TOKEN: "Invalid token. Please log in again.",
  MFA_REQUIRED: "Multi-factor authentication is required.",
  INVALID_MFA_CODE: "Invalid MFA code.",
  INVALID_EMAIL_TYPE: "Invalid email type.",
  EMAIL_SEND_FAILED: "Failed to send email.",
  EMAIL_ALREADY_EXIST: "Email already exists.",
  EMAIL_NOT_FOUND: "Email not found.",
  ALREADY_LOGGED_OUT: "You are already logged out.",
  INVALID_CODE: "Invalid OAuth code.",
  TOKEN_EXCHANGE_FAILED: "Failed to exchange OAuth code for token.",

  // User
  USER_NOT_FOUND: "User not found.",

  // Blog
  BLOG_NOT_FOUND: "Blog not found.",
  DUPLICATE_BLOG_TITLE: "A blog with this title already exists.",
  PLAGIARISM_DETECTED: "Plagiarism detected in the content.",
  FAILED_TO_UPLOAD_IMAGE: "Failed to upload image to S3.",

  // Chat
  CHAT_NOT_FOUND: "Chat session not found.",
  MESSAGE_FAILED: "Failed to send message.",

  // Payout
  PAYOUT_NOT_FOUND: "Payout request not found.",
  PAYOUT_ALREADY_PROCESSED: "Payout request has already been processed.",
  INSUFFICIENT_FUNDS: "Insufficient funds for payout.",

  // Database/External Services
  DATABASE_ERROR: "Database error occurred.",
  REDIS_ERROR: "Failed to connect to Redis cache.",
  S3_ERROR: "Failed to interact with S3 storage.",

  // AWS
  S3_DELETE_FAILED: "Failed to delete file from S3.",
  S3_BUCKET_NAME_UNDEFINED: "S3 bucket name is not defined.",
  S3_UPLOAD_URL_GENERATION_FAILED: "Failed to generate S3 upload URL.",
};
