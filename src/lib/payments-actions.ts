import "server-only";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export async function getPaymentHistory(): Promise<PaymentRecord[]> {
  const session = await auth();
  if (!session?.user) return [];

  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("id, amount, currency, status, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
  }));
}
