import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { blogsRouter } from "./routes/blogs.js";
import { contactRouter } from "./routes/contact.js";
import { mediaRouter } from "./routes/media.js";
import { adminRouter } from "./routes/admin.js";
import { analyticsRouter } from "./routes/analytics.js";
import { githubRouter } from "./routes/github.js";
import { resumesRouter } from "./routes/resumes.js";
import { testimonialsRouter } from "./routes/testimonials.js";
import { taxonomyRouter } from "./routes/taxonomy.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "portfolio-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/media", mediaRouter);
app.use("/api/admin", adminRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/github", githubRouter);
app.use("/api/resumes", resumesRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/taxonomy", taxonomyRouter);

app.listen(config.port, () => {
  console.log(`Portfolio API running on http://localhost:${config.port}`);
});
