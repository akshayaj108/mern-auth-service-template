import winston from "winston";
import { CONFIG } from ".";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: "auth-service",
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
  transports: [
    new winston.transports.File({
      level: "info",
      silent: CONFIG.NODE_ENV === "test",
      dirname: "logs",
      filename: "app.log",
    }),
    new winston.transports.File({
      level: "error",
      silent: CONFIG.NODE_ENV === "test",
      dirname: "logs",
      filename: "app.error.log",
    }),
    new winston.transports.Console({
      level: "info",
      silent: CONFIG.NODE_ENV === "test",
    }),
  ],
});

export default logger;
