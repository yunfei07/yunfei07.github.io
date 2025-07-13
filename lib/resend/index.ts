import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  email: string,
  subject: string,
  template: JSX.Element,
) {
  const { data, error } = await resend.emails.send({
    from: `Fei <cole@mail.yunfei07.github.io>`,
    to: [email],
    subject: subject,
    react: template,
  });

  return { data, error };
}
