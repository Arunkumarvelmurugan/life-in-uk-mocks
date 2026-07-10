import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { fulfillCheckoutSession } from "@/lib/stripe-fulfillment";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/#pricing", origin));
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/?signin=required", origin));
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  // Only fulfil if this checkout session actually belongs to the signed-in
  // user - stops someone else's session_id being replayed against your account.
  if (checkoutSession.client_reference_id === session.user.id) {
    await fulfillCheckoutSession(checkoutSession);
  }

  return NextResponse.redirect(new URL("/practice/mock-tests?purchase=success", origin));
}
