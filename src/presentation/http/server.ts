import express, { Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { config } from "../../shared/config";
import { AuthRoutes } from "../routes/auth/auth.route";
import { container } from "tsyringe";

export class Server {
  private _app: Application;
  private port: number | string;

  constructor(port: number | string) {
    this._app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
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

    this._app.use(morgan("combined"));
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
    // this._app.use("/api/v1/auth", new AuthRoutes().router);
    const authRoutes = container.resolve(AuthRoutes);
    this._app.use("/api/v1/auth", authRoutes.router);
  }

  public listen(): void {
    this._app.listen(this.port, () => {
      console.log(`Server running at http://127.0.0.1:${this.port}`);
    });
  }
}
