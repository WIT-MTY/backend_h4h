import { Request, Response, Router } from "express";
import { sendEmail } from "../config/mailer";

const router = Router();

router.post("/contact", async (req: Request, res: Response) => {
  const { email, message } = req.body;

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to our Service!",
      html: `<b>Hello!</b><p>${message}</p>`,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("SMTP Error:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

export default router;
