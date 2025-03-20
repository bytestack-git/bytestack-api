import { createLogger, format, transports } from "winston";
import { TransformableInfo } from "logform";
import DailyRotateFile from "winston-daily-rotate-file";

interface LogMetadata {
  method?: string;
  url?: string;
  status?: number;
  responseTime?: string;
  contentLength?: string;
  body?: Record<string, any>;
  path?: string;
  stack?: string;
}

// Extend TransformableInfo to include metadata
interface CustomLogInfo extends TransformableInfo {
  timestamp?: string;
  level: string;
  message: unknown;
  metadata?: LogMetadata;
}

// Format for file transports
const fileFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json(),
  format.metadata()
);

// Format for console transport
const consoleFormat = format.combine(
  format.colorize(),
  format.metadata(),
  format.printf((info: CustomLogInfo) => {
    const { level, message, metadata = {} } = info;
    const {
      method,
      url,
      status,
      responseTime,
      contentLength,
      body,
      path,
      stack,
    } = metadata;
    let logMessage = `${level}: ${message}`;

    // Add request details for HTTP Request logs
    if (message === "HTTP Request") {
      logMessage += ` ${method || "UNKNOWN"} ${url || "UNKNOWN"} ${status || "UNKNOWN"} - ${responseTime || "0 ms"}`;
      if (contentLength) logMessage += ` (${contentLength} bytes)`;
      if (body && Object.keys(body).length > 0) {
        logMessage += `\n  Body: ${JSON.stringify(body, null, 2)}`;
      }
    }

    // Add error details for error logs
    if (level.includes("error")) {
      logMessage += ` ${path || url || "UNKNOWN"} (${method || "UNKNOWN"})`;
      if (stack) {
        logMessage += `\n  Stack: ${stack}`;
      }
    }

    return logMessage;
  })
);

// Create the winston logger
export const logger = createLogger({
  level: "info",
  transports: [
    // Console transport for development
    new transports.Console({
      format: consoleFormat,
    }),

    // File transport for HTTP requests
    new DailyRotateFile({
      filename: "logs/requests-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "info",
      maxFiles: "7d",
      format: fileFormat,
    }),

    // File transport for errors
    new DailyRotateFile({
      filename: "logs/errors-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "7d",
      format: fileFormat,
    }),

    // Example: Add Datadog transport
    // new DatadogTransport({
    //   apiKey: process.env.DATADOG_API_KEY,
    //   service: "my-app",
    //   tags: { env: process.env.NODE_ENV },
    // }),
  ],
});
