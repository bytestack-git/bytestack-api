import dotenv from "dotenv";
dotenv.config();

export const config = {
  // CORS Configuration
  cors: {
    ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173",
  },

  // Server Configuration
  server: {
    HOST: process.env.HOST || "localhost",
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
  },

  database: {
    URI: process.env.DATABASE_URI || "mongodb://localhost:27017/bytestack",
  },
};
