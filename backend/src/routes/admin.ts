import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.get("/dashboard", requireAuth, async (_req, res) => {
  const [projects, blogs, messages, testimonials, resumes, media, visits] = await Promise.all([
    prisma.project.count(),
    prisma.blog.count(),
    prisma.contactMessage.count(),
    prisma.testimonial.count(),
    prisma.resume.count(),
    prisma.media.count(),
    prisma.visitorAnalytics.count()
  ]);

  return res.json({
    totals: { projects, blogs, messages, testimonials, resumes, media, visits }
  });
});
