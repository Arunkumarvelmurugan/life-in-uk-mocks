import "server-only";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

// Update once the lifeinukmocks.co.uk domain is verified in Resend.
export const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
export const CONTACT_NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL!;
