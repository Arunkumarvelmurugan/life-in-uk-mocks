"use client";

import { useState } from "react";
import { Check, X, CheckCircle2, Brain, Zap, Lightbulb, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTION_LABELS = ["A", "B", "C", "D"];

// Real content from Mock Test 1, question 5 - kept in sync by hand since
// this is a single hand-picked showcase question, not pulled from
// mock-tests-data.ts.
const DEMO_QUESTION = {
  question: "Who is the patron Saint of Scotland?",
  options: ["St David", "St Patrick", "St George", "St Andrew"],
  correctIndex: 3,
  correctLabel: "St Andrew",
  explanation: "St Andrew is the patron Saint of Scotland.",
  celebratedOn: "30 November",
  memoryTip:
    "Learn all four patron saints together:\n\n❌ St David → Patron Saint of Wales (celebrated on 1 March).\n❌ St Patrick → Patron Saint of Northern Ireland (celebrated on 17 March).\n❌ St George → Patron Saint of England (celebrated on 23 April).\n✅ St Andrew → Patron Saint of Scotland (celebrated on 30 November).",
  quickMemoryRule:
    "England → St George\nScotland → St Andrew\nWales → St David\nNorthern Ireland → St Patrick\n\nLearn all four together - you'll answer several exam questions with one memory.",
};

const INCLUDES = [
  { icon: Target, label: "Explanation" },
  { icon: Brain, label: "Memory Tip" },
  { icon: Zap, label: "Quick Rule" },
];

const UNLOCKS = [
  {
    icon: CheckCircle2,
    color: "success",
    title: "Correct Answer Explained",
    description: "Understand why this is the right answer.",
  },
  {
    icon: Brain,
    color: "amber",
    title: "Memory Tip",
    description: "Remember the fact with a simple, powerful tip.",
  },
  {
    icon: Zap,
    color: "violet",
    title: "Quick Memory Rule",
    description: "A short rule to help you remember it.",
  },
];

const UNLOCK_COLOR_CLASSES: Record<string, string> = {
  success: "border-success-border bg-success-bg text-success",
  amber: "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
  violet: "border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400",
};

export function DemoQuestionCard() {
  const [selected, setSelected] = useState<number | null>(null);
  const isAnswered = selected !== null;

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-2">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Demo question
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Life in the UK Test
          </span>
        </div>

        <p className="mb-1.5 text-xl font-semibold leading-snug tracking-tight">
          {DEMO_QUESTION.question}
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Pick an answer to see the explanation, memory tip and quick memory rule.
        </p>

        <div className="flex flex-col gap-2">
          {DEMO_QUESTION.options.map((option, idx) => {
            const isCorrectOption = idx === DEMO_QUESTION.correctIndex;
            const isSelected = idx === selected;

            let rowClasses = "border-card-border bg-background";
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
                rowClasses = "border-card-border/60 bg-background opacity-50";
              }
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => !isAnswered && setSelected(idx)}
                disabled={isAnswered}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-4 rounded-xl border px-5 py-3 text-left text-base transition-all duration-150 disabled:cursor-default",
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

        {!isAnswered && (
          <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Lightbulb size={16} />
            </span>
            <div>
              <p className="font-semibold text-primary">Don&apos;t guess! Pick the answer you think is correct.</p>
              <p className="text-sm text-muted-foreground">You&apos;ll get a full explanation with memory tips.</p>
            </div>
          </div>
        )}

        {isAnswered && (
          <div className="mt-4 flex gap-3 rounded-xl border border-success-border bg-success-bg p-4">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" />
            <div>
              <p className="mb-1 font-semibold text-success">
                Correct Answer: {DEMO_QUESTION.correctLabel}
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">{DEMO_QUESTION.explanation}</p>
              <p className="text-sm leading-relaxed text-foreground/80">
                St Andrew&apos;s Day is celebrated every year on{" "}
                <span className="font-semibold text-primary">{DEMO_QUESTION.celebratedOn}</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        {isAnswered ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-card-border bg-muted p-4">
              <p className="mb-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-muted-foreground">
                <Trophy size={13} className="text-primary" />
                Every question includes:
              </p>
              <div className="flex items-start justify-between gap-1">
                {INCLUDES.map((item) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-1.5 text-center">
                    <item.icon size={16} className="text-primary" />
                    <p className="text-xs leading-tight text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <Brain size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="mb-1 font-semibold text-amber-600 dark:text-amber-400">Memory Tip</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {DEMO_QUESTION.memoryTip}
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <Zap size={18} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="mb-1 font-semibold text-violet-600 dark:text-violet-400">
                  Quick Memory Rule
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {DEMO_QUESTION.quickMemoryRule}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="mr-1">✨</span>
              Here&apos;s what <span className="font-semibold text-primary">you&apos;ll unlock</span> after
              answering:
            </p>

            {UNLOCKS.map((item) => (
              <div
                key={item.title}
                className={cn("flex gap-3 rounded-xl border p-4", UNLOCK_COLOR_CLASSES[item.color])}
              >
                <item.icon size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
