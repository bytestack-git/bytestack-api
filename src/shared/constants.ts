// src/shared/constants.ts

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200, // Successful request
  CREATED: 201, // Resource successfully created
  ACCEPTED: 202, // Request accepted, processing in progress
  NO_CONTENT: 204, // Successful request with no content to return
  BAD_REQUEST: 400, // Invalid request
  UNAUTHORIZED: 401, // Authentication failed
  FORBIDDEN: 403, // Access denied
  NOT_FOUND: 404, // Resource not found
  CONFLICT: 409, // Conflict
  UNPROCESSABLE_ENTITY: 422, // Semantic errors
  INTERNAL_SERVER_ERROR: 500, // Server-side error
  SERVICE_UNAVAILABLE: 503, // Service unavailable
};

// Success Messages
export const SUCCESS_MSG = {
  // General
  OPERATION_SUCCESSFUL: "Operation completed successfully.",
  RESOURCE_FETCHED: "Resource fetched successfully.",

  // Auth
  LOGIN_SUCCESSFUL: "Login successful.",
  SIGNUP_SUCCESSFUL: "Signup successful.",
  MFA_ENABLED: "Multi-factor authentication enabled successfully.",

  // Blog
  BLOG_CREATED: "Blog created successfully.",
  BLOG_UPDATED: "Blog updated successfully.",
  BLOG_DELETED: "Blog deleted successfully.",
  PLAGIARISM_CHECK_PASSED: "Plagiarism check passed.",

  // Chat
  MESSAGE_SENT: "Message sent successfully.",
  CHAT_INITIATED: "Chat session initiated successfully.",

  // Payout
  PAYOUT_APPROVED: "Payout approved successfully.",
  PAYOUT_REJECTED: "Payout rejected successfully.",
};

// Error Messages
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

  // Auth
  CONFLICT: "email already exist",
  INVALID_CREDENTIALS: "Invalid username or password.",
  UNAUTHORIZED_ACCESS: "Unauthorized access. Please log in.",
  FORBIDDEN_ACCESS:
    "Access forbidden. You do not have the necessary permissions.",
  TOKEN_EXPIRED: "Session expired. Please log in again.",
  INVALID_TOKEN: "Invalid token. Please log in again.",
  MFA_REQUIRED: "Multi-factor authentication is required.",
  INVALID_MFA_CODE: "Invalid MFA code.",

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
};
