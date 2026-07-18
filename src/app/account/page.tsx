import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  LogOut,
  Receipt,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Settings,
  Crown,
  Trophy,
  Download,
} from "lucide-react";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/auth-actions";
import { createBillingPortalSession } from "@/lib/billing-portal-actions";
import { createLifetimeCheckoutSession } from "@/lib/checkout-actions";
import { getUserAccess, getUserDisplayName } from "@/lib/supabase-users";
import { getPaymentHistory } from "@/lib/payments-actions";
import { getAllProgress } from "@/lib/progress-actions";
import { TOTAL_TESTS, QUESTIONS_PER_TEST } from "@/lib/tests";
import { Breadcrumb } from "@/components/breadcrumb";
import { EditNameForm } from "@/components/edit-name-form";
import { ProgressBar } from "@/components/progress-bar";
import { CleanSearchParams } from "@/components/clean-search-params";

// Gated behind sign-in (src/proxy.ts) and disallowed in robots.txt - noindex
// is a page-level belt-and-braces signal in case either of those is ever
// bypassed. This page also shows real names/emails/payment history, so it's
// the last place we'd want a stray indexing accident.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function formatAmount(amountPence: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountPence / 100);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(iso));
}

const PLAN_LABELS = {
  free: "Free plan",
  premium: "Premium",
  lifetime: "Lifetime Access",
} as const;

const PAYMENT_PLAN_LABELS: Record<string, string> = {
  premium: "Premium",
  lifetime: "Lifetime Access",
};

