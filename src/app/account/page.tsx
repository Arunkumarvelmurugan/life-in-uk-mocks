import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, LogOut, Receipt, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/auth-actions";
import { createCheckoutSession } from "@/lib/checkout-actions";
import { getUserHasFullAccess, getUserDisplayName } from "@/lib/supabase-users";
import { getPaymentHistory } from "@/lib/payments-actions";
import { getAllProgress } from "@/lib/progress-actions";
import { TOTAL_TESTS, QUESTIONS_PER_TEST } from "@/lib/tests";
import { Breadcrumb } from "@/components/breadcrumb";
import { EditNameForm } from "@/components/edit-name-form";

function formatAmount(amountPence: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountPence / 100);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(iso));
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const [hasFullAccess, payments, allProgress, displayName] = await Promise.all([
    getUserHasFullAccess(session.user.id),
    getPaymentHistory(),
    getAllProgress(),
    getUserDisplayName(session.user.id),
  ]);

  const completedTests = Object.values(allProgress).filter(
    (p) => Object.keys(p.answers).length === QUESTIONS_PER_TEST
  ).length;

  const initial = (displayName ?? session.user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <Breadcrumb items={[{ label: "My Account" }]} />
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">My Account</h1>

      {/* Profile */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Google avatar
          <img
            src={session.user.image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            {initial}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <EditNameForm currentName={displayName ?? ""} />
          <p className="mt-3 truncate text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      {/* Plan status */}
      <div className="mb-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className={hasFullAccess ? "text-success" : "text-muted-foreground"} />
            <div>
              <p className="font-semibold">{hasFullAccess ? "Full Access" : "Free plan"}</p>
              <p className="text-sm text-muted-foreground">
                {hasFullAccess
                  ? "All 17 mock tests unlocked, backed by the Pass Guarantee."
                  : "Only the free test is unlocked."}
              </p>
            </div>
          </div>
          {!hasFullAccess && (
            <form action={createCheckoutSession}>
              <button
                type="submit"
                className="shrink-0 cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Get Full Access
              </button>
            </form>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm">
          <span className="text-muted-foreground">Mock tests completed</span>
          <span className="font-semibold">
            {completedTests}/{TOTAL_TESTS}
          </span>
        </div>
        <Link
          href="/practice/mock-tests"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          View Mock Tests &amp; progress →
        </Link>
      </div>

      {/* Payment history */}
      <div className="mb-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Receipt size={18} className="text-primary" />
          <h2 className="font-semibold">Payment history</h2>
        </div>

        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-3 border-b border-card-border pb-3 text-sm last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">Full Access</p>
                  <p className="text-muted-foreground">{formatDate(payment.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatAmount(payment.amount, payment.currency)}</span>
                  <span className="flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-xs font-medium text-success">
                    <CheckCircle2 size={12} />
                    {payment.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sign out */}
      <form action={signOutAction}>
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-card-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </form>
    </div>
  );
}
