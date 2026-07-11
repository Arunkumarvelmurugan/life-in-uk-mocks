"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, RotateCcw, Lightbulb, Brain, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import type { MockTest } from "@/lib/tests";
import { submitAnswer, resetTestProgress, type TestProgressRow } from "@/lib/progress-actions";
import { Breadcrumb } from "@/components/breadcrumb";
import { cn, sameIndexSet } from "@/lib/utils";

const OPTION_LABELS = ["A", "B", "C", "D"];

export function TestTakingClient({
  test,
  initialProgress,
}: {
  test: MockTest;
  initialProgress: TestProgressRow | null;
}) {
  const [answers, setAnswers] = useState<Record<number, number[]>>(
    initialProgress?.answers ?? {}
  );
  const [currentIndex, setCurrentIndex] = useState(() => {
    const initialAnswers = initialProgress?.answers ?? {};
    const firstUnanswered = test.questions.findIndex((_, i) => initialAnswers[i] === undefined);
    return firstUnanswered === -1 ? test.questions.length - 1 : firstUnanswered;
  });
  // Picks for the current question that haven't been submitted yet - only
  // used for "choose N" questions, which need a Submit step since a single
  // click can't mean "lock in my answer" the way it does for single-select.
  // Keyed by question index so navigating to a different question naturally
  // starts with an empty selection, with no effect needed to reset it.
  const [pendingPicksState, setPendingPicksState] = useState<{
    index: number;
    picks: number[];
  }>({ index: -1, picks: [] });
  const pendingPicks = pendingPicksState.index === currentIndex ? pendingPicksState.picks : [];
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const question = test.questions[currentIndex];
  const requiredPicks = question.correctIndexes.length;
  const isMultiSelect = requiredPicks > 1;
  const answeredIndexes = answers[currentIndex];
  const isAnswered = answeredIndexes !== undefined;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === test.questions.length - 1;
  const allAnswered = answeredCount === test.questions.length;
  const showResults = allAnswered && isLastQuestion && isAnswered;

  function commitAnswer(selected: number[]) {
    setError(null);

    // Show feedback immediately - the correct answer is already in the
    // client bundle (that's how instant feedback works at all), so there's
    // no reason to wait on a network round-trip just to *display* it.
    // Persisting to the database happens in the background; on failure we
    // roll back to let the user retry.
    const previousAnswers = answers;
    setAnswers((prev) => ({ ...prev, [currentIndex]: selected }));

    startTransition(async () => {
      try {
        const result = await submitAnswer(test.id, currentIndex, selected);
        setAnswers(result.answers);
      } catch {
        setAnswers(previousAnswers);
        setError("Couldn't save your answer - please try again.");
      }
    });
  }

  function toggleOption(optionIndex: number) {
    if (isAnswered || isPending) return;

    if (!isMultiSelect) {
      commitAnswer([optionIndex]);
      return;
    }

    setPendingPicksState((prev) => {
      const picks = prev.index === currentIndex ? prev.picks : [];
      const next = picks.includes(optionIndex)
        ? picks.filter((i) => i !== optionIndex)
        : picks.length < requiredPicks
          ? [...picks, optionIndex]
          : picks;
      return { index: currentIndex, picks: next };
    });
  }

  function submitPendingPicks() {
    if (pendingPicks.length !== requiredPicks || isPending) return;
    commitAnswer(pendingPicks);
  }

  function goNext() {
    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function resetTest() {
    setError(null);

    startTransition(async () => {
      try {
        await resetTestProgress(test.id);
        setAnswers({});
        setPendingPicksState({ index: -1, picks: [] });
        setCurrentIndex(0);
      } catch {
        setError("Couldn't reset progress - please try again.");
      }
    });
  }

  const score = test.questions.reduce(
    (acc, q, i) => acc + (answers[i] && sameIndexSet(answers[i], q.correctIndexes) ? 1 : 0),
    0
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <Breadcrumb
            items={[
              { label: "Mock Tests", href: "/practice/mock-tests" },
              { label: `Test ${test.id}` },
            ]}
          />
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{test.title}</h1>
        </div>
        <button
          onClick={resetTest}
          disabled={isPending}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Reset progress
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger-border bg-danger-bg px-4 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-10">
          {showResults ? (
            <ResultsPanel score={score} total={test.questions.length} onRetake={resetTest} />
          ) : (
            <>
              <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
                Question {currentIndex + 1} of {test.questions.length}
                {isMultiSelect && !isAnswered && ` - choose ${requiredPicks} answers`}
              </p>
              <p className="mb-8 text-2xl font-semibold leading-snug tracking-tight sm:text-[1.65rem]">
                {question.question}
              </p>
              <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => {
                  const isCorrectOption = question.correctIndexes.includes(idx);
                  const isSelected = isAnswered
                    ? answeredIndexes!.includes(idx)
                    : pendingPicks.includes(idx);

                  let rowClasses =
                    "border-card-border bg-card hover:-translate-y-0.5 hover:border-primary hover:shadow-md cursor-pointer";
                  let badgeClasses = "bg-muted text-muted-foreground";
                  let icon: React.ReactNode = null;

                  if (isAnswered) {
                    if (isCorrectOption) {
                      rowClasses = "border-success-border bg-success-bg";
                      badgeClasses = "bg-success text-white";
                      icon = <Check size={16} className="shrink-0 text-success" />;
                    } else if (isSelected) {
                      rowClasses = "border-danger-border bg-danger-bg";
                      badgeClasses = "bg-danger text-white";
                      icon = <X size={16} className="shrink-0 text-danger" />;
                    } else {
                      rowClasses = "border-card-border/60 bg-card opacity-50";
                    }
                  } else if (isSelected) {
                    rowClasses = "border-primary bg-primary/5";
                    badgeClasses = "bg-primary text-primary-foreground";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => toggleOption(idx)}
                      disabled={isAnswered || isPending}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-base transition-all duration-150 disabled:cursor-default",
                        rowClasses
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                          badgeClasses
                        )}
                      >
                        {OPTION_LABELS[idx]}
                      </span>
                      <span className="flex-1">{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {isMultiSelect && !isAnswered && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={submitPendingPicks}
                    disabled={pendingPicks.length !== requiredPicks || isPending}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-default disabled:opacity-50"
                  >
                    Submit answer
                  </button>
                </div>
              )}

              {isAnswered && question.memoryTip && (
                <div className="mt-6 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <Brain size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="mb-1 font-semibold text-amber-600 dark:text-amber-400">Memory Tip</p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                      {question.memoryTip}
                    </p>
                  </div>
                </div>
              )}

              {isAnswered && question.quickMemoryRule && (
                <div className="mt-4 flex gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
                  <Sparkles size={18} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
                  <div>
                    <p className="mb-1 font-semibold text-violet-600 dark:text-violet-400">
                      Quick Memory Rule
                    </p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                      {question.quickMemoryRule}
                    </p>
                  </div>
                </div>
              )}

              {isAnswered && (
                <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <Lightbulb size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="mb-1 font-semibold text-primary">Explanation</p>
                    <p className="text-sm leading-relaxed text-foreground/80">{question.explanation}</p>
                  </div>
                </div>
              )}

              {isAnswered && (
                <div className="mt-8 flex justify-end">
                  {isLastQuestion && !allAnswered ? (
                    <button
                      onClick={() => {
                        const firstUnanswered = test.questions.findIndex(
                          (_, i) => answers[i] === undefined
                        );
                        if (firstUnanswered !== -1) setCurrentIndex(firstUnanswered);
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      Answer remaining questions
                      <ArrowRight size={16} />
                    </button>
                  ) : !isLastQuestion ? (
                    <button
                      onClick={goNext}
                      className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      Next
                      <ArrowRight size={16} />
                    </button>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

        <ProgressPanel
          total={test.questions.length}
          currentIndex={currentIndex}
          answers={answers}
          correctIndexes={test.questions.map((q) => q.correctIndexes)}
          onJump={setCurrentIndex}
        />
      </div>
    </div>
  );
}

function ResultsPanel({
  score,
  total,
  onRetake,
}: {
  score: number;
  total: number;
  onRetake: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 75;
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Test complete
      </p>
      <p className="mt-4 text-7xl font-extrabold tracking-tight">{pct}%</p>
      <p className="mt-2 text-lg text-muted-foreground">
        {score} out of {total} correct
      </p>
      <p
        className={cn(
          "mt-5 rounded-full px-4 py-1.5 text-sm font-semibold",
          passed ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
        )}
      >
        {passed ? "Pass - above the 75% threshold" : "Below pass mark - try again"}
      </p>
      <div className="mt-9 flex gap-3">
        <button
          onClick={onRetake}
          className="cursor-pointer rounded-xl border border-card-border px-5 py-2.5 font-medium transition-colors hover:bg-muted"
        >
          Retake test
        </button>
        <Link
          href="/practice/mock-tests"
          className="rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          Back to Mock Tests
        </Link>
      </div>
    </div>
  );
}

function ProgressPanel({
  total,
  currentIndex,
  answers,
  correctIndexes,
  onJump,
}: {
  total: number;
  currentIndex: number;
  answers: Record<number, number[]>;
  correctIndexes: number[][];
  onJump: (i: number) => void;
}) {
  const answeredCount = Object.keys(answers).length;
  return (
    <div className="sticky top-24 h-fit rounded-2xl border border-card-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold">Progress</p>
        <span className="text-sm text-muted-foreground">
          {answeredCount}/{total}
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
        {Array.from({ length: total }, (_, i) => {
          const answer = answers[i];
          const isAnswered = answer !== undefined;
          const isCorrect = isAnswered && sameIndexSet(answer, correctIndexes[i]);
          const isCurrent = i === currentIndex;

          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              className={cn(
                "flex h-8 cursor-pointer items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                isAnswered && isCorrect && "border-success-border bg-success-bg text-success",
                isAnswered && !isCorrect && "border-danger-border bg-danger-bg text-danger",
                !isAnswered && !isCurrent && "border-card-border/70 bg-transparent text-muted-foreground",
                isCurrent && "border-primary text-primary ring-1 ring-primary"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          Correct
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" />
          Wrong
        </div>
      </div>
    </div>
  );
}
