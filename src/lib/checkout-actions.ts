"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { stripe, FULL_ACCESS_PRICE_GBP_PENCE } from "@/lib/stripe";
import { getUserHasFullAccess } from "@/lib/supabase-users";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function createCheckoutSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const hasFullAccess = await getUserHasFullAccess(session.user.id);
  if (hasFullAccess) {
    redirect("/practice/mock-tests");
  }

  const origin = await getOrigin();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: session.user.id,
    customer_email: session.user.email ?? undefined,
    metadata: { userId: session.user.id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: FULL_ACCESS_PRICE_GBP_PENCE,
          product_data: {
            name: "Life in UK Mocks — Full Access",
            description: "All 17 mock tests, unlimited retakes, and the Pass Guarantee.",
          },
        },
      },
    ],
    success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#pricing`,
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  redirect(checkoutSession.url);
}
