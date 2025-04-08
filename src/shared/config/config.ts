import dotenv from "dotenv";
dotenv.config();

export const config = {
  domain: {
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    ORIGIN: process.env.ORIGIN,
  },

  cors: {
    ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173",
  },

  server: {
    HOST: process.env.HOST || "localhost",
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
  },

  database: {
    URI: process.env.DATABASE_URI || "mongodb://localhost:27017/bytestack",
  },

  email: {
    SERVICE: "gmail",
    AUTH: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },

  redis: {
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_HOST: process.env.REDIS_HOST,
  },

  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
  },

  aws: {
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  },
};
