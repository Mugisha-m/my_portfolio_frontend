import "dotenv/config";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { prisma } from "./db.js";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Albert Mugisha",
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN"
    }
  });

  const projects = [
    {
      title: "Hometutors",
      summary: "A platform for connecting learners with home tutors.",
      description: "A web platform for connecting learners with home tutors, focused on discoverability, responsive design, and a clear booking flow.",
      demoUrl: "https://hometeachers.netlify.app/",
      coverImage: "/images/hometutors.png",
      featured: true
    },
    {
      title: "Birthday Wishes Platform",
      summary: "A lightweight platform for sharing birthday wishes.",
      description: "A celebration platform for creating and sharing birthday wishes through a polished public web experience.",
      demoUrl: "https://tetaday.netlify.app/",
      coverImage: "/images/birthday-wishes.png",
      featured: true
    },
    {
      title: "Chatbot",
      summary: "A chatbot project demonstrating API integration.",
      description: "A chatbot project that demonstrates API integration, conversational flow handling, and clean repository organization.",
      githubUrl: "https://github.com/Mugisha-m/chatbot",
      featured: false
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: slugify(project.title, { lower: true, strict: true }) },
      update: project,
      create: {
        ...project,
        slug: slugify(project.title, { lower: true, strict: true }),
        status: "PUBLISHED",
        publishedAt: new Date()
      }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
