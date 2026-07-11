import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  BookOpenCheck,
  LogIn,
  Lock,
  Brain,
  Star,
  GraduationCap,
  ArrowRight,
  Calendar,
  Target,
  Sparkles,
  Award,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { TOTAL_TESTS, QUESTIONS_PER_TEST, FREE_TEST_ID } from "@/lib/tests";
import { auth } from "@/auth";
import { getUserHasFullAccess, getUserDisplayName } from "@/lib/supabase-users";
import { createCheckoutSession } from "@/lib/checkout-actions";
import { getPaymentHistory } from "@/lib/payments-actions";
import { getAllProgress } from "@/lib/progress-actions";
import { ProgressBar } from "@/components/progress-bar";
import { CleanSearchParams } from "@/components/clean-search-params";
import { DemoQuestionCard } from "@/components/demo-question-card";

const features = [
  {
    icon: BookOpenCheck,
    title: `${TOTAL_TESTS} full mock tests`,
    description: `${TOTAL_TESTS} timed practice tests, ${QUESTIONS_PER_TEST} questions each, covering every handbook topic.`,
  },
  {
    icon: CheckCircle2,
    title: "Instant feedback",
    description: "See straight away whether an answer is right or wrong as you go.",
  },
  {
    icon: BarChart3,
    title: "Clear explanations",
    description: "Every question comes with a plain-English explanation so mistakes actually stick.",
  },
  {
    icon: ShieldCheck,
    title: "Pass guarantee",
    description: "Follow the study plan and still fail the real test? Get your money back.",
  },
  {
    icon: Brain,
    title: "Memory Tips & Quick Memory Rules",
    description: "Reusable memory techniques for facts that come up again and again across different mock tests.",
  },
];

const guaranteeConditions = [
  `Complete all ${TOTAL_TESTS} mock tests.`,
  "Achieve a score of 75% or higher on each mock test.",
  "Take your official Life in the UK Test within 60 days of completing the mock tests.",
];

const eligibilityRules = [
  "The email address used to register your learning account must be the same as the email address on your official Life in the UK Test result.",
  "The name on your learning account must exactly match the name on your official test result.",
];

const plans = [
  {
    id: "free" as const,
    name: "Free",
    price: "£0",
    period: "",
    description: "Try the format before you commit.",
    features: ["Test 1 unlocked", "Instant feedback", "Full explanations"],
    cta: "Start free test",
  },
  {
    id: "full" as const,
    name: "Full Access",
    price: "£19.99",
    period: "one-time",
    description: "Everything you need to pass first time.",
    features: [
      `All ${TOTAL_TESTS} mock tests`,
      "Progress tracking across every test",
      "Unlimited retakes",
      "Pass guarantee - money back if you fail",
    ],
    cta: "Get full access",
  },
];

function formatPurchaseDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ signin?: string; upgrade?: string }>;
}) {
  const { signin, upgrade } = await searchParams;
  const session = await auth();
  const isSignedIn = !!session?.user;
  const hasFullAccess = isSignedIn ? await getUserHasFullAccess(session.user.id) : false;
  const freeTestHref = isSignedIn ? "/practice/mock-tests" : `/practice/mock-tests/${FREE_TEST_ID}`;
  const heroCtaLabel = hasFullAccess ? "Go to Mock Tests" : "Start practicing free";

  let membership: {
    displayName: string | null;
    purchasedAt: string | null;
    completedTests: number;
    nextTestId: number | null;
  } | null = null;

  if (hasFullAccess && session?.user) {
    const [displayName, payments, allProgress] = await Promise.all([
      getUserDisplayName(session.user.id),
      getPaymentHistory(),
      getAllProgress(),
    ]);

    const completedTests = Object.values(allProgress).filter(
      (p) => Object.keys(p.answers).length === QUESTIONS_PER_TEST
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

    membership = { displayName, purchasedAt, completedTests, nextTestId };
  }

  return (
    <div>
      {(signin === "required" || upgrade === "required") && (
        <CleanSearchParams params={["signin", "upgrade"]} />
      )}
      {signin === "required" && !isSignedIn && (
        <div className="flex items-center justify-center gap-2 bg-primary px-6 py-2.5 text-center text-sm font-medium text-primary-foreground">
          <LogIn size={15} />
          Sign in with Google to access Mock Tests.
        </div>
      )}
      {upgrade === "required" && !hasFullAccess && (
        <div className="flex items-center justify-center gap-2 bg-primary px-6 py-2.5 text-center text-sm font-medium text-primary-foreground">
          <Lock size={15} />
          Upgrade to Full Access to unlock all {TOTAL_TESTS} mock tests.
        </div>
      )}
      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-8 pt-10 text-center">
        <span className="mb-4 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          100% Money-Back Pass Guarantee
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Pass the Life in the UK test, <span className="text-primary">first time.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Practice with realistic mock tests, get instant feedback and clear explanations for
          every question. If you follow the plan and still don&apos;t pass, we&apos;ll refund you.
        </p>
        <p className="mt-3 text-sm font-medium text-primary">
          No study guides. No lesson plans. Just mock tests until you&apos;re ready to pass.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={freeTestHref}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            {heroCtaLabel}
          </Link>
          {!hasFullAccess && (
            <Link
              href="#pricing"
              className="rounded-lg border border-card-border px-6 py-3 font-medium hover:bg-muted"
            >
              See pricing
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
              <f.icon className="mb-3 text-primary" size={24} />
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo question */}
      <section className="border-t border-card-border bg-muted">
        <div className="mx-auto max-w-4xl px-6 pt-14 pb-8">
          <div className="mb-6 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Star size={12} />
              Demo experience
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
                <p className="font-semibold">This is just one example.</p>
                <p className="text-sm text-muted-foreground">
                  Get full access to {TOTAL_TESTS} mocks with expert explanations, memory tips &
                  quick rules.
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
                Pass Guarantee · Lifetime access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Membership */}
      <section id="pricing" className={`mx-auto max-w-5xl px-6 ${hasFullAccess ? "py-10" : "pt-10 pb-10"}`}>
        {hasFullAccess && membership ? (
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-violet-500/10 to-primary/5 p-8 sm:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
              <div className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 lg:mx-0">
                <Trophy size={56} className="text-primary" />
              </div>

              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  <CheckCircle2 size={14} />
                  Premium Membership Active
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Welcome back{membership.displayName ? `, ${membership.displayName.split(" ")[0]}` : ""}{" "}
                  👋
                </h2>
                <p className="mt-2 text-muted-foreground">
                  You have <span className="font-semibold text-primary">Lifetime Access</span> to all{" "}
                  {TOTAL_TESTS} mock tests.
                </p>
                {membership.purchasedAt && (
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground lg:justify-start">
                    <Calendar size={14} />
                    Purchased {formatPurchaseDate(membership.purchasedAt)}
                  </p>
                )}

                <div className="mt-6 rounded-xl bg-card p-4 text-left shadow-sm">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-muted-foreground">
                      {membership.completedTests}/{TOTAL_TESTS} tests
                    </span>
                  </div>
                  <ProgressBar value={membership.completedTests} max={TOTAL_TESTS} variant="success" />
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
                      href={`/practice/mock-tests/${membership.nextTestId}`}
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
                      href="/practice/mock-tests"
                      className="shrink-0 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                    >
                      Review Mock Tests
                    </Link>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-primary/10 pt-4 text-sm text-muted-foreground lg:justify-start">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-primary" />
                    Lifetime Access
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
          </div>
        ) : !hasFullAccess ? (
          <>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight">Simple pricing</h2>
              <p className="mt-3 text-muted-foreground">One plan, one payment, no subscriptions.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-2xl border border-card-border bg-card p-8 shadow-sm"
                >
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-6 flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.id === "full" ? (
                    <form action={createCheckoutSession}>
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
              ))}
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
              don&apos;t, you get a 100% refund of your Full Access payment.
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
              Life in the UK Test result email or result letter, and we&apos;ll refund your Full
              Access payment in full.
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
