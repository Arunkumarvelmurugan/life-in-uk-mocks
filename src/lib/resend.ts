import "server-only";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

// Update once the lifeinukmocks.co.uk domain is verified in Resend.
export const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
export const CONTACT_NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL!;

// Sender for user-facing transactional emails (welcome, payment confirmation,
// renewal reminder) - kept separate from CONTACT_FROM_EMAIL since that one is
// only used for the contact form's internal notification to us, not emails
// sent to users.
export const TRANSACTIONAL_FROM_EMAIL =
  process.env.TRANSACTIONAL_FROM_EMAIL ?? "onboarding@resend.dev";
