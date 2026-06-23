import { createHash } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const analyticsRouter = Router();

analyticsRouter.post("/track", validateBody(z.object({
  path: z.string().min(1),
  event: z.string().min(1).default("page_view"),
  country: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
})), async (req, res) => {
  const ipHash = req.ip ? createHash("sha256").update(req.ip).digest("hex") : undefined;
  await prisma.visitorAnalytics.create({ data: { ...req.body, metadata: req.body.metadata as object | undefined, ipHash } });
  return res.status(204).send();
});

analyticsRouter.get("/summary", requireAuth, async (_req, res) => {
  const [visits, contactSubmissions, projectViews, blogViews, resumeDownloads] = await Promise.all([
    prisma.visitorAnalytics.count(),
    prisma.contactMessage.count(),
    prisma.project.aggregate({ _sum: { viewCount: true } }),
    prisma.blog.aggregate({ _sum: { viewCount: true } }),
    prisma.resume.aggregate({ _sum: { downloadCount: true } })
  ]);

  return res.json({
    visits,
    contactSubmissions,
    projectViews: projectViews._sum.viewCount ?? 0,
    blogViews: blogViews._sum.viewCount ?? 0,
    resumeDownloads: resumeDownloads._sum.downloadCount ?? 0
  });
});
