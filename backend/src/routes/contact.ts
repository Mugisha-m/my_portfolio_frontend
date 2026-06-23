import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { sendContactNotification } from "../services/email.js";
import { config } from "../config.js";

export const contactRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5
});

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(140),
  message: z.string().min(10).max(5000),
  recaptchaToken: z.string().optional()
});

contactRouter.post("/", contactLimiter, validateBody(contactSchema), async (req, res) => {
  if (config.recaptchaSecret) {
    const params = new URLSearchParams({
      secret: config.recaptchaSecret,
      response: req.body.recaptchaToken ?? ""
    });
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: params
    });
    const verification = await response.json();

    if (!verification.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });

  try { await sendContactNotification(req.body); } catch { /* email is optional */ }

  return res.status(201).json({ message: "Contact message received", id: message.id });
});

contactRouter.get("/", requireAuth, async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return res.json({ messages });
});

contactRouter.patch("/:id/status", requireAuth, validateBody(z.object({
  status: z.enum(["UNREAD", "READ", "REPLIED", "ARCHIVED", "DELETED"])
})), async (req, res) => {
  const message = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { status: req.body.status }
  });

  return res.json({ message });
});