const PAYMENT_STATUS_STYLES: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  paid: { label: "paid", icon: CheckCircle2, className: "bg-success-bg text-success" },
  failed: { label: "failed", icon: XCircle, className: "bg-danger-bg text-danger" },
  refunded: { label: "refunded", icon: RotateCcw, className: "bg-warning-bg text-warning" },
  partially_refunded: {
    label: "partially refunded",
    icon: RotateCcw,
    className: "bg-warning-bg text-warning",
  },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ portal_failed?: string }>;
}) {
  const { portal_failed } = await searchParams;
  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const [access, payments, allProgress, displayName] = await Promise.all([
    getUserAccess(session.user.id),
    getPaymentHistory(),
    getAllProgress(),
    getUserDisplayName(session.user.id),
  ]);

  const completedTests = Object.values(allProgress).filter(
    (p) => Object.keys(p.answers).length === QUESTIONS_PER_TEST
  ).length;

  const initial = (displayName ?? session.user.email ?? "?").charAt(0).toUpperCase();
  // premium_status/period_end can lag the real Stripe state until the
  // subscription.deleted webhook lands - hasAccess is already the
  // defensively re-derived source of truth, so a "premium" plan row with
  // hasAccess false means the subscription has actually lapsed.
  const isActivePremium = access.plan === "premium" && access.hasAccess;
  const isLapsedPremium = access.plan === "premium" && !access.hasAccess;
  const lifetimePurchase = payments.find((p) => p.plan === "lifetime");

  const planVisual = access.plan === "lifetime"
    ? { banner: "bg-gradient-to-r from-primary to-violet-500", iconColor: "text-primary", Icon: Trophy }
    : isActivePremium
      ? { banner: "bg-gradient-to-r from-primary to-violet-500", iconColor: "text-primary", Icon: Crown }
      : isLapsedPremium
        ? { banner: "bg-amber-600", iconColor: "text-amber-600", Icon: AlertTriangle }
        : { banner: "bg-slate-600 dark:bg-slate-700", iconColor: "text-slate-600", Icon: ShieldCheck };

  const planLabel = isLapsedPremium ? "Premium (expired)" : PLAN_LABELS[access.plan];
  const planDescription =
    access.plan === "lifetime"
      ? `All ${TOTAL_TESTS} mock tests unlocked, backed by the Pass Guarantee.`
      : isActivePremium
        ? `All ${TOTAL_TESTS} mock tests unlocked. Pass Guarantee not included.`
        : isLapsedPremium
          ? "Your Premium subscription has ended. Only the free test is unlocked."
          : "Only the free test is unlocked.";

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      {portal_failed === "1" && <CleanSearchParams params={["portal_failed"]} />}
      <Breadcrumb items={[{ label: "My Account" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My Account</h1>
      <p className="mt-2 mb-8 text-muted-foreground">Manage your profile, subscription and test progress.</p>

      {portal_failed === "1" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-warning-bg px-4 py-3 text-sm font-medium text-warning">
          <AlertTriangle size={16} className="shrink-0" />
          We couldn&apos;t open subscription management - please try again, or contact us if it
          keeps happening.
        </div>
      )}

      {/* Profile */}
      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <div className="flex min-w-0 items-center gap-4">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- external Google avatar
            <img
              src={session.user.image}
              alt=""
              referrerPolicy="no-referrer"
              className="h-16 w-16 shrink-0 rounded-full"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              {initial}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <EditNameForm currentName={displayName ?? ""} />
            <p className="mt-1.5 truncate text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Plan status */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-card-border shadow-sm">
        <div className={`flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 ${planVisual.banner}`}>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
              <planVisual.Icon size={22} className={planVisual.iconColor} />
            </span>
            <div>
              <p className="text-lg font-semibold text-white">{planLabel}</p>
              <p className="text-sm text-white/80">{planDescription}</p>
            </div>
          </div>
          {isActivePremium && (
            <form action={createBillingPortalSession}>
              <button
                type="submit"
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <Settings size={14} />
                Manage subscription
              </button>
            </form>
          )}
          {(access.plan === "free" || isLapsedPremium) && (
            <Link
              href="/#pricing"
              className="shrink-0 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              See plans
            </Link>
          )}
        </div>

        <div className="bg-card p-6 sm:p-8">
          {(isActivePremium || isLapsedPremium || access.plan === "lifetime") && (
            <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-card-border pb-6 text-sm">
              {isActivePremium && access.premiumCurrentPeriodEnd && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">
                      {access.premiumCancelAtPeriodEnd ? "Access ends" : "Renews on"}
                    </p>
                    <p className="font-semibold">{formatDate(access.premiumCurrentPeriodEnd)}</p>
                  </div>
                </div>
              )}
              {isLapsedPremium && access.premiumCurrentPeriodEnd && (
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-warning" />
                  <div>
                    <p className="text-muted-foreground">Ended on</p>
                    <p className="font-semibold">{formatDate(access.premiumCurrentPeriodEnd)}</p>
                  </div>
                </div>
              )}
              {access.plan === "lifetime" && lifetimePurchase && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Purchased</p>
                    <p className="font-semibold">{formatDate(lifetimePurchase.createdAt)}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Plan</p>
                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    isLapsedPremium ? "bg-warning-bg text-warning" : "bg-primary/10 text-primary"
                  }`}
                >
                  {planLabel}
                </span>
              </div>
            </div>
          )}

          {isActivePremium && (
            <form action={createLifetimeCheckoutSession} className="mb-6">
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Crown size={14} />
                Upgrade to Lifetime Access - £12.99 one-time, includes the Pass Guarantee
              </button>
            </form>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Mock tests completed</span>
            <span className="font-semibold">
              {completedTests}/{TOTAL_TESTS}
            </span>
          </div>
          <ProgressBar value={completedTests} max={TOTAL_TESTS} variant="primary" className="mt-2" />

          <Link
            href="/mock-tests"
            className="mt-5 flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            View Mock Tests &amp; progress
            <span>→</span>
          </Link>
        </div>
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-card-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Plan</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const statusStyle = PAYMENT_STATUS_STYLES[payment.status] ?? {
                    label: payment.status,
                    icon: CheckCircle2,
                    className: "bg-muted text-muted-foreground",
                  };
                  const StatusIcon = statusStyle.icon;
                  return (
                  <tr key={payment.id} className="border-b border-card-border last:border-0">
                    <td className="py-3 pr-4 font-medium">
                      {payment.plan ? PAYMENT_PLAN_LABELS[payment.plan] : "Payment"}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDate(payment.createdAt)}</td>
                    <td className="py-3 pr-4 font-semibold">{formatAmount(payment.amount, payment.currency)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle.className}`}
                      >
                        <StatusIcon size={12} />
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="py-3">
                      {payment.stripeInvoiceId ? (
                        <Link
                          href={`/api/invoices/${payment.id}`}
                          className="flex w-fit items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40"
                        >
                          <Download size={12} />
                          Download
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
