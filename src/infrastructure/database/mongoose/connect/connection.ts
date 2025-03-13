import mongoose from "mongoose";

export class MongoConnect {
  private _dbUrl: string;

  constructor(dbUrl: string) {
    this._dbUrl = dbUrl;
    this._initializeEventListeners();
  }

  async connectDB() {
    try {
      await mongoose.connect(this._dbUrl);
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }

  private _initializeEventListeners() {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    mongoose.connection.on("close", () => {
      console.log("MongoDB connection closed");
    });
  }
}
