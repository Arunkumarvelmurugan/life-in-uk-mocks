"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Brain, Sparkles, Lightbulb, ArrowRight, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTION_LABELS = ["A", "B", "C", "D"];

// Real content from Mock Test 1, question 5 - kept in sync by hand since
// this is a single hand-picked showcase question, not pulled from
// mock-tests-data.ts.
const DEMO_QUESTION = {
  question: "Who is the patron Saint of Scotland?",
  options: ["St David", "St Patrick", "St George", "St Andrew"],
  correctIndex: 3,
  explanation: "The patron Saint of Scotland is St Andrew.",
  memoryTip:
    "Learn all four patron saints together:\n\n❌ St David → Patron Saint of Wales (celebrated on 1 March).\n❌ St Patrick → Patron Saint of Northern Ireland (celebrated on 17 March).\n❌ St George → Patron Saint of England (celebrated on 23 April).\n✅ St Andrew → Patron Saint of Scotland (celebrated on 30 November).",
  quickMemoryRule:
    "England → St George\nScotland → St Andrew\nWales → St David\nNorthern Ireland → St Patrick\n\nLearn all four together - you'll answer several exam questions with one memory.",
};

export function DemoQuestionCard({ freeTestHref }: { freeTestHref: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const isAnswered = selected !== null;

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          Demo question
        </p>
        <p className="mb-4 text-xl font-semibold leading-snug tracking-tight">
          {DEMO_QUESTION.question}
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
      </div>

      <div>
        {isAnswered ? (
          <div className="flex flex-col gap-3">
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
              <Sparkles size={18} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="mb-1 font-semibold text-violet-600 dark:text-violet-400">
                  Quick Memory Rule
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {DEMO_QUESTION.quickMemoryRule}
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="mb-1 font-semibold text-primary">Explanation</p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {DEMO_QUESTION.explanation}
                </p>
              </div>
            </div>

            <Link
              href={freeTestHref}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              Try a full mock test
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-card-border p-6 text-center">
            <MousePointerClick size={22} className="mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Pick an answer to see the explanation, memory tip and quick memory rule.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
