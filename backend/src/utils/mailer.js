import nodemailer from "nodemailer";

const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

export async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    console.warn(`SMTP is not configured. Email for ${to} was not sent.`);
    return false;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
  return true;
}

export function appUrl(path) {
  return `${(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}${path}`;
}