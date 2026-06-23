import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 4001),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET ?? "development-secret",
  githubUsername: process.env.GITHUB_USERNAME ?? "Mugisha-m",
  recaptchaSecret: process.env.RECAPTCHA_SECRET || undefined,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.CONTACT_TO_EMAIL
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};
