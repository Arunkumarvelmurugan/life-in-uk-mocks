import { NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_PREMIUM } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendRenewalReminderEmail } from "@/lib/transactional-emails";

const REMINDER_DAYS_BEFORE = 3;

/**
 * Triggered daily by Vercel Cron (see vercel.json). Finds active Premium
 * subscribers whose renewal falls in exactly REMINDER_DAYS_BEFORE days and
 * who haven't already been emailed for this specific renewal date, then
 * sends a reminder. premium_renewal_reminder_sent_for stores the period end
 * the reminder was sent for, so it naturally resets itself each time the
 * subscription renews - no separate cleanup needed.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const windowStart = new Date(Date.now() + REMINDER_DAYS_BEFORE * 24 * 60 * 60 * 1000);
  const windowEnd = new Date(windowStart.getTime() + 24 * 60 * 60 * 1000);

  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name, display_name, premium_current_period_end, premium_renewal_reminder_sent_for")
    .eq("plan", "premium")
    .eq("premium_cancel_at_period_end", false)
    .in("premium_status", ["active", "trialing"])
    .gte("premium_current_period_end", windowStart.toISOString())
    .lt("premium_current_period_end", windowEnd.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const toRemind = (users ?? []).filter(
    (u) => u.premium_renewal_reminder_sent_for !== u.premium_current_period_end
  );

  if (toRemind.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const price = await stripe.prices.retrieve(STRIPE_PRICE_PREMIUM);
  const amountPence = price.unit_amount ?? 0;
  const currency = price.currency;

  let sent = 0;
  for (const user of toRemind) {
    if (!user.email || !user.premium_current_period_end) continue;

    await sendRenewalReminderEmail({
      email: user.email,
      name: user.display_name ?? user.name,
      renewalDate: user.premium_current_period_end,
      amountPence,
      currency,
    });

    await supabaseAdmin
      .from("users")
      .update({ premium_renewal_reminder_sent_for: user.premium_current_period_end })
      .eq("id", user.id);

    sent += 1;
  }

  return NextResponse.json({ sent });
}
