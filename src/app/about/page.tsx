import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Repeat,
  Clock,
  MessageCircleQuestion,
  Brain,
} from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "About Us - Life in UK Mocks",
  description:
    "Why I built Life in UK Mocks: the problems I ran into preparing for the Life in the UK Test, and how this platform solves them.",
  alternates: {
    canonical: "/about",
  },
};

const problems = [
  {
    icon: Repeat,
    title: "Too many repeated questions",
    description:
      "Many practice websites contain dozens of mock tests, but the same questions appear repeatedly. Instead of learning new topics, I found myself answering the same questions again and again.",
  },
  {
    icon: Clock,
    title: "Too much content for busy people",
    description:
      "Most people preparing for the Life in the UK Test have full-time jobs and family responsibilities. Spending hours reading lengthy study material isn't always practical. I wanted a platform that helps people focus on what matters most.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Explanations weren't enough",
    description: "Many questions simply tell you the correct answer. I wanted every question to explain:",
    list: [
      "Why the correct answer is right.",
      "Why each incorrect option is wrong.",
      "The historical context when it helps understanding.",
    ],
  },
  {
    icon: Brain,
    title: "Hard to remember facts",
    description:
      "Some questions involve dates, kings, laws, or historical events that are easy to forget. That's why I added:",
    list: ["🧠 Memory Tips", "⚡ Quick Memory Rules", "💡 Easy ways to remember difficult facts"],
    footnote:
      "These are designed to help you remember information quickly instead of relying on rote memorisation.",
  },
];

const differentiators = [
  "Carefully selected questions without unnecessary repetition",
  "Clear explanations for every answer - including why the other options are incorrect",
  "Memory Tips and Quick Memory Rules to improve recall",
  "Designed for busy professionals who want to study efficiently",
  "Realistic mock tests that build confidence before the official exam",
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <Breadcrumb items={[{ label: "About" }]} />

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Why I Built Life in UK Mocks
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-foreground/80">
        <p>
          When I was preparing for the Life in the UK Test, I subscribed to an online preparation
          platform. It helped me pass the test, but I also noticed several things that made
          studying more difficult than it needed to be.
        </p>
        <p>
          Later, when my wife started preparing for the same exam, I wanted to recommend the same
          platform - but I couldn&apos;t. That experience inspired me to build Life in UK Mocks.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">The problems I wanted to solve</h2>
        <div className="mt-5 flex flex-col gap-6">
          {problems.map((problem) => (
            <div key={problem.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <problem.icon size={18} />
              </span>
              <div>
                <p className="font-semibold">{problem.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{problem.description}</p>
                {problem.list && (
                  <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                    {problem.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {problem.footnote && (
                  <p className="mt-2 text-sm text-muted-foreground">{problem.footnote}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">
          What makes Life in UK Mocks different?
        </h2>
        <ul className="mt-5 flex flex-col gap-2.5">
          {differentiators.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight">My goal</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          My goal isn&apos;t to create the website with the most questions. It&apos;s to create
          the website that helps you pass faster, understand better, and remember longer.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Who we are</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          Life in UK Mocks is operated by Arunkumar Velmurugan, trading as Life in UK Mocks. If
          you have any questions, I&apos;d genuinely like to hear from you - reach me via our{" "}
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
