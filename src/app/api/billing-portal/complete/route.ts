import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { syncSubscriptionState } from "@/lib/stripe-fulfillment";

/**
 * Stripe's Billing Portal return_url points here instead of straight to
 * /account. Portal actions (cancel, resume, payment method changes) are
 * only otherwise reflected once the async webhook arrives, which can lag
 * behind the redirect - this mirrors the checkout fast-path so the account
 * page is correct the instant the user lands back on it.
 */
export async function GET(req: Request) {
  const { origin } = new URL(req.url);

  const session = await auth();
  if (session?.user) {
    const { data } = await supabaseAdmin
      .from("users")
      .select("stripe_subscription_id")
      .eq("id", session.user.id)
      .maybeSingle();

    if (data?.stripe_subscription_id) {
      const subscription = await stripe.subscriptions.retrieve(data.stripe_subscription_id);
      await syncSubscriptionState(subscription);
    }
  }

  return NextResponse.redirect(new URL("/account", origin));
}
