import "reflect-metadata";
import { MongoConnect } from "../infrastructure/database/mongoose/connect/connection";
import { Server } from "../presentation/http/server";
import { config } from "../shared/config/config";
import { initializeRedis } from "../infrastructure/database/redis/init";
import { RedisConnect } from "../infrastructure/database/redis/connect/connection";

const startServer = async () => {
  await initializeRedis();

  const database = new MongoConnect(config.database.URI);
  await database.connectDB();

  await import("../infrastructure/di/container");

  const server = new Server(config.server.PORT);
  server.listen();

  const shutdown = async () => {
    console.log("Shutting down server...");
    try {
      await RedisConnect.disconnectRedis();
      await MongoConnect.disconnectDB();
      console.log("All connections closed successfully.");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer();
