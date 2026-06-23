import { Router } from "express";
import { prisma } from "../db.js";
import { config } from "../config.js";

export const githubRouter = Router();

githubRouter.get("/summary", async (_req, res) => {
  const key = `github:${config.githubUsername}:summary`;
  const cached = await prisma.gitHubCache.findUnique({ where: { key } });

  if (cached && cached.expiresAt > new Date()) {
    return res.json({ source: "cache", data: cached.payload });
  }

  const response = await fetch(`https://api.github.com/users/${config.githubUsername}/repos?sort=updated&per_page=12`);
  if (!response.ok) {
    return res.status(502).json({ message: "GitHub API request failed" });
  }

  const repos = await response.json();
  const payload = {
    username: config.githubUsername,
    repos: repos.map((repo: { name: string; html_url: string; language: string | null; stargazers_count: number; updated_at: string }) => ({
      name: repo.name,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at
    }))
  };

  await prisma.gitHubCache.upsert({
    where: { key },
    update: { payload, expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
    create: { key, payload, expiresAt: new Date(Date.now() + 1000 * 60 * 60) }
  });

  return res.json({ source: "github", data: payload });
});
