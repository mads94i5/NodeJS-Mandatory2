import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./scripts/cors.js";
import { endDatabaseConnection } from "./scripts/mysql.js";
import * as rateLimiters from "./scripts/rateLimiters.js";

const app = express();
app.use(helmet())
app.use(cors(corsOptions));
app.use("*", rateLimiters.main);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

const PORT = process.env.API_SERVER_PORT || 8080;
const server = app.listen(PORT, (error) => {
    if (error) {
        console.log("API server failed to start:", error);
        return;
    }
    console.log("API server started at port:", PORT);
}); 

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});

app.on("close", () => {
    console.log("Server is shutting down. Performing cleanup tasks...");
    endDatabaseConnection();
});

process.on("SIGINT", () => {
    console.log("Received SIGINT. Server is shutting down.");
    endDatabaseConnection();
    server.close(() => {
        console.log("Server is now closed.");
        process.exit(0);
    });
});

process.on("SIGTERM", () => {
    console.log("Received SIGTERM. Server is shutting down.");
    endDatabaseConnection();
    server.close(() => {
        console.log("Server is now closed.");
        process.exit(0);
    });
});