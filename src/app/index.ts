import { MongoConnect } from "../infrastructure/database/mongoose/connect/connection";
import { Server } from "../presentation/http/server";
import { config } from "../shared/config";

const server = new Server(config.server.PORT);
const database = new MongoConnect(config.database.URI);

server.listen();
database.connectDB(); 
