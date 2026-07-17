import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { memoryTipsCategories } from "@/lib/memory-tips-data";
import { renderInlineMarkdown } from "@/lib/inline-markdown";

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
    title: `${category.name} Memory Tips for the Life in the UK Test - Life in UK Mocks`,
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
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <Breadcrumb items={[{ label: "Memory Tips", href: "/memory-tips" }, { label: category.name }]} />

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>

      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {category.facts.map((fact, i) => (
          <li
            key={i}
            className="rounded-xl border border-card-border bg-card p-4 text-sm leading-relaxed text-foreground/90 shadow-sm"
          >
            {renderInlineMarkdown(fact)}
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <p className="font-semibold">Want the full picture?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          These facts are just a taste. Every question in our 17 mock tests comes with a detailed
          explanation, a Memory Tip, and a Quick Memory Rule to help it stick.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/mock-tests"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try a free mock test
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/memory-tips"
            className="inline-flex items-center gap-2 rounded-lg border border-card-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            All Memory Tips categories
          </Link>
        </div>
      </div>
    </div>
  );
}
