import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

import { wsRouter } from "./routers/ws.js";
import authRouter from "./routers/auth.routers.js";
import beFriendRouter from "./routers/befriend.routers.js";

const app = express();
const prisma = new PrismaClient();
const __dirname = path.resolve();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

expressWs(app);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", wsRouter);
app.use("/auth", authRouter);
app.use("/befriend", beFriendRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send(
    "Welcome to the BeFriend Social Network API. Please use the /auth and /befriend routes."
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server is closed");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
