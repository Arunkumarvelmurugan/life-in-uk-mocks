import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Lock,
  PartyPopper,
  ClipboardList,
  LayoutGrid,
} from "lucide-react";
import { auth } from "@/auth";
import { mockTests, QUESTIONS_PER_TEST, TOTAL_TESTS, FREE_TEST_ID } from "@/lib/tests";
import { getAllProgress } from "@/lib/progress-actions";
import { getUserAccess } from "@/lib/supabase-users";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProgressBar } from "@/components/progress-bar";
import { RadialProgress } from "@/components/radial-progress";
import { cn } from "@/lib/utils";

// Gated behind sign-in (src/proxy.ts) and disallowed in robots.txt - noindex
// is a page-level belt-and-braces signal in case either of those is ever
// bypassed (e.g. crawled via a referring link before the redirect fires).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const FILTERS = [
  { value: "all", label: "All Tests" },
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
] as const;

export default async function MockTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string; filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const { purchase, filter = "all" } = await searchParams;

  const [allProgress, access] = await Promise.all([
    getAllProgress(),
    getUserAccess(session.user.id),
  ]);
  const { hasAccess: hasFullAccess, qualifiesForPassGuarantee } = access;

  // Pass Guarantee eligibility requires passing (not just completing) every
  // test. Unattempted or failed tests don't count, even if all 17 have been
  // attempted.
  const PASS_THRESHOLD_SCORE = Math.ceil(QUESTIONS_PER_TEST * 0.75); // 18 of 24

  let passedCount = 0;
  let failedCount = 0;
  let inProgressCount = 0;

  for (const test of mockTests) {
    const p = allProgress[test.id];
    const done = p ? Object.keys(p.answers).length : 0;
    const isComplete = done === QUESTIONS_PER_TEST;

    if (isComplete) {
      if ((p?.score ?? 0) >= PASS_THRESHOLD_SCORE) passedCount++;
      else failedCount++;
    } else if (done > 0) {
      inProgressCount++;
    }
  }

  const passedTests = passedCount;

  const testsWithStatus = mockTests.map((test) => {
    const isLocked = test.id !== FREE_TEST_ID && !hasFullAccess;
    const p = allProgress[test.id];
    const done = p ? Object.keys(p.answers).length : 0;
    const isComplete = done === QUESTIONS_PER_TEST;
    const status: "not-started" | "in-progress" | "completed" =
      done === 0 ? "not-started" : isComplete ? "completed" : "in-progress";
    return { test, isLocked, p, done, isComplete, status };
  });

  const filteredTests =
    filter === "all" ? testsWithStatus : testsWithStatus.filter((t) => t.status === filter);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Breadcrumb items={[{ label: "Mock Tests" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Mock Tests</h1>
      <p className="mt-2 mb-8 text-muted-foreground">
        {QUESTIONS_PER_TEST} questions each. Score 75% or higher to pass.
      </p>

      {purchase === "success" && (
        <div className="mb-8 flex items-center gap-2 rounded-2xl border border-success-border bg-success-bg px-6 py-4 text-sm font-medium text-success">
          <PartyPopper size={18} className="shrink-0" />
          Payment successful - all mock tests unlocked. Good luck!
        </div>
      )}

      {!hasFullAccess && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 text-sm">
          <span className="text-foreground/80">
            You have free access to Test {FREE_TEST_ID}. Upgrade to unlock all {TOTAL_TESTS} mock
            tests.
          </span>
          <Link
            href="/#pricing"
            className="shrink-0 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            See plans
          </Link>
        </div>
      )}

      <div className="mb-8 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col flex-wrap items-center gap-6 lg:flex-row">
          <RadialProgress value={passedTests} max={TOTAL_TESTS} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <ShieldCheck size={18} className="text-primary" />
              <h2 className="font-semibold">Pass Guarantee Progress</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {passedTests} of {TOTAL_TESTS} mock tests passed
            </p>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              {!qualifiesForPassGuarantee
                ? "The Pass Guarantee is exclusive to Lifetime Access members - upgrade to become eligible."
                : passedTests === TOTAL_TESTS
                  ? "🎉 Congratulations! You've earned the Pass Guarantee."
                  : `You must pass all ${TOTAL_TESTS} mock tests (${PASS_THRESHOLD_SCORE}/${QUESTIONS_PER_TEST} or higher) to qualify for the Pass Guarantee.`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-center gap-1 rounded-xl border border-card-border px-4 py-2.5">
              <CheckCircle2 size={18} className="text-success" />
              <span className="text-lg font-bold">{passedCount}</span>
              <span className="text-xs text-muted-foreground">Passed</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-card-border px-4 py-2.5">
              <XCircle size={18} className="text-danger" />
              <span className="text-lg font-bold">{failedCount}</span>
              <span className="text-xs text-muted-foreground">Failed</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-card-border px-4 py-2.5">
              <Clock size={18} className="text-primary" />
              <span className="text-lg font-bold">{inProgressCount}</span>
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
          </div>

          <Link
            href="/#guarantee"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted"
          >
            View Pass Guarantee
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          return (
            <Link
              key={f.value}
              href={f.value === "all" ? "?" : `?filter=${f.value}`}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-card-border bg-card text-foreground/80 hover:border-primary/40"
              )}
            >
              {f.value === "all" && <LayoutGrid size={14} />}
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTests.map(({ test, isLocked, p, done, isComplete }) => {
          const correct = p?.score ?? 0;
          const pct = isComplete ? Math.round((correct / QUESTIONS_PER_TEST) * 100) : 0;
          const passed = isComplete && pct >= 75;

          const statusLabel = isLocked
            ? null
            : isComplete
              ? passed
                ? "Passed"
                : "Below pass mark"
              : done > 0
                ? "In Progress"
                : "Not Started";
          const statusClasses = isComplete
            ? passed
              ? "bg-success-bg text-success"
              : "bg-danger-bg text-danger"
            : done > 0
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground";

          return (
            <Link
              key={test.id}
              href={`/mock-tests/${test.id}`}
              className={cn(
                "group rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
                isLocked && "opacity-70"
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{test.title}</h2>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ClipboardList size={16} />
                </span>
              </div>

              {statusLabel && (
                <span
                  className={cn(
                    "mb-4 inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                    statusClasses
                  )}
                >
                  {statusLabel}
                </span>
              )}

              {isLocked ? (
                <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Lock size={14} className="shrink-0" />
                  Requires Full Access
                </p>
              ) : (
                <>
                  <ProgressBar
                    value={isComplete ? correct : done}
                    max={QUESTIONS_PER_TEST}
                    variant={isComplete ? (passed ? "success" : "danger") : "primary"}
                  />
                  <div className="mt-2.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isComplete
                        ? `${correct}/${QUESTIONS_PER_TEST} (${pct}%)`
                        : `${done}/${QUESTIONS_PER_TEST} answered`}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {isComplete ? "Review" : done > 0 ? "Continue" : "Start"}
                      <ChevronRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </div>

      {filteredTests.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No tests match this filter.
        </p>
      )}
    </div>
  );
}
