"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  Check,
  X,
  RotateCcw,
  Lightbulb,
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import type { MockTest } from "@/lib/tests";
import { submitAnswer, resetTestProgress, type TestProgressRow } from "@/lib/progress-actions";
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
  // True once the user has explicitly asked to see their results - not just
  // whenever the last question happens to get answered. Without this gate,
  // answering question 24 would immediately swap the whole screen to the
  // results panel, so the user never gets to see feedback for that last
  // question. Defaults to true only if the test was already fully answered
  // on a previous visit (so returning to a finished test shows the score
  // right away, as expected).
  const [wantsResults, setWantsResults] = useState(() => {
    const initialAnswers = initialProgress?.answers ?? {};
    return Object.keys(initialAnswers).length === test.questions.length;
  });
  const [error, setError] = useState<string | null>(null);
  const questionCardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Jumping to a new question shouldn't leave the user scrolled down at
  // wherever the previous question's tip panels happened to end - scroll
  // the question card back into view so the new question is visible
  // without a manual scroll. Skipped on mount so the initial page load
  // doesn't get an unwanted scroll animation.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    questionCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIndex]);
  const [isPending, startTransition] = useTransition();

  const question = test.questions[currentIndex];
  const requiredPicks = question.correctIndexes.length;
  const isMultiSelect = requiredPicks > 1;
  const answeredIndexes = answers[currentIndex];
  const isAnswered = answeredIndexes !== undefined;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === test.questions.length - 1;
  const allAnswered = answeredCount === test.questions.length;
  const showResults = wantsResults && allAnswered;

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

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function resetTest() {
    setError(null);

    startTransition(async () => {
      try {
        await resetTestProgress(test.id);
        setAnswers({});
        setPendingPicksState({ index: -1, picks: [] });
        setWantsResults(false);
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
      <div className="mb-6 flex items-center justify-between">
        <span className="rounded-lg bg-muted px-3 py-1.5 text-sm font-semibold">Test {test.id}</span>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/practice/mock-tests"
            className="flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <LogOut size={14} />
            Exit Test
          </Link>
          <button
            onClick={resetTest}
            disabled={isPending}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
          >
            <RotateCcw size={14} />
            Reset progress
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger-border bg-danger-bg px-4 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <ProgressBarPanel
        total={test.questions.length}
        currentIndex={currentIndex}
        answers={answers}
        correctIndexes={test.questions.map((q) => q.correctIndexes)}
        onJump={setCurrentIndex}
      />

      <div
        ref={questionCardRef}
        className="mt-6 scroll-mt-24 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-10"
      >
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <CollapsibleTip
                key={`memory-${currentIndex}`}
                icon={Brain}
                title="Memory Tip"
                accentClass="text-amber-600 dark:text-amber-400"
                containerClass="mt-6 border-amber-500/20 bg-amber-500/5"
              >
                <p className="whitespace-pre-line">{question.memoryTip}</p>
              </CollapsibleTip>
            )}

            {isAnswered && question.quickMemoryRule && (
              <CollapsibleTip
                key={`quick-${currentIndex}`}
                icon={Sparkles}
                title="Quick Memory Rule"
                accentClass="text-violet-600 dark:text-violet-400"
                containerClass="mt-4 border-violet-500/20 bg-violet-500/5"
              >
                <QuickMemoryRuleContent text={question.quickMemoryRule} />
              </CollapsibleTip>
            )}

            {isAnswered && (
              <CollapsibleTip
                key={`explanation-${currentIndex}`}
                icon={Lightbulb}
                title="Explanation"
                accentClass="text-primary"
                containerClass="mt-4 border-primary/20 bg-primary/5"
              >
                <p>{question.explanation}</p>
              </CollapsibleTip>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={goPrevious}
                disabled={currentIndex === 0}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-card-border px-6 py-3 font-medium text-foreground/80 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              {isAnswered &&
                (isLastQuestion && !allAnswered ? (
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
                ) : isLastQuestion && allAnswered ? (
                  <button
                    onClick={() => setWantsResults(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                  >
                    See Results
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
                ) : null)}
            </div>
          </>
        )}
      </div>

      {showResults && test.whatYouLearned && test.whatYouLearned.length > 0 && (
        <WhatYouLearnedPanel facts={test.whatYouLearned} />
      )}
    </div>
  );
}

function WhatYouLearnedPanel({ facts }: { facts: string[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
        <Brain size={20} className="shrink-0" />
        What You Learned
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        These are the key facts and topics reinforced in this mock test. Review them to
        strengthen your knowledge before taking another mock test.
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {facts.map((fact, i) => (
          <li key={i} className="text-sm leading-relaxed text-foreground/90">
            {fact}
          </li>
        ))}
      </ul>
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

function CollapsibleTip({
  icon: Icon,
  title,
  accentClass,
  containerClass,
  children,
}: {
  icon: LucideIcon;
  title: string;
  accentClass: string;
  containerClass: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={cn("rounded-xl border p-5", containerClass)}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3"
      >
        <span className={cn("flex items-center gap-2 font-semibold", accentClass)}>
          <Icon size={18} className="shrink-0" />
          {title}
        </span>
        {expanded ? (
          <ChevronDown size={16} className={cn("shrink-0", accentClass)} />
        ) : (
          <ChevronRight size={16} className={cn("shrink-0", accentClass)} />
        )}
      </button>
      {expanded && (
        <div className="mt-2 text-sm leading-relaxed text-foreground/80">{children}</div>
      )}
    </div>
  );
}

// Renders a Quick Memory Rule as a row of compact inline facts rather than a
// stacked paragraph - a blank line in the source separates the fact list
// from an optional closing sentence, which still renders as its own line.
const ARROW_ONLY = /^[↓→⬇➡]+$/;

function QuickMemoryRuleContent({ text }: { text: string }) {
  const [factBlock, ...rest] = text.split("\n\n");
  const closingSentence = rest.join("\n\n");
  const facts = factBlock.split("\n").filter(Boolean);
  // Some rules are a top-to-bottom sequence ("A" / "↓" / "B") rather than a
  // list of independent "X → Y" facts. Laying those out as horizontal chips
  // strands the standalone arrows in the middle of a row with big gaps
  // either side, so render that style as a vertical stack instead.
  const isFlow = facts.some((f) => ARROW_ONLY.test(f.trim()));

  return (
    <div>
      {isFlow ? (
        <div className="flex flex-col items-start gap-0.5">
          {facts.map((fact, i) => (
            <span key={i}>{fact}</span>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {facts.map((fact, i) => (
            <span key={i} className="whitespace-nowrap">
              {fact}
            </span>
          ))}
        </div>
      )}
      {closingSentence && <p className="mt-2 whitespace-pre-line">{closingSentence}</p>}
    </div>
  );
}

function ProgressBarPanel({
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
  const correctCount = Object.entries(answers).filter(([i, answer]) =>
    sameIndexSet(answer, correctIndexes[Number(i)])
  ).length;
  const wrongCount = answeredCount - correctCount;

  return (
    <div className="rounded-2xl border border-card-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
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
                "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border text-xs font-medium transition-colors",
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

        <div className="ml-auto flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            Correct <strong className="text-foreground">{correctCount}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            Wrong <strong className="text-foreground">{wrongCount}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
            Current <strong className="text-foreground">1</strong>
          </span>
          <span className="font-medium text-foreground">
            {answeredCount} / {total} answered
          </span>
        </div>
      </div>
    </div>
  );
}
