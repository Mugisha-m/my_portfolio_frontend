import { Router } from "express";
import slugify from "slugify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const taxonomyRouter = Router();

const nameSchema = z.object({ name: z.string().min(2).max(80) });

taxonomyRouter.get("/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return res.json({ categories });
});

taxonomyRouter.post("/categories", requireAuth, validateBody(nameSchema), async (req, res) => {
  const category = await prisma.category.create({
    data: { name: req.body.name, slug: slugify(req.body.name, { lower: true, strict: true }) }
  });
  return res.status(201).json({ category });
});

taxonomyRouter.get("/tags", async (_req, res) => {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return res.json({ tags });
});

taxonomyRouter.post("/tags", requireAuth, validateBody(nameSchema), async (req, res) => {
  const tag = await prisma.tag.create({
    data: { name: req.body.name, slug: slugify(req.body.name, { lower: true, strict: true }) }
  });
  return res.status(201).json({ tag });
});
