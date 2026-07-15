"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { getUserAccess } from "@/lib/supabase-users";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Sends a Premium subscriber to Stripe's hosted Customer Portal to cancel,
 * update their payment method, or view invoices - no custom billing UI
 * needed. Requires the portal to be configured in the Stripe Dashboard
 * (Settings > Billing > Customer portal) for the relevant mode.
 */
export async function createBillingPortalSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const access = await getUserAccess(session.user.id);
  if (!access.stripeCustomerId) {
    redirect("/account");
  }

  const origin = await getOrigin();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: access.stripeCustomerId,
    return_url: `${origin}/api/billing-portal/complete`,
  });

  redirect(portalSession.url);
}
