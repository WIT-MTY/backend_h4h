import { transporter } from "../config/mailer.js";
import { templates } from "../types/EmailTemplates.js";

type TemplateName = keyof typeof templates;

interface SendEmailArgs<T extends TemplateName> {
  to: string;
  subject: string;
  templateName: T;
  receiverData: Parameters<(typeof templates)[T]>[0]; // ensures data matches the specific template
}

export const sendEmailFromTemplate = async <T extends TemplateName>({
  to,
  subject,
  templateName,
  receiverData,
}: SendEmailArgs<T>) => {
  const templateFn = templates[templateName] as (data: any) => {
    html: string;
    text: string;
  };
  const { html, text } = templateFn(receiverData);

  const info = await transporter.sendMail({
    from: `WIT "Hack4Her" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};
