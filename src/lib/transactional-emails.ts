import "server-only";
import { resend, CONTACT_FROM_EMAIL } from "@/lib/resend";
import { TOTAL_TESTS, QUESTIONS_PER_TEST } from "@/lib/tests";

const APP_NAME = "Life in UK Mocks";
const BRAND_COLOR = "#4f46e5";
const FROM = `${APP_NAME} <${CONTACT_FROM_EMAIL}>`;

function siteUrl(path: string) {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

function emailShell(preheader: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;font-size:1px;color:#f8fafc;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:${BRAND_COLOR};padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:800;">${APP_NAME}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#0f172a;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
          <p style="color:#94a3b8;font-size:12px;margin-top:16px;">
            ${APP_NAME} - Independent practice resource, not affiliated with the UK government.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;font-weight:600;border-radius:8px;font-size:14px;">${label}</a>`;
}

export async function sendWelcomeEmail({ email, name }: { email: string; name?: string | null }) {
  const firstName = name?.split(" ")[0];
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Welcome to ${APP_NAME}!`,
      html: emailShell(
        `Your account is ready - start practicing for the Life in the UK test.`,
        `
          <p style="margin:0 0 16px;">Hi${firstName ? ` ${firstName}` : ""},</p>
          <p style="margin:0 0 16px;">
            Welcome to ${APP_NAME}! Your account is set up, and Test 1 is unlocked and
            ready to go - no payment needed to get started.
          </p>
          <p style="margin:0 0 16px;">
            Each mock test has ${QUESTIONS_PER_TEST} timed questions with instant feedback
            and a plain-English explanation for every answer, plus memory tips to help
            facts actually stick.
          </p>
          ${button("Start your first mock test", siteUrl("/practice/mock-tests"))}
        `
      ),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

function formatAmount(amountPence: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountPence / 100);
}

const PLAN_LABELS = {
  premium: "Premium (renews every 30 days)",
  lifetime: "Lifetime Access",
} as const;

export async function sendPaymentConfirmationEmail({
  email,
  name,
  plan,
  amountPence,
  currency,
}: {
  email: string;
  name?: string | null;
  plan: "premium" | "lifetime";
  amountPence: number;
  currency: string;
}) {
  const firstName = name?.split(" ")[0];
  const amount = formatAmount(amountPence, currency);
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Payment confirmed - ${PLAN_LABELS[plan]}`,
      html: emailShell(
        `Payment received: ${amount} for ${PLAN_LABELS[plan]}.`,
        `
          <p style="margin:0 0 16px;">Hi${firstName ? ` ${firstName}` : ""},</p>
          <p style="margin:0 0 16px;">
            Thanks for your payment - here's your confirmation.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:#f8fafc;border-radius:8px;">
            <tr>
              <td style="padding:16px;font-size:14px;color:#475569;">Plan</td>
              <td style="padding:16px;font-size:14px;color:#0f172a;font-weight:600;text-align:right;">${PLAN_LABELS[plan]}</td>
            </tr>
            <tr>
              <td style="padding:0 16px 16px;font-size:14px;color:#475569;">Amount</td>
              <td style="padding:0 16px 16px;font-size:14px;color:#0f172a;font-weight:600;text-align:right;">${amount}</td>
            </tr>
          </table>
          <p style="margin:0 0 16px;">
            All ${TOTAL_TESTS} mock tests are unlocked and ready whenever you are.
          </p>
          ${button("Go to Mock Tests", siteUrl("/practice/mock-tests"))}
        `
      ),
    });
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
  }
}
