import "server-only";
import { resend, TRANSACTIONAL_FROM_EMAIL } from "@/lib/resend";
import { TOTAL_TESTS, QUESTIONS_PER_TEST } from "@/lib/tests";

const APP_NAME = "Life in UK Mocks";
const BRAND_COLOR = "#4f46e5";
const FROM = `${APP_NAME} <${TRANSACTIONAL_FROM_EMAIL}>`;

function siteUrl(path: string) {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

// display_name is free-text set by the user (src/lib/account-actions.ts) and
// gets interpolated into raw HTML here, unlike JSX which auto-escapes - must
// encode it manually before it reaches the template.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
              <td style="background:${BRAND_COLOR};padding:20px 32px;">
                <img
                  src="${siteUrl("/email-logo.png")}"
                  alt="${APP_NAME}"
                  width="176"
                  height="32"
                  style="display:block;width:176px;height:32px;border:0;"
                />
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

/** Plain-text fallback link shown under a button, for clients that strip styled buttons. */
function fallbackLink(href: string) {
  return `
    <p style="margin:16px 0 0;font-size:13px;color:#64748b;">
      If the button doesn't work, visit:<br />
      <a href="${href}" style="color:${BRAND_COLOR};word-break:break-all;">${href}</a>
    </p>
  `;
}

export async function sendWelcomeEmail({ email, name }: { email: string; name?: string | null }) {
  const firstName = name?.split(" ")[0] ? escapeHtml(name.split(" ")[0]) : undefined;
  const mockTestsUrl = siteUrl("/mock-tests");
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Welcome to ${APP_NAME}! 🎉`,
      html: emailShell(
        `Your account is ready - Mock Test 1 is unlocked and waiting for you.`,
        `
          <p style="margin:0 0 16px;">Hi${firstName ? ` ${firstName}` : ""},</p>
          <p style="margin:0 0 16px;">Thanks for creating your account.</p>
          <p style="margin:0 0 16px;">
            Your account is ready, and Mock Test 1 has already been unlocked for you -
            completely free.
          </p>
          <p style="margin:0 0 8px;">Every mock test includes:</p>
          <ul style="margin:0 0 16px;padding-left:20px;">
            <li style="margin-bottom:4px;">${QUESTIONS_PER_TEST} timed questions like the official test</li>
            <li style="margin-bottom:4px;">Instant results</li>
            <li style="margin-bottom:4px;">Plain-English explanations for every answer</li>
            <li>Memory tips to help you remember key facts</li>
          </ul>
          <p style="margin:0 0 16px;">Ready to begin?</p>
          ${button("Take Your Free Mock Test", mockTestsUrl)}
          ${fallbackLink(mockTestsUrl)}
          <p style="margin:24px 0 16px;">
            Need help? Simply reply to this email or contact us at
            <a href="mailto:support@lifeinukmocks.co.uk" style="color:${BRAND_COLOR};">support@lifeinukmocks.co.uk</a>.
          </p>
          <p style="margin:0 0 4px;">Good luck with your preparation!</p>
          <p style="margin:0;">The ${APP_NAME} Team</p>
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
  premium: "Premium (Renews every 30 days)",
  lifetime: "Lifetime Access",
} as const;

const PLAN_TITLES = {
  premium: "Premium",
  lifetime: "Lifetime Access",
} as const;

const PLAN_INTROS = {
  premium: "your Life in UK Mocks Premium subscription is now active",
  lifetime: "you now have Life in UK Mocks Lifetime Access",
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
  const firstName = name?.split(" ")[0] ? escapeHtml(name.split(" ")[0]) : undefined;
  const amount = formatAmount(amountPence, currency);
  const detailsHeading = plan === "premium" ? "Subscription Details" : "Purchase Details";
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Payment Successful - Welcome to ${APP_NAME} ${PLAN_TITLES[plan]} 🎉`,
      html: emailShell(
        `Payment received: ${amount} for ${PLAN_LABELS[plan]}.`,
        `
          <p style="margin:0 0 16px;">Hi${firstName ? ` ${firstName}` : ""},</p>
          <p style="margin:0 0 16px;">
            Thank you for your purchase! Your payment has been received successfully, and
            ${PLAN_INTROS[plan]}.
          </p>
          <p style="margin:0 0 8px;font-weight:600;">${detailsHeading}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:#f8fafc;border-radius:8px;">
            <tr>
              <td style="padding:16px;font-size:14px;color:#475569;">Plan</td>
              <td style="padding:16px;font-size:14px;color:#0f172a;font-weight:600;text-align:right;">${PLAN_LABELS[plan]}</td>
            </tr>
            <tr>
              <td style="padding:0 16px 16px;font-size:14px;color:#475569;">Amount Paid</td>
              <td style="padding:0 16px 16px;font-size:14px;color:#0f172a;font-weight:600;text-align:right;">${amount}</td>
            </tr>
            <tr>
              <td style="padding:0 16px 16px;font-size:14px;color:#475569;">Status</td>
              <td style="padding:0 16px 16px;font-size:14px;color:#16a34a;font-weight:600;text-align:right;">✅ Active</td>
            </tr>
          </table>
          <p style="margin:0 0 16px;">
            All ${TOTAL_TESTS} mock tests are unlocked and ready whenever you are.
          </p>
          ${button("Go to Mock Tests", siteUrl("/mock-tests"))}
          <p style="margin:24px 0 16px;">
            Need help? Simply reply to this email or contact us at
            <a href="mailto:support@lifeinukmocks.co.uk" style="color:${BRAND_COLOR};">support@lifeinukmocks.co.uk</a>.
          </p>
          <p style="margin:0 0 4px;">Thank you for choosing ${APP_NAME}.</p>
          <p style="margin:0;">- The ${APP_NAME} Team</p>
        `
      ),
    });
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
  }
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(iso));
}

export async function sendRenewalReminderEmail({
  email,
  name,
  renewalDate,
  amountPence,
  currency,
}: {
  email: string;
  name?: string | null;
  renewalDate: string;
  amountPence: number;
  currency: string;
}) {
  const firstName = name?.split(" ")[0] ? escapeHtml(name.split(" ")[0]) : undefined;
  const amount = formatAmount(amountPence, currency);
  const date = formatDate(renewalDate);
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your Premium subscription renews on ${date}`,
      html: emailShell(
        `Renewing on ${date} for ${amount} - charged automatically, no action needed.`,
        `
          <p style="margin:0 0 16px;">Hi${firstName ? ` ${firstName}` : ""},</p>
          <p style="margin:0 0 16px;">
            This is a friendly reminder that your ${APP_NAME} Premium subscription will renew
            on <strong>${date}</strong>.
          </p>
          <p style="margin:0 0 16px;">
            On that date, we'll automatically charge ${amount} to your saved payment method,
            so you can continue enjoying uninterrupted access to all Premium features.
          </p>
          <p style="margin:0 0 8px;">Your Premium subscription includes:</p>
          <ul style="margin:0 0 16px;padding-left:20px;list-style:none;">
            <li style="margin-bottom:4px;">✅ Access to all ${TOTAL_TESTS} mock tests</li>
            <li style="margin-bottom:4px;">✅ Instant results and detailed explanations</li>
            <li style="margin-bottom:4px;">✅ Memory tips for every question</li>
            <li>✅ Unlimited practice until you're ready for the official test</li>
          </ul>
          <p style="margin:0 0 16px;">
            If you're happy with your subscription, there's nothing you need to do.
          </p>
          <p style="margin:0 0 16px;">
            If you'd like to update your payment method, change your plan, or cancel before
            your renewal date, you can manage your subscription at any time from your account.
          </p>
          ${button("Manage Subscription", siteUrl("/account"))}
          <p style="margin:24px 0 16px;">
            Need help? Simply reply to this email or contact us at
            <a href="mailto:support@lifeinukmocks.co.uk" style="color:${BRAND_COLOR};">support@lifeinukmocks.co.uk</a>.
          </p>
          <p style="margin:0 0 4px;">Thank you for choosing ${APP_NAME}.</p>
          <p style="margin:0;">- The ${APP_NAME} Team</p>
        `
      ),
    });
  } catch (error) {
    console.error("Failed to send renewal reminder email:", error);
  }
}
