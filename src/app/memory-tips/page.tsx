import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { memoryTipsCategories } from "@/lib/memory-tips-data";

export const metadata: Metadata = {
  title: "Memory Tips for the Life in the UK Test - Life in UK Mocks",
  description:
    "Free Memory Tips and Quick Memory Rules covering British history, government, culture, and geography - the key facts examiners test again and again.",
  alternates: {
    canonical: "/memory-tips",
  },
};

export default function MemoryTipsPage() {
  const totalFacts = memoryTipsCategories.reduce((acc, c) => acc + c.facts.length, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <Breadcrumb items={[{ label: "Memory Tips" }]} />

      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
        <Brain size={18} />
        Free study resource
      </div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Memory Tips for the Life in the UK Test
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {totalFacts} bite-sized facts pulled straight from our mock tests, grouped by topic so you
        can revise the areas you find hardest. These are the same Memory Tips shown after
        completing a mock test - free to browse, no account required.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {memoryTipsCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/memory-tips/${category.slug}`}
            className="group flex flex-col rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {category.facts.length} facts
            </span>
            <h2 className="mt-1 text-lg font-semibold">{category.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
              Browse facts
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <p className="font-semibold">Want the full picture?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          These facts are just a taste. Every question in our 17 mock tests comes with a detailed
          explanation, a Memory Tip, and a Quick Memory Rule to help it stick.
        </p>
        <Link
          href="/mock-tests"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Try a free mock test
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
