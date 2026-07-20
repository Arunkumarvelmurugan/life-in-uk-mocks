import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  BookOpenCheck,
  Lock,
  Brain,
  Star,
  Zap,
  GraduationCap,
  ArrowRight,
  Calendar,
  Target,
  Sparkles,
  Award,
  Lightbulb,
  Trophy,
  Settings,
  AlertTriangle,
  Tag,
  Gift,
  Gem,
  Crown,
} from "lucide-react";
import { TOTAL_TESTS, QUESTIONS_PER_TEST, FREE_TEST_ID } from "@/lib/tests";
import { auth } from "@/auth";
import { signInWithGoogle } from "@/lib/auth-actions";
import { getUserAccess, getUserDisplayName } from "@/lib/supabase-users";
import { createPremiumCheckoutSession, createLifetimeCheckoutSession } from "@/lib/checkout-actions";
import { createBillingPortalSession } from "@/lib/billing-portal-actions";
import { getPaymentHistory } from "@/lib/payments-actions";
import { GoogleIcon } from "@/components/google-icon";
import { getAllProgress } from "@/lib/progress-actions";
import { ProgressBar } from "@/components/progress-bar";
import { CleanSearchParams } from "@/components/clean-search-params";
import { DemoQuestionCard } from "@/components/demo-question-card";
import {
  isLaunchOfferActive,
  REGULAR_PRICE_PREMIUM_GBP,
  REGULAR_PRICE_LIFETIME_GBP,
  LAUNCH_PRICE_PREMIUM_GBP,
  LAUNCH_PRICE_LIFETIME_GBP,
} from "@/lib/pricing";

const features = [
  {
    icon: BookOpenCheck,
    title: `${TOTAL_TESTS} full mock tests`,
    description: `${TOTAL_TESTS} exam-style mock tests covering every topic in the official handbook.`,
  },
  {
    icon: CheckCircle2,
    title: "Instant feedback",
    description: "Know immediately why an answer is right or wrong.",
  },
  {
    icon: BarChart3,
    title: "Clear explanations",
    description:
      "Simple explanations for every answer - including why the other options are incorrect.",
  },
  {
    icon: ShieldCheck,
    title: "Pass guarantee",
    description: "Lifetime Access includes our 100% Pass Guarantee.",
  },
  {
    icon: Brain,
    title: "Memory Tips & Quick Memory Rules",
    description: "Memory Tips and Quick Memory Rules that help difficult facts stick.",
    href: "/memory-tips",
  },
];

const guaranteeConditions = [
  "Have Lifetime Access (the Pass Guarantee isn't included with Premium).",
  `Complete all ${TOTAL_TESTS} mock tests.`,
  "Achieve a score of 75% or higher on each mock test.",
  "Take your official Life in the UK Test within 60 days of completing the mock tests.",
];

const eligibilityRules = [
  "The email address used to register your learning account must be the same as the email address on your official Life in the UK Test result.",
  "The name on your learning account must exactly match the name on your official test result.",
];

function formatGbp(amount: number) {
  return `£${amount.toFixed(2)}`;
}

function getPlans(launchOfferActive: boolean) {
  return [
  {
    id: "free" as const,
    name: "Free",
    price: "£0",
    originalPrice: null,
    period: "",
    description: "Try the format before you commit.",
    features: ["Test 1 unlocked", "Instant feedback", "Full explanations"],
    cta: "Start free test",
  },
  {
    id: "premium" as const,
    name: "Premium",
    badge: "Most Popular",
    price: formatGbp(launchOfferActive ? LAUNCH_PRICE_PREMIUM_GBP : REGULAR_PRICE_PREMIUM_GBP),
    originalPrice: launchOfferActive ? formatGbp(REGULAR_PRICE_PREMIUM_GBP) : null,
    period: "for 30 days",
    description: "Full access, renews automatically.",
    features: [
      `All ${TOTAL_TESTS} mock tests`,
      "Progress tracking across every test",
      "Unlimited retakes",
      "Auto-renews every 30 days - cancel anytime",
    ],
    cta: "Get Premium",
  },
  {
    id: "lifetime" as const,
    name: "Lifetime Access",
    price: formatGbp(launchOfferActive ? LAUNCH_PRICE_LIFETIME_GBP : REGULAR_PRICE_LIFETIME_GBP),
    originalPrice: launchOfferActive ? formatGbp(REGULAR_PRICE_LIFETIME_GBP) : null,
    period: "one-time",
    description: "Pay once, keep access forever.",
    features: [
      `All ${TOTAL_TESTS} mock tests`,
      "Progress tracking across every test",
      "Unlimited retakes",
      "Pass guarantee - money back if you fail",
    ],
    cta: "Get Lifetime Access",
  },
  ];
}

