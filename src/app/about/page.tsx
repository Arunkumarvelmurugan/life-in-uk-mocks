import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Brain, CheckCircle2, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { TOTAL_TESTS } from "@/lib/tests";

export const metadata: Metadata = {
  title: "About Us - Life in UK Mocks",
  description:
    "Life in UK Mocks is an independent practice platform for the Life in the UK Test - realistic mock tests, plain-English explanations, and a 100% Pass Guarantee.",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    icon: BookOpenCheck,
    title: "Realistic practice, not guesswork",
    description: `${TOTAL_TESTS} full mock tests built to match the official test's format and difficulty, so there are no surprises on the day.`,
  },
  {
    icon: Brain,
    title: "Understanding over memorising",
    description:
      "Every question comes with a plain-English explanation, a Memory Tip, and a Quick Memory Rule - built to help facts actually stick, not just get answered once and forgotten.",
  },
  {
    icon: ShieldCheck,
    title: "A guarantee we stand behind",
    description:
      "Complete the study plan and still don't pass? Lifetime Access members get a full refund. No small print.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <Breadcrumb items={[{ label: "About" }]} />

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">About Life in UK Mocks</h1>
      <p className="mt-3 text-muted-foreground">
        An independent practice platform built to help you walk into the Life in the UK Test
        prepared and confident.
      </p>

      <div className="mt-10 flex flex-col gap-4 text-sm leading-relaxed text-foreground/80">
        <p>
          Life in UK Mocks is an independent practice platform for the official Life in the UK
          Test. We are not affiliated with, endorsed by, or connected to the Home Office, UK
          Visas and Immigration, GOV.UK, or any other UK government department or agency - our
          tests are built independently to reflect the style and difficulty of the real thing.
        </p>
        <p>
          The test itself only gives you one chance to prove what you know in the moment. Our aim
          is to make sure that moment isn&apos;t the first time you&apos;ve seen questions in that
          format - so you go in having already practised {TOTAL_TESTS} full mock tests, worked
          through the explanation for every question you got wrong, and picked up the memory
          techniques that make the facts stick.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">What we stand for</h2>
        <div className="mt-5 flex flex-col gap-5">
          {values.map((value) => (
            <div key={value.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <value.icon size={18} />
              </span>
              <div>
                <p className="font-semibold">{value.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Who we are</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          Life in UK Mocks is operated by Arunkumar Velmurugan, trading as Life in UK Mocks. If
          you have any questions, we&apos;d genuinely like to hear from you - reach us via our{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact Us
          </Link>{" "}
          page or at{" "}
          <a
            href="mailto:support@lifeinukmocks.co.uk"
            className="font-medium text-primary hover:underline"
          >
            support@lifeinukmocks.co.uk
          </a>
          .
        </p>
      </div>

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <p className="font-semibold">Ready to see how you&apos;d do?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Test 1 is free, no card required - see the real format for yourself.
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
            <CheckCircle2 size={16} />
            Browse free Memory Tips
          </Link>
        </div>
      </div>
    </div>
  );
}
