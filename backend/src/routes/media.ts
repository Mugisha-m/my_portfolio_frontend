import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { uploadBuffer } from "../services/cloudinary.js";

export const mediaRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    cb(null, allowed.includes(file.mimetype));
  }
});

mediaRouter.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const result = await uploadBuffer(req.file.buffer, "portfolio");
  const media = await prisma.media.create({
    data: {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      resourceType: result.resource_type === "image" ? "IMAGE" : result.resource_type === "video" ? "VIDEO" : "DOCUMENT",
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height
    }
  });

  return res.status(201).json({ media });
});

mediaRouter.patch("/:id/alt", requireAuth, validateBody(z.object({ alt: z.string().max(180) })), async (req, res) => {
  const media = await prisma.media.update({ where: { id: req.params.id }, data: { alt: req.body.alt } });
  return res.json({ media });
});

mediaRouter.get("/", requireAuth, async (_req, res) => {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return res.json({ media });
});
