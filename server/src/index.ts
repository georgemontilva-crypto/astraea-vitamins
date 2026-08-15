import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router/index.js";
import { createContext } from "./trpc.js";
import { uploadRouter } from "./routes/upload.js";
import { qrRouter } from "./routes/qr.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cookieParser());
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
app.use("/api/upload", uploadRouter);
app.use("/api/admin/qr", qrRouter);

app.get("/healthz", (_req, res) => res.json({ ok: true }));

// Serve built client (production)
const clientDist = path.resolve(__dirname, "../../client-dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Astraea server listening on :${port}`));
