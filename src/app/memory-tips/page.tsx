import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { memoryTipsCategories } from "@/lib/memory-tips-data";
import { MarketingContainer } from "@/components/marketing-container";
import { PageHeading } from "@/components/page-heading";
import { buttonClass, cardClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Memory Tips for the Life in the UK Test",
  description:
    "Free Memory Tips and Quick Memory Rules covering British history, government, culture, and geography - the key facts examiners test again and again.",
  alternates: {
    canonical: "/memory-tips",
  },
};

export default function MemoryTipsPage() {
  const totalFacts = memoryTipsCategories.reduce((acc, c) => acc + c.facts.length, 0);

  return (
    <MarketingContainer className="py-16">
      <Breadcrumb items={[{ label: "Memory Tips" }]} />

      <PageHeading eyebrow="Free study resource" title="Memory Tips for the Life in the UK Test">
        <p className="max-w-2xl">
          {totalFacts} bite-sized facts pulled straight from our mock tests, grouped by topic so you
          can revise the areas you find hardest. These are the same Memory Tips shown after
          completing a mock test - free to browse, no account required.
        </p>
      </PageHeading>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {memoryTipsCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/memory-tips/${category.slug}`}
            className={cardClass({ className: "group flex flex-col transition-colors hover:border-primary/50" })}
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

      <div className="mt-12 rounded-panel border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <p className="font-semibold">Want the full picture?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          These facts are just a taste. Every question in our 17 mock tests comes with a detailed
          explanation, a Memory Tip, and a Quick Memory Rule to help it stick.
        </p>
        <Link href="/mock-tests" className={buttonClass("primary", "md", "mt-4")}>
          Try a free mock test
          <ArrowRight size={16} />
        </Link>
      </div>
    </MarketingContainer>
  );
}
