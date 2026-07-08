import "server-only";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Shared by both the webhook (durable, authoritative path) and the
 * success-redirect Route Handler (fast path so the UI updates immediately
 * without waiting on webhook delivery). Idempotent — safe to call twice for
 * the same checkout session, e.g. if both paths fire for the same payment.
 */
export async function fulfillCheckoutSession(checkoutSession: Stripe.Checkout.Session) {
  if (checkoutSession.payment_status !== "paid") return;

  const userId = checkoutSession.client_reference_id ?? checkoutSession.metadata?.userId;
  if (!userId) return;

  const { error: paymentError } = await supabaseAdmin.from("payments").upsert(
    {
      user_id: userId,
      stripe_checkout_session_id: checkoutSession.id,
      stripe_payment_intent_id:
        typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : null,
      amount: checkoutSession.amount_total ?? 0,
      currency: checkoutSession.currency ?? "gbp",
      status: "paid",
    },
    { onConflict: "stripe_checkout_session_id", ignoreDuplicates: false }
  );
  if (paymentError) throw new Error(`Failed to record payment: ${paymentError.message}`);

  const { error: userError } = await supabaseAdmin
    .from("users")
    .update({ has_full_access: true, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (userError) throw new Error(`Failed to grant access: ${userError.message}`);
}
