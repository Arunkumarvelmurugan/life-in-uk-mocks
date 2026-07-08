"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, MoreVertical, RotateCcw, Lightbulb, ArrowRight, AlertCircle } from "lucide-react";
import type { MockTest } from "@/lib/tests";
import { submitAnswer, resetTestProgress, type TestProgressRow } from "@/lib/progress-actions";
import { Breadcrumb } from "@/components/breadcrumb";
import { cn } from "@/lib/utils";

const OPTION_LABELS = ["A", "B", "C", "D"];

export function TestTakingClient({
  test,
  initialProgress,
}: {
  test: MockTest;
  initialProgress: TestProgressRow | null;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>(initialProgress?.answers ?? {});
  const [currentIndex, setCurrentIndex] = useState(() => {
    const initialAnswers = initialProgress?.answers ?? {};
    const firstUnanswered = test.questions.findIndex((_, i) => initialAnswers[i] === undefined);
    return firstUnanswered === -1 ? test.questions.length - 1 : firstUnanswered;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const question = test.questions[currentIndex];
  const answeredIndex = answers[currentIndex];
  const isAnswered = answeredIndex !== undefined;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === test.questions.length - 1;
  const allAnswered = answeredCount === test.questions.length;
  const showResults = allAnswered && isLastQuestion && isAnswered;

  function selectAnswer(optionIndex: number) {
    if (isAnswered || isPending) return;
    setError(null);

    startTransition(async () => {
      try {
        const result = await submitAnswer(test.id, currentIndex, optionIndex);
        setAnswers(result.answers);
      } catch {
        setError("Couldn't save your answer — please try again.");
      }
    });
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
        setCurrentIndex(0);
        setMenuOpen(false);
      } catch {
        setError("Couldn't reset progress — please try again.");
      }
    });
  }

  const score = test.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
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
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <MoreVertical size={16} />
            <span className="hidden sm:inline">Settings</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-52 rounded-xl border border-card-border bg-card p-1.5 shadow-xl">
              <button
                onClick={resetTest}
                disabled={isPending}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
              >
                <RotateCcw size={14} />
                Reset progress
              </button>
            </div>
          )}
        </div>
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
              </p>
              <p className="mb-8 text-2xl font-semibold leading-snug tracking-tight sm:text-[1.65rem]">
                {question.question}
              </p>
              <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => {
                  const isCorrectOption = idx === question.correctIndex;
                  const isSelected = idx === answeredIndex;

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
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(idx)}
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

              {isAnswered && (
                <div className="mt-6 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
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
                      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      Answer remaining questions
                      <ArrowRight size={16} />
                    </button>
                  ) : !isLastQuestion ? (
                    <button
                      onClick={goNext}
                      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
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
          correctIndexes={test.questions.map((q) => q.correctIndex)}
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
        {passed ? "Pass — above the 75% threshold" : "Below pass mark — try again"}
      </p>
      <div className="mt-9 flex gap-3">
        <button
          onClick={onRetake}
          className="rounded-xl border border-card-border px-5 py-2.5 font-medium transition-colors hover:bg-muted"
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
  answers: Record<number, number>;
  correctIndexes: number[];
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
          const isCorrect = isAnswered && answer === correctIndexes[i];
          const isCurrent = i === currentIndex;

          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
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
