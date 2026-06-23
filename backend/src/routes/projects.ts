import { Router } from "express";
import slugify from "slugify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const projectsRouter = Router();

const projectSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(10),
  description: z.string().min(10),
  caseStudy: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  githubUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal(""))
});

projectsRouter.get("/", async (_req, res) => {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }]
  });

  return res.json({ projects });
});

projectsRouter.get("/:id", async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { categories: true, tags: true, media: true }
  });

  if (!project || project.status !== "PUBLISHED") {
    return res.status(404).json({ message: "Project not found" });
  }

  await prisma.project.update({ where: { id: req.params.id }, data: { viewCount: { increment: 1 } } });

  return res.json({ project });
});

projectsRouter.get("/admin", requireAuth, async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  return res.json({ projects });
});

projectsRouter.post("/", requireAuth, validateBody(projectSchema), async (req, res) => {
  const slug = slugify(req.body.title, { lower: true, strict: true });
  const project = await prisma.project.create({
    data: {
      ...req.body,
      slug,
      publishedAt: req.body.status === "PUBLISHED" ? new Date() : null
    }
  });

  return res.status(201).json({ project });
});

projectsRouter.put("/:id", requireAuth, validateBody(projectSchema), async (req, res) => {
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      publishedAt: req.body.status === "PUBLISHED" ? new Date() : null
    }
  });

  return res.json({ project });
});

projectsRouter.delete("/:id", requireAuth, async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});

projectsRouter.post("/:id/view", async (req, res) => {
  await prisma.project.update({ where: { id: req.params.id }, data: { viewCount: { increment: 1 } } });
  return res.status(204).send();
});
