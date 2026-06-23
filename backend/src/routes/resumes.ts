import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const resumesRouter = Router();

const resumeSchema = z.object({
  title: z.string().min(2),
  fileUrl: z.string().url(),
  cloudinaryId: z.string().optional(),
  version: z.string().min(1),
  active: z.boolean().default(false)
});

resumesRouter.get("/active", async (_req, res) => {
  const resume = await prisma.resume.findFirst({ where: { active: true }, orderBy: { createdAt: "desc" } });
  return res.json({ resume });
});

resumesRouter.get("/", requireAuth, async (_req, res) => {
  const resumes = await prisma.resume.findMany({ orderBy: { createdAt: "desc" } });
  return res.json({ resumes });
});

resumesRouter.post("/", requireAuth, validateBody(resumeSchema), async (req, res) => {
  if (req.body.active) {
    await prisma.resume.updateMany({ data: { active: false } });
  }

  const resume = await prisma.resume.create({ data: req.body });
  return res.status(201).json({ resume });
});

resumesRouter.patch("/:id/download", async (req, res) => {
  const resume = await prisma.resume.update({
    where: { id: req.params.id },
    data: { downloadCount: { increment: 1 } }
  });

  return res.json({ fileUrl: resume.fileUrl });
});
