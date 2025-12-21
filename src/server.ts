import app from "./app";
import { CONFIG } from "./config";
import logger from "./config/logger";

const startServer = () => {
  try {
    app.listen(CONFIG.PORT, () => {
      logger.info(`Server started on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
