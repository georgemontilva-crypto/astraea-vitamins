import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router/index.js";
import { createContext } from "./trpc.js";
import { uploadRouter } from "./routes/upload.js";
import { qrRouter } from "./routes/qr.js";
import { legacyRedirects } from "./lib/redirects.js";
import { stagingGate, robotsTxt, gateEnabled } from "./lib/staging-gate.js";
import { db } from "./db/client.js";
import { products } from "./db/schema.js";
import { eq } from "drizzle-orm";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cookieParser());

// Before every route, API included: an unauthenticated tRPC call would
// otherwise hand out the whole pre-launch catalog.
app.use(stagingGate);

app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
app.use("/api/upload", uploadRouter);
app.use("/api/admin/qr", qrRouter);

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.get("/robots.txt", robotsTxt);

// 301s must run before the static handler and the SPA fallback, otherwise the
// SPA answers 200 for every path and no redirect ever fires.
app.use(legacyRedirects);

// Serve built client (production)
const clientDist = path.resolve(__dirname, "../../client-dist");
app.use(express.static(clientDist));

/**
 * A printed URL that does not exist must say so. The SPA fallback answers 200
 * for any path, so a mistyped or retired /lab/<handle> would have returned a
 * page reading "Lab results will publish here at launch" — reassuring, wrong,
 * and indistinguishable from a real product awaiting its first lot. Checking
 * the handle lets the status code tell the truth (404) while the client still
 * renders a proper not-found view.
 */
app.get("*", async (req, res) => {
  const labMatch = req.path.match(/^\/lab\/([a-z0-9-]+)\/?$/i);
  if (labMatch) {
    const found = await db.query.products.findFirst({
      where: eq(products.handle, labMatch[1].toLowerCase()),
      columns: { id: true },
    });
    if (!found) {
      return res.status(404).sendFile(path.join(clientDist, "index.html"));
    }
  }
  res.sendFile(path.join(clientDist, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(
    `Astraea server listening on :${port}` +
      (gateEnabled ? " — staging gate ON" : " — staging gate OFF (STAGING_PASSWORD unset)")
  )
);
