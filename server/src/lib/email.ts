import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@astraeavitamins.com";

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendContactNotification(opts: { name: string; email: string; message: string }) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — contact message saved to DB but not emailed.");
    return false;
  }
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL ?? fromEmail;
  try {
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: opts.email,
      subject: `New contact form message from ${opts.name}`,
      text: `From: ${opts.name} <${opts.email}>\n\n${opts.message}`,
    });
    return true;
  } catch (err) {
    console.error("Resend send failed:", err);
    return false;
  }
}
