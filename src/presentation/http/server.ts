import express, { Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { config } from "../../shared/config";

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
    this._app.use(express.json());

    this._app.use(
      cors({
        origin: config.cors.ALLOWED_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
      })
    );

    this._app.use(cookieParser());

    this._app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
      })
    );
  }

  private initializeRoutes(): void {
    this._app;
  }

  public listen(): void {
    this._app.listen(this.port, () => {
      console.log(`Server running at http://127.0.0.1:${this.port}`);
    });
  }
}
