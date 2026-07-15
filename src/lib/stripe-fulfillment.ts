import "server-only";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

const ACCESS_GRANTING_STATUSES = ["active", "trialing", "past_due"];

function resolveUserId(obj: {
  client_reference_id?: string | null;
  metadata?: Stripe.Metadata | null;
}) {
  return obj.client_reference_id ?? obj.metadata?.userId ?? null;
}

async function findUserIdBySubscriptionId(subscriptionId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.id ?? null;
}

/**
 * current_period_end lives on the subscription's item (a subscription can
 * have multiple items with independent billing periods), not on the
 * subscription itself. Ours only ever has one item.
 */
function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): number {
  return subscription.items.data[0].current_period_end;
}

/** The subscription that generated an invoice now lives under `invoice.parent`. */
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | undefined {
  const subscriptionDetails = invoice.parent?.subscription_details;
  const subscription = subscriptionDetails?.subscription;
  return typeof subscription === "string" ? subscription : subscription?.id;
}

/**
 * Writes a Stripe Subscription's current state onto the user row. Shared by
 * every path that learns about subscription state (initial checkout,
 * renewal invoices, and subscription-lifecycle webhooks) so they can't
 * drift out of sync with each other.
 */
async function applySubscriptionToUser(userId: string, subscription: Stripe.Subscription) {
  const currentPeriodEnd = new Date(getSubscriptionPeriodEnd(subscription) * 1000).toISOString();
  const hasAccess = ACCESS_GRANTING_STATUSES.includes(subscription.status);
  // The Billing Portal's cancel action sets `cancel_at` (and
  // cancellation_details) but does not reliably flip the `cancel_at_period_end`
  // boolean in this API version, so `cancel_at !== null` is the accurate signal.
  const isCancelingAtPeriodEnd = subscription.cancel_at_period_end || subscription.cancel_at !== null;

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      plan: "premium",
      has_full_access: hasAccess,
      premium_status: subscription.status,
      premium_current_period_end: currentPeriodEnd,
      premium_cancel_at_period_end: isCancelingAtPeriodEnd,
      stripe_customer_id:
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      stripe_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw new Error(`Failed to sync subscription state: ${error.message}`);
}

/**
 * Shared by both the webhook (durable, authoritative path) and the
 * success-redirect Route Handler (fast path so the UI updates immediately
 * without waiting on webhook delivery). Idempotent - safe to call twice for
 * the same checkout session, e.g. if both paths fire for the same payment.
 */
export async function fulfillCheckoutSession(checkoutSession: Stripe.Checkout.Session) {
  const userId = resolveUserId(checkoutSession);
  if (!userId) return;

  if (checkoutSession.mode === "payment") {
    if (checkoutSession.payment_status !== "paid") return;

    const invoiceField = checkoutSession.invoice;
    const invoiceId = typeof invoiceField === "string" ? invoiceField : (invoiceField?.id ?? null);

    const { error: paymentError } = await supabaseAdmin.from("payments").upsert(
      {
        user_id: userId,
        plan: "lifetime",
        stripe_checkout_session_id: checkoutSession.id,
        stripe_payment_intent_id:
          typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : null,
        stripe_invoice_id: invoiceId,
        amount: checkoutSession.amount_total ?? 0,
        currency: checkoutSession.currency ?? "gbp",
        status: "paid",
      },
      { onConflict: "stripe_checkout_session_id", ignoreDuplicates: false }
    );
    if (paymentError) throw new Error(`Failed to record payment: ${paymentError.message}`);

    // If they were an active Premium subscriber, upgrading to Lifetime
    // cancels the subscription so they aren't charged again.
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("stripe_subscription_id")
      .eq("id", userId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (existing?.stripe_subscription_id) {
      await stripe.subscriptions.cancel(existing.stripe_subscription_id).catch(() => {
        // Already canceled/expired on Stripe's side - nothing to do.
      });
    }

    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({
        plan: "lifetime",
        has_full_access: true,
        premium_status: null,
        premium_current_period_end: null,
        premium_cancel_at_period_end: false,
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (userError) throw new Error(`Failed to grant access: ${userError.message}`);
    return;
  }

  // mode === "subscription" - the Premium tier's initial checkout.
  if (checkoutSession.payment_status !== "paid") return;

  const subscriptionField = checkoutSession.subscription;
  const subscription =
    typeof subscriptionField === "object" && subscriptionField !== null
      ? subscriptionField
      : await stripe.subscriptions.retrieve(subscriptionField as string);

  const invoiceField = checkoutSession.invoice;
  const invoiceId = typeof invoiceField === "string" ? invoiceField : (invoiceField?.id ?? null);

  const { error: paymentError } = await supabaseAdmin.from("payments").upsert(
    {
      user_id: userId,
      plan: "premium",
      stripe_invoice_id: invoiceId,
      stripe_subscription_id: subscription.id,
      amount: checkoutSession.amount_total ?? 0,
      currency: checkoutSession.currency ?? "gbp",
      status: "paid",
    },
    { onConflict: "stripe_invoice_id", ignoreDuplicates: false }
  );
  if (paymentError) throw new Error(`Failed to record payment: ${paymentError.message}`);

  await applySubscriptionToUser(userId, subscription);
}

/** `invoice.paid` - covers both the first subscription charge and renewals. */
export async function fulfillInvoicePayment(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return; // not a subscription invoice - nothing to do

  const userId = await findUserIdBySubscriptionId(subscriptionId);
  if (!userId) return;

  const { error: paymentError } = await supabaseAdmin.from("payments").upsert(
    {
      user_id: userId,
      plan: "premium",
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount: invoice.amount_paid ?? 0,
      currency: invoice.currency ?? "gbp",
      status: "paid",
    },
    { onConflict: "stripe_invoice_id", ignoreDuplicates: false }
  );
  if (paymentError) throw new Error(`Failed to record payment: ${paymentError.message}`);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await applySubscriptionToUser(userId, subscription);
}

/** `invoice.payment_failed` - Stripe is retrying; access is kept during the retry window. */
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const userId = await findUserIdBySubscriptionId(subscriptionId);
  if (!userId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await applySubscriptionToUser(userId, subscription);
}

/** `customer.subscription.updated` - status/period-end/cancel-flag changes mid-lifecycle. */
export async function syncSubscriptionState(subscription: Stripe.Subscription) {
  const userId =
    subscription.metadata?.userId ?? (await findUserIdBySubscriptionId(subscription.id));
  if (!userId) return;

  await applySubscriptionToUser(userId, subscription);
}

/** `customer.subscription.deleted` - the subscription has fully ended. */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId =
    subscription.metadata?.userId ?? (await findUserIdBySubscriptionId(subscription.id));
  if (!userId) return;

  // Guard against downgrading a user who has since bought Lifetime -
  // shouldn't happen since upgrading cancels the subscription, but a
  // canceled-subscription webhook could still arrive after that.
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);
  if (existing?.plan === "lifetime") return;

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      plan: "free",
      has_full_access: false,
      premium_status: subscription.status,
      premium_current_period_end: null,
      premium_cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw new Error(`Failed to downgrade user: ${error.message}`);
}