const PLAN_VISUALS = {
  free: {
    Icon: Gift,
    iconClasses: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  premium: {
    Icon: Gem,
    iconClasses: "bg-primary/10 text-primary",
  },
  lifetime: {
    Icon: Crown,
    iconClasses: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
} as const;

function formatPurchaseDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ signin?: string; upgrade?: string; checkout_failed?: string }>;
}) {
  const { signin, upgrade, checkout_failed } = await searchParams;
  const session = await auth();
  const isSignedIn = !!session?.user;
  const access = isSignedIn ? await getUserAccess(session.user.id) : null;
  const hasFullAccess = access?.hasAccess ?? false;
  const freeTestHref = isSignedIn ? "/mock-tests" : `/mock-tests/${FREE_TEST_ID}`;
  const heroCtaLabel = hasFullAccess ? "Go to Mock Tests" : "Start practicing free";
  const launchOfferActive = isLaunchOfferActive();
  const plans = getPlans(launchOfferActive);
  const currentPremiumPrice = launchOfferActive ? LAUNCH_PRICE_PREMIUM_GBP : REGULAR_PRICE_PREMIUM_GBP;
  const currentLifetimePrice = launchOfferActive ? LAUNCH_PRICE_LIFETIME_GBP : REGULAR_PRICE_LIFETIME_GBP;

  let membership: {
    plan: "premium" | "lifetime";
    displayName: string | null;
    purchasedAt: string | null;
    passedTests: number;
    nextTestId: number | null;
    premiumCurrentPeriodEnd: string | null;
    premiumCancelAtPeriodEnd: boolean;
  } | null = null;

  if (hasFullAccess && access && (access.plan === "premium" || access.plan === "lifetime") && session?.user) {
    const [displayName, payments, allProgress] = await Promise.all([
      getUserDisplayName(session.user.id),
      getPaymentHistory(),
      getAllProgress(),
    ]);

    const PASS_THRESHOLD_SCORE = Math.ceil(QUESTIONS_PER_TEST * 0.75);
    const passedTests = Object.values(allProgress).filter(
      (p) => (p.score ?? 0) >= PASS_THRESHOLD_SCORE
    ).length;

    let nextTestId: number | null = null;
    for (let id = 1; id <= TOTAL_TESTS; id++) {
      const done = allProgress[id] ? Object.keys(allProgress[id].answers).length : 0;
      if (done < QUESTIONS_PER_TEST) {
        nextTestId = id;
        break;
      }
    }

    const purchasedAt = payments.length > 0 ? payments[payments.length - 1].createdAt : null;

    membership = {
      plan: access.plan,
      displayName,
      purchasedAt,
      passedTests,
      nextTestId,
      premiumCurrentPeriodEnd: access.premiumCurrentPeriodEnd,
      premiumCancelAtPeriodEnd: access.premiumCancelAtPeriodEnd,
    };
  }

  return (
    <div>
      {(signin === "required" || upgrade === "required" || checkout_failed === "1") && (
        <CleanSearchParams params={["signin", "upgrade", "checkout_failed"]} />
      )}
      {signin === "required" && !isSignedIn && (
        <div className="border-b border-primary/10 bg-primary/5 px-6 py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lock size={18} />
              </span>
              <div>
                <p className="font-semibold">Sign in with Google</p>
                <p className="text-sm text-muted-foreground">
                  Unlock all features and get the best experience.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium">Save your progress</p>
                  <p className="text-xs text-muted-foreground">Pick up where you left off</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BarChart3 size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium">Track your scores</p>
                  <p className="text-xs text-muted-foreground">See how you improve</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Lock size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium">Unlock all mock tests</p>
                  <p className="text-xs text-muted-foreground">Access all {TOTAL_TESTS} mock tests</p>
                </div>
              </div>
            </div>

            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                  <GoogleIcon />
                </span>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      )}
      {upgrade === "required" && !hasFullAccess && (
        <div className="flex items-center justify-center gap-2 bg-primary px-6 py-2.5 text-center text-sm font-medium text-primary-foreground">
          <Lock size={15} />
          Upgrade to unlock all {TOTAL_TESTS} mock tests.
        </div>
      )}
      {checkout_failed === "1" && (
        <div className="flex items-center justify-center gap-2 bg-warning px-6 py-2.5 text-center text-sm font-medium text-white">
          <AlertTriangle size={15} />
          We couldn&apos;t start checkout - please try again, or contact us if it keeps happening.
        </div>
      )}
      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-8 pt-10 text-center">
        <span className="mb-4 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          100% Pass Guarantee
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Pass the Life in the UK test, <span className="text-primary">first time.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Practice with realistic mock tests, detailed explanations, Memory Tips, and Quick
          Memory Rules that help you remember the right answers - not just memorise them.
        </p>
        <p className="mt-3 text-sm font-medium text-primary">
          No lengthy study guides. No unnecessary reading. Just realistic mock tests until
          you&apos;re ready to pass.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {isSignedIn ? (
            <Link
              href={freeTestHref}
              className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              {heroCtaLabel}
            </Link>
          ) : (
            // The feature banner above already has its own "Continue with
            // Google" CTA when signin=required - a second identical button
            // right below it would be a duplicate, not reinforcement.
            signin !== "required" && (
              <form action={signInWithGoogle}>
                <button
                  type="submit"
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>
            )
          )}
          {!hasFullAccess && (
            <Link
              href="#pricing"
              className="rounded-lg border border-card-border px-6 py-3 font-medium hover:bg-muted"
            >
              See pricing
            </Link>
          )}
          {!isSignedIn && signin !== "required" && (
            <p className="w-full text-center text-xs text-muted-foreground">
              Free &bull; No credit card required
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-4">
        <h2 className="sr-only">Key features</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f) => {
            const cardClassName =
              "rounded-xl border border-card-border bg-card p-6 shadow-sm" +
              (f.href ? " transition-colors hover:border-primary/50" : "");
            const content = (
              <>
                <div className="mb-1.5 flex items-center gap-2">
                  <f.icon className="shrink-0 text-primary" size={22} />
                  <h3 className="font-semibold">{f.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </>
            );
            return f.href ? (
              <Link key={f.title} href={f.href} className={cardClassName}>
                {content}
              </Link>
            ) : (
              <div key={f.title} className={cardClassName}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo question - only for visitors who haven't bought Full Access yet */}
      {!hasFullAccess && (
        <section className="border-t border-card-border bg-muted">
          <div className="mx-auto max-w-4xl px-6 pt-14 pb-8">
            <div className="mb-6 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Star size={12} />
                Try one question for free
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                See How We Help You Remember, Not Just Memorise
              </h2>
              <p className="mt-3 text-muted-foreground">
                Answer this real exam-style question to see our unique memory technique in action.
              </p>
            </div>

            <DemoQuestionCard />

            <div className="mt-6 flex flex-col items-center justify-between gap-5 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap size={22} />
                </span>
                <div>
                  <p className="font-semibold">This is just one sample question.</p>
                  <p className="text-sm text-muted-foreground">
                    Unlock all {TOTAL_TESTS} mock tests, hundreds of explanations and Memory Tips.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1.5">
                <Link
                  href={freeTestHref}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                >
                  Start Your First Mock Test
                  <ArrowRight size={16} />
                </Link>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck size={12} />
                  From {formatGbp(currentPremiumPrice)} · Pass Guarantee with Lifetime Access
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing / Membership */}
      <section id="pricing" className={`mx-auto max-w-5xl px-6 ${hasFullAccess ? "py-10" : "pt-10 pb-10"}`}>
        {hasFullAccess && membership ? (
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-violet-500/10 to-primary/5 p-8 sm:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
              <div className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 lg:mx-0">
                {membership.plan === "lifetime" ? (
                  <Trophy size={56} className="text-primary" />
                ) : (
                  <Zap size={56} className="text-primary" />
                )}
              </div>

              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  <CheckCircle2 size={14} />
                  {membership.plan === "lifetime" ? "Lifetime Member" : "Premium Member"}
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Welcome back{membership.displayName ? `, ${membership.displayName.split(" ")[0]}` : ""}{" "}
                  👋
                </h2>
                <p className="mt-2 text-muted-foreground">
                  You have{" "}
                  <span className="font-semibold text-primary">
                    {membership.plan === "lifetime" ? "Lifetime Access" : "Premium Access"}
                  </span>{" "}
                  to all {TOTAL_TESTS} mock tests.
                </p>
                {membership.plan === "lifetime" && membership.purchasedAt && (
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground lg:justify-start">
                    <Calendar size={14} />
                    Purchased {formatPurchaseDate(membership.purchasedAt)}
                  </p>
                )}
                {membership.plan === "premium" && (
                  <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center lg:justify-start">
                    {membership.premiumCurrentPeriodEnd && (
                      <p
                        className={
                          membership.premiumCancelAtPeriodEnd
                            ? "flex items-center gap-1.5 text-sm text-warning"
                            : "flex items-center gap-1.5 text-sm text-muted-foreground"
                        }
                      >
                        {membership.premiumCancelAtPeriodEnd ? (
                          <AlertTriangle size={14} />
                        ) : (
                          <Calendar size={14} />
                        )}
                        {membership.premiumCancelAtPeriodEnd
                          ? `Subscription canceled - you'll keep access until ${formatPurchaseDate(membership.premiumCurrentPeriodEnd)}`
                          : `Renews ${formatPurchaseDate(membership.premiumCurrentPeriodEnd)}`}
                      </p>
                    )}
                    <form action={createBillingPortalSession}>
                      <button
                        type="submit"
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/40"
                      >
                        <Settings size={14} />
                        Manage subscription
                      </button>
                    </form>
                  </div>
                )}

                <div className="mt-6 rounded-xl bg-card p-4 text-left shadow-sm">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-muted-foreground">
                      {membership.passedTests}/{TOTAL_TESTS} tests
                    </span>
                  </div>
                  <ProgressBar value={membership.passedTests} max={TOTAL_TESTS} variant="success" />
                </div>

                {membership.nextTestId ? (
                  <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl bg-primary/10 p-5 sm:flex-row">
                    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                        <Target size={22} />
                      </span>
                      <div>
                        <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary sm:justify-start">
                          <Sparkles size={12} />
                          Next recommended test
                        </p>
                        <p className="text-lg font-semibold">Life in the UK Test {membership.nextTestId}</p>
                        <p className="text-sm text-muted-foreground">
                          {membership.nextTestId === FREE_TEST_ID
                            ? "Start where most learners begin."
                            : "Pick up where you left off."}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/mock-tests/${membership.nextTestId}`}
                      className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                    >
                      Continue
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl bg-primary/10 p-5 sm:flex-row">
                    <p className="text-sm font-medium text-success">
                      You&apos;ve completed all {TOTAL_TESTS} mock tests! 🎉
                    </p>
                    <Link
                      href="/mock-tests"
                      className="shrink-0 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                    >
                      Review Mock Tests
                    </Link>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-primary/10 pt-4 text-sm text-muted-foreground lg:justify-start">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-primary" />
                    {membership.plan === "lifetime" ? "Lifetime Access" : "Pass Guarantee not included"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award size={16} className="text-primary" />
                    All {TOTAL_TESTS} Mock Tests
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 size={16} className="text-primary" />
                    Track Progress
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lightbulb size={16} className="text-primary" />
                    Smart Learning
                  </span>
                </div>
              </div>
            </div>

            {membership.plan === "premium" && (
              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-card p-6 shadow-sm sm:flex-row">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Crown size={22} />
                  </span>
                  <div>
                    <p className="font-semibold">Want the Pass Guarantee, and to stop worrying about renewals?</p>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Lifetime Access for a one-time {formatGbp(currentLifetimePrice)} - your Premium subscription
                      is cancelled automatically.
                    </p>
                  </div>
                </div>
                <form action={createLifetimeCheckoutSession}>
                  <button
                    type="submit"
                    className="shrink-0 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Get Lifetime Access
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : !hasFullAccess ? (
          <>
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <Tag size={14} />
                Find the plan that fits your journey
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Choose{" "}
                <span className="relative inline-block">
                  your plan
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full text-primary/40"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 9C40 2 100 2 198 9"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Try it free, subscribe for a month, or pay once and keep access forever.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {plans.map((plan) => {
                const { Icon, iconClasses } = PLAN_VISUALS[plan.id];
                return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-8 shadow-sm ${
                    plan.badge ? "border-primary shadow-md" : "border-card-border bg-card"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-violet-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-sm">
                      <Star size={12} className="fill-current" />
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClasses}`}>
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  {plan.id === "lifetime" && (
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <ShieldCheck size={12} />
                      Includes Pass Guarantee
                    </span>
                  )}
                  {plan.originalPrice && (
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
                      <Tag size={12} />
                      Launch offer
                    </span>
                  )}
                  <p className={`flex items-baseline gap-1.5 ${plan.originalPrice ? "mt-1.5" : "mt-5"}`}>
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                    )}
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </p>
                  <ul className="mt-6 flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.id === "premium" ? (
                    <form action={createPremiumCheckoutSession}>
                      <button
                        type="submit"
                        className="mt-8 block w-full cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground hover:opacity-90"
                      >
                        {plan.cta}
                      </button>
                    </form>
                  ) : plan.id === "lifetime" ? (
                    <form action={createLifetimeCheckoutSession}>
                      <button
                        type="submit"
                        className="mt-8 block w-full cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground hover:opacity-90"
                      >
                        {plan.cta}
                      </button>
                    </form>
                  ) : (
                    <Link
                      href={freeTestHref}
                      className="mt-8 block rounded-lg border border-card-border px-5 py-2.5 text-center font-medium hover:bg-muted"
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
                );
              })}
            </div>
          </>
        ) : null}
      </section>

      {/* Guarantee */}
      <section id="guarantee" className="border-t border-card-border bg-muted">
        <div className="mx-auto max-w-3xl px-6 pt-10 pb-20">
          <div className="text-center">
            <ShieldCheck className="mx-auto mb-4 text-primary" size={36} />
            <h2 className="text-3xl font-extrabold tracking-tight">
              Our <span className="text-primary">100%</span> Pass Guarantee
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              We&apos;re confident our course will help you pass the Life in the UK Test. If you
              don&apos;t, you get a 100% refund of your Lifetime Access payment.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-card-border bg-card p-8 shadow-sm">
            <p className="font-semibold">To qualify for our Pass Guarantee, you must:</p>
            <ul className="mt-4 flex flex-col gap-3">
              {guaranteeConditions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              If you meet these conditions and still don&apos;t pass, simply send us your official
              Life in the UK Test result email or result letter, and we&apos;ll refund your
              Lifetime Access payment in full.
            </p>
            <p className="mt-3 text-sm font-medium">
              No hidden terms. No small-print surprises. Just a genuine safety net.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-card-border bg-card p-8 shadow-sm">
            <h3 className="font-semibold">Eligibility</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              To verify your eligibility for the Pass Guarantee, the details on your learning
              account must match your official test result:
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {eligibilityRules.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
