import app from "./app";
import { CONFIG } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected successfully.");
    app.listen(CONFIG.PORT, () => {
      logger.info(`Server started on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
