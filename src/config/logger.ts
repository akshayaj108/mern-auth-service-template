import winston from "winston";
// import { CONFIG } from './index.js';

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: "auth-service",
  },
  transports: [
    new winston.transports.File({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      dirname: "logs",
      filename: "app.log",
    }),
    new winston.transports.File({
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      dirname: "logs",
      filename: "app.error.log",
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      // silent: CONFIG.NODE_ENV === 'test',
    }),
  ],
});

export default logger;

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// };
