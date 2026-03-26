import nodemailer from "nodemailer";

// Define the transport configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.resend.com or smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  const info = await transporter.sendMail({
    from: `"Your App Name" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};
