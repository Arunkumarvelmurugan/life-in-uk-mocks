import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Redirects to the Stripe-hosted PDF for a payment's invoice. Scoped to the
 * signed-in user's own payments so a payment id can't be replayed against
 * someone else's invoice.
 */
export async function GET(req: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  const { origin } = new URL(req.url);
  const { paymentId } = await params;

  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/?signin=required", origin));
  }

  const { data } = await supabaseAdmin
    .from("payments")
    .select("stripe_invoice_id")
    .eq("id", paymentId)
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!data?.stripe_invoice_id) {
    return NextResponse.redirect(new URL("/account", origin));
  }

  const invoice = await stripe.invoices.retrieve(data.stripe_invoice_id);
  if (!invoice.invoice_pdf) {
    return NextResponse.redirect(new URL("/account", origin));
  }

  return NextResponse.redirect(invoice.invoice_pdf);
}
