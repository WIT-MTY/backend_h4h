import { transporter } from "../config/mailer.js";
import type { EmailOptions } from "../types/EmailOptions.js";

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
/*
¡Hola hacker!
En WIT (Women in Technology) estamos muy emocionadas de que quieras sumarte a esta edición de Hack4Her. Nos encanta conectar con personas que, como tú, quieren dejar huella en el mundo de la tecnología.

Para dar el siguiente paso y activar tu cuenta, por favor confirma tu correo haciendo clic en el siguiente enlace:

[Confirmar mi registro en Hack4Her]
Follow this link to confirm your user: {{link_de_confirmación}}

Te invitamos a estar muy pendiente de tu cuenta en nuestra página oficial de Hack4Her, ya que será nuestro canal principal de comunicación. A través de ella:
Te notificaremos oficialmente sobre la aceptación de tu participación.
Recibirás las indicaciones detalladas para el evento.

¡No te despegues de la plataforma para no perderte ningún aviso importante! 




*/
