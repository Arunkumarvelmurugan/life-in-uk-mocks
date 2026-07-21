import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { memoryTipsCategories } from "@/lib/memory-tips-data";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { MarketingContainer } from "@/components/marketing-container";
import { PageHeading } from "@/components/page-heading";
import { buttonClass } from "@/lib/ui";

export function generateStaticParams() {
  return memoryTipsCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = memoryTipsCategories.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} Memory Tips for the Life in the UK Test`,
    description: category.description,
    alternates: {
      canonical: `/memory-tips/${category.slug}`,
    },
  };
}

export default async function MemoryTipsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = memoryTipsCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <MarketingContainer className="py-16">
      <Breadcrumb items={[{ label: "Memory Tips", href: "/memory-tips" }, { label: category.name }]} />

      <PageHeading title={category.name}>
        <p className="max-w-2xl">{category.description}</p>
      </PageHeading>

      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.facts.map((fact, i) => (
          <li
            key={i}
            className="rounded-card border border-card-border bg-card p-4 text-sm leading-relaxed text-foreground/90"
          >
            {renderInlineMarkdown(fact)}
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-panel border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <p className="font-semibold">Want the full picture?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          These facts are just a taste. Every question in our 17 mock tests comes with a detailed
          explanation, a Memory Tip, and a Quick Memory Rule to help it stick.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link href="/mock-tests" className={buttonClass("primary", "md")}>
            Try a free mock test
            <ArrowRight size={16} />
          </Link>
          <Link href="/memory-tips" className={buttonClass("secondary", "md")}>
            All Memory Tips categories
          </Link>
        </div>
      </div>
    </MarketingContainer>
  );
}
