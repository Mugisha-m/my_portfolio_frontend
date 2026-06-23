import { Router } from "express";
import slugify from "slugify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const blogsRouter = Router();

const blogSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  coverImage: z.string().url().optional().or(z.literal("")),
  externalUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  scheduledFor: z.string().datetime().optional()
});

blogsRouter.get("/admin", requireAuth, async (_req, res) => {
  const blogs = await prisma.blog.findMany({ orderBy: { updatedAt: "desc" } });
  return res.json({ blogs });
});

blogsRouter.get("/", async (_req, res) => {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" }
  });

  return res.json({ blogs });
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await prisma.blog.findUnique({
    where: { id: req.params.id },
    include: { categories: true, tags: true }
  });

  if (!blog || blog.status !== "PUBLISHED") {
    return res.status(404).json({ message: "Blog not found" });
  }

  await prisma.blog.update({ where: { id: req.params.id }, data: { viewCount: { increment: 1 } } });

  return res.json({ blog });
});

blogsRouter.post("/", requireAuth, validateBody(blogSchema), async (req, res) => {
  const blog = await prisma.blog.create({
    data: {
      ...req.body,
      slug: slugify(req.body.title, { lower: true, strict: true }),
      scheduledFor: req.body.scheduledFor ? new Date(req.body.scheduledFor) : null,
      publishedAt: req.body.status === "PUBLISHED" ? new Date() : null
    }
  });

  return res.status(201).json({ blog });
});

blogsRouter.put("/:id", requireAuth, validateBody(blogSchema), async (req, res) => {
  const blog = await prisma.blog.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      scheduledFor: req.body.scheduledFor ? new Date(req.body.scheduledFor) : null,
      publishedAt: req.body.status === "PUBLISHED" ? new Date() : null
    }
  });

  return res.json({ blog });
});

blogsRouter.delete("/:id", requireAuth, async (req, res) => {
  await prisma.blog.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
