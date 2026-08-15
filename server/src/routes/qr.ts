import { Router } from "express";
import QRCode from "qrcode";
import { verifyToken, AUTH_COOKIE } from "../lib/auth.js";
import { db } from "../db/client.js";
import { products } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const qrRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.[AUTH_COOKIE];
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ error: "Admin access required." });
  }
  next();
}

// GET /api/admin/qr/:handle?format=svg|png
// Fixed per product, never per batch — matches the brief's QR-to-COA
// architecture exactly. The customer picks their lot on the Lab Tests page.
qrRouter.get("/:handle", requireAdmin, async (req, res) => {
  const product = await db.query.products.findFirst({ where: eq(products.handle, req.params.handle) });
  if (!product) return res.status(404).json({ error: "Product not found." });

  const siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
  const targetUrl = `${siteUrl}/lab-tests?product=${product.handle}`;
  const format = req.query.format === "png" ? "png" : "svg";

  try {
    if (format === "png") {
      const buffer = await QRCode.toBuffer(targetUrl, { type: "png", width: 1000, margin: 2 });
      res.setHeader("Content-Type", "image/png");
      if (req.query.download) {
        res.setHeader("Content-Disposition", `attachment; filename="${product.sku}-qr.png"`);
      }
      res.send(buffer);
    } else {
      const svg = await QRCode.toString(targetUrl, { type: "svg", margin: 2 });
      res.setHeader("Content-Type", "image/svg+xml");
      if (req.query.download) {
        res.setHeader("Content-Disposition", `attachment; filename="${product.sku}-qr.svg"`);
      }
      res.send(svg);
    }
  } catch (err) {
    console.error("QR generation failed:", err);
    res.status(500).json({ error: "QR generation failed." });
  }
});
