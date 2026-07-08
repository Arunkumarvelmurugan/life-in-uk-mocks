import Link from "next/link";
import { ShieldCheck, CheckCircle2, BarChart3, BookOpenCheck, LogIn, Lock } from "lucide-react";
import { TOTAL_TESTS, QUESTIONS_PER_TEST, FREE_TEST_ID } from "@/lib/tests";
import { auth } from "@/auth";
import { getUserHasFullAccess } from "@/lib/supabase-users";
import { createCheckoutSession } from "@/lib/checkout-actions";

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
    highlighted: false,
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
      "Pass guarantee — money back if you fail",
    ],
    cta: "Get full access",
    highlighted: true,
  },
];

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

  return (
    <div>
      {signin === "required" && (
        <div className="flex items-center justify-center gap-2 bg-primary px-6 py-2.5 text-center text-sm font-medium text-primary-foreground">
          <LogIn size={15} />
          Sign in with Google to access Mock Tests.
        </div>
      )}
      {upgrade === "required" && (
        <div className="flex items-center justify-center gap-2 bg-primary px-6 py-2.5 text-center text-sm font-medium text-primary-foreground">
          <Lock size={15} />
          Upgrade to Full Access to unlock all {TOTAL_TESTS} mock tests.
        </div>
      )}
      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-16 pt-20 text-center">
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
            Start practicing free
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg border border-card-border px-6 py-3 font-medium hover:bg-muted"
          >
            See pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
              <f.icon className="mb-3 text-primary" size={24} />
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Simple pricing</h2>
          <p className="mt-3 text-muted-foreground">One plan, one payment, no subscriptions.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 shadow-sm ${
                plan.highlighted
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-card-border bg-card"
              }`}
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
                hasFullAccess ? (
                  <Link
                    href="/practice/mock-tests"
                    className="mt-8 block rounded-lg bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground hover:opacity-90"
                  >
                    Go to Mock Tests
                  </Link>
                ) : (
                  <form action={createCheckoutSession}>
                    <button
                      type="submit"
                      className="mt-8 block w-full rounded-lg bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground hover:opacity-90"
                    >
                      {plan.cta}
                    </button>
                  </form>
                )
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
      </section>

      {/* Guarantee */}
      <section id="guarantee" className="border-t border-card-border bg-muted">
        <div className="mx-auto max-w-3xl px-6 py-20">
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
