import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: "Too many attempts. Please try again later.",
    success: false,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
