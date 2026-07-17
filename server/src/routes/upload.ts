import { Router } from "express";
import multer from "multer";
import { verifyToken, AUTH_COOKIE } from "../lib/auth.js";
import { uploadToR2 } from "../lib/r2.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB — comfortably covers COA PDFs and product photos
});

export const uploadRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.[AUTH_COOKIE];
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ error: "Admin access required." });
  }
  next();
}

// POST /api/upload?folder=products|coa/<handle>|site
// multipart/form-data, field name "file"
uploadRouter.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided." });

    const folder = String(req.query.folder ?? "misc").replace(/^\/+|\/+$/g, "");
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${folder}/${Date.now()}-${safeName}`;

    const url = await uploadToR2(key, req.file.buffer, req.file.mimetype);
    res.json({ url, key });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed." });
  }
});
