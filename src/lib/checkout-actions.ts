"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { stripe, STRIPE_PRICE_PREMIUM, STRIPE_PRICE_LIFETIME, type Plan } from "@/lib/stripe";
import { getUserAccess } from "@/lib/supabase-users";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function createCheckoutSessionForTier(tier: Extract<Plan, "premium" | "lifetime">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const access = await getUserAccess(session.user.id);

  // Lifetime access is permanent - nothing left to sell them.
  if (access.plan === "lifetime") {
    redirect("/practice/mock-tests");
  }
  // Already an active Premium subscriber buying Premium again would create
  // a second subscription - send them to manage the one they have instead.
  if (access.plan === "premium" && access.hasAccess && tier === "premium") {
    redirect("/account");
  }

  const origin = await getOrigin();

  const checkoutSession = await stripe.checkout.sessions.create(
    tier === "lifetime"
      ? {
          mode: "payment",
          client_reference_id: session.user.id,
          customer_email: session.user.email ?? undefined,
          metadata: { userId: session.user.id, plan: "lifetime" },
          line_items: [{ price: STRIPE_PRICE_LIFETIME, quantity: 1 }],
          success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/#pricing`,
        }
      : {
          mode: "subscription",
          client_reference_id: session.user.id,
          // Reuse the existing Stripe Customer if this user has subscribed
          // before (e.g. resubscribing after a cancellation) rather than
          // creating a duplicate Customer record.
          customer: access.stripeCustomerId ?? undefined,
          customer_email: access.stripeCustomerId ? undefined : (session.user.email ?? undefined),
          metadata: { userId: session.user.id, plan: "premium" },
          subscription_data: { metadata: { userId: session.user.id } },
          line_items: [{ price: STRIPE_PRICE_PREMIUM, quantity: 1 }],
          success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/#pricing`,
        }
  );

  if (!checkoutSession.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  redirect(checkoutSession.url);
}

export async function createPremiumCheckoutSession() {
  await createCheckoutSessionForTier("premium");
}

export async function createLifetimeCheckoutSession() {
  await createCheckoutSessionForTier("lifetime");
}
