import express, { Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { config } from "../../shared/config/config";
import { AuthRoutes } from "../routes/auth/auth.route";
import { container } from "tsyringe";
import { requestLogger } from "../../shared/middlewares/request-logger.middleware";
import { errorHandler } from "../middleware/error.middleware";
import { UserRoutes } from "../routes/users/user.route";

export class Server {
  private _app: Application;
  private port: number;

  constructor(port: number) {
    this._app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandler();
  }

  private initializeMiddlewares(): void {
    this._app.use(
      cors({
        origin: config.cors.ALLOWED_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
      })
    );

    this._app.use(requestLogger);
    this._app.use(cookieParser());
    this._app.use(express.json());

    this._app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
      })
    );
  }

  private initializeRoutes(): void {
    const authRoutes = container.resolve(AuthRoutes);
    const userRoutes = container.resolve(UserRoutes);
    this._app.use("/api/v1/auth", authRoutes.router);
    this._app.use("/api/v1/users", userRoutes.router);
  }

  private initializeErrorHandler(): void {
    this._app.use(errorHandler as express.ErrorRequestHandler);
  }

  public listen(): void {
    this._app.listen(this.port, () => {
      console.log(`Server running at http://127.0.0.1:${this.port}`);
    });
  }
}
