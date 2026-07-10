import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, ChevronRight, ShieldCheck, Lock, PartyPopper } from "lucide-react";
import { auth } from "@/auth";
import { mockTests, QUESTIONS_PER_TEST, TOTAL_TESTS, FREE_TEST_ID } from "@/lib/tests";
import { getAllProgress } from "@/lib/progress-actions";
import { getUserHasFullAccess } from "@/lib/supabase-users";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProgressBar } from "@/components/progress-bar";
import { RadialProgress } from "@/components/radial-progress";
import { cn } from "@/lib/utils";

export default async function MockTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/?signin=required");
  }

  const { purchase } = await searchParams;

  const [allProgress, hasFullAccess] = await Promise.all([
    getAllProgress(),
    getUserHasFullAccess(session.user.id),
  ]);

  const completedTests = Object.values(allProgress).filter(
    (p) => Object.keys(p.answers).length === QUESTIONS_PER_TEST
  ).length;

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
          Payment successful - Full Access unlocked. Good luck!
        </div>
      )}

      {!hasFullAccess && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 text-sm">
          <span className="text-foreground/80">
            You have free access to Test {FREE_TEST_ID}. Upgrade to Full Access to unlock all{" "}
            {TOTAL_TESTS} mock tests.
          </span>
          <Link
            href="/#pricing"
            className="shrink-0 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            Get Full Access
          </Link>
        </div>
      )}

      <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:flex-row sm:p-8">
        <RadialProgress value={completedTests} max={TOTAL_TESTS} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <ShieldCheck size={18} className="text-primary" />
            <h2 className="font-semibold">Pass Guarantee Progress</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {completedTests}/{TOTAL_TESTS} mock tests completed
          </p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Progress towards your Pass Guarantee. Complete all {TOTAL_TESTS} mock tests to reach
            100%.
          </p>
        </div>
        <Link
          href="/#guarantee"
          className="shrink-0 rounded-lg border border-card-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted"
        >
          View Pass Guarantee
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTests.map((test) => {
          const isLocked = test.id !== FREE_TEST_ID && !hasFullAccess;
          const p = allProgress[test.id];
          const done = p ? Object.keys(p.answers).length : 0;
          const correct = p?.score ?? 0;
          const isComplete = done === QUESTIONS_PER_TEST;
          const pct = isComplete ? Math.round((correct / QUESTIONS_PER_TEST) * 100) : 0;
          const passed = isComplete && pct >= 75;

          return (
            <Link
              key={test.id}
              href={`/practice/mock-tests/${test.id}`}
              className={cn(
                "group rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
                isLocked && "opacity-70"
              )}
            >
              <div className="mb-5 flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{test.title}</h2>
                {isLocked ? (
                  <Lock size={18} className="shrink-0 text-muted-foreground" />
                ) : isComplete ? (
                  <CheckCircle2
                    size={20}
                    className={cn("shrink-0", passed ? "text-success" : "text-danger")}
                  />
                ) : (
                  <ChevronRight
                    size={20}
                    className="shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                )}
              </div>

              {isLocked ? (
                <p className="text-sm font-medium text-muted-foreground">Requires Full Access</p>
              ) : (
                <>
                  <ProgressBar
                    value={isComplete ? correct : done}
                    max={QUESTIONS_PER_TEST}
                    variant={isComplete ? (passed ? "success" : "danger") : "primary"}
                  />
                  <div className="mt-2.5 flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "font-medium",
                        isComplete ? (passed ? "text-success" : "text-danger") : "text-transparent"
                      )}
                    >
                      {isComplete ? (passed ? "Passed" : "Below pass mark") : " "}
                    </span>
                    <span className="text-muted-foreground">
                      {isComplete
                        ? `${correct}/${QUESTIONS_PER_TEST} (${pct}%)`
                        : `${done}/${QUESTIONS_PER_TEST}`}
                    </span>
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
