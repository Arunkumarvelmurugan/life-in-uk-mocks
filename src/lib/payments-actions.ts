import "server-only";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan: "premium" | "lifetime" | null;
  createdAt: string;
  /** Only subscription (Premium) charges have a Stripe invoice on file. */
  stripeInvoiceId: string | null;
}

export async function getPaymentHistory(): Promise<PaymentRecord[]> {
  const session = await auth();
  if (!session?.user) return [];

  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("id, amount, currency, status, plan, created_at, stripe_invoice_id")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    plan: row.plan,
    createdAt: row.created_at,
    stripeInvoiceId: row.stripe_invoice_id,
  }));
}
