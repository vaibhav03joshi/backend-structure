import express, { ErrorRequestHandler } from "express";
import { env } from "./config/env";
import { authRoute } from "./routes/authRoutes";

const app = express();

const corsOrigins = new Set(env.CORS_ORIGINS.split(",").map((origin) => origin.trim()));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.vary("Origin");
  if (origin && corsOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server is running"
  });
});

const PORT = env.PORT;

app.use("/api/auth", authRoute);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error.status ?? 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    success: false,
    message: status < 500 ? "Invalid request" : "Internal server error",
  });
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});