import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const testimonialsRouter = Router();

const testimonialSchema = z.object({
  reviewerName: z.string().min(2),
  reviewerTitle: z.string().optional(),
  reviewerImage: z.string().url().optional().or(z.literal("")),
  feedback: z.string().min(10),
  published: z.boolean().default(false)
});

testimonialsRouter.get("/", async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  });
  return res.json({ testimonials });
});

testimonialsRouter.get("/admin", requireAuth, async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { updatedAt: "desc" } });
  return res.json({ testimonials });
});

testimonialsRouter.post("/", requireAuth, validateBody(testimonialSchema), async (req, res) => {
  const testimonial = await prisma.testimonial.create({ data: req.body });
  return res.status(201).json({ testimonial });
});

testimonialsRouter.put("/:id", requireAuth, validateBody(testimonialSchema), async (req, res) => {
  const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
  return res.json({ testimonial });
});

testimonialsRouter.delete("/:id", requireAuth, async (req, res) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
