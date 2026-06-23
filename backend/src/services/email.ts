import nodemailer from "nodemailer";
import { config } from "../config.js";

export async function sendContactNotification(input: { name: string; email: string; subject: string; message: string }) {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass || !config.smtp.to) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });

  await transporter.sendMail({
    from: config.smtp.user,
    to: config.smtp.to,
    replyTo: input.email,
    subject: `Portfolio contact: ${input.subject}`,
    text: `${input.name} (${input.email}) wrote:\n\n${input.message}`
  });
}
