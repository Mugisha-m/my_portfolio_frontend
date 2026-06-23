import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });

  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: "8h" });

  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

authRouter.post("/logout", requireAuth, async (_req, res) => {
  return res.json({ message: "Logged out. Discard the JWT on the client." });
});
