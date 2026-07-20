import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Repeat,
  Clock,
  MessageCircleQuestion,
  Brain,
  Zap,
  Lightbulb,
  Trophy,
  Target,
  ThumbsDown,
  FileText,
  User,
  Shield,
  GraduationCap,
  Landmark,
  Flag,
  ClipboardCheck,
  Mail,
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
    iconList: [
      { icon: Brain, label: "Memory Tips", color: "text-pink-600 bg-pink-500/10 dark:text-pink-400" },
      { icon: Zap, label: "Quick Memory Rules", color: "text-amber-600 bg-amber-500/10 dark:text-amber-400" },
      {
        icon: Lightbulb,
        label: "Easy ways to remember difficult facts",
        color: "text-yellow-600 bg-yellow-500/10 dark:text-yellow-400",
      },
    ],
  },
];

const differentiators = [
  {
    icon: CheckCircle2,
    title: "Carefully selected questions",
    description: "Without unnecessary repetition.",
  },
  {
    icon: FileText,
    title: "Clear explanations",
    description: "For every answer - including why the other options are incorrect.",
  },
  {
    icon: Lightbulb,
    title: "Memory tips & rules",
    description: "Memory Tips and Quick Memory Rules to improve recall.",
  },
  {
    icon: User,
    title: "Designed for busy people",
    description: "Built for professionals who want to study efficiently.",
  },
  {
    icon: Target,
    title: "Realistic mock tests",
    description: "That build confidence before the official exam.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <Breadcrumb items={[{ label: "About" }]} />

      {/* Hero */}
      <div className="mt-2 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            About Life in UK Mocks
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Why I Built <span className="text-danger">Life in UK Mocks</span>
          </h1>
          <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-foreground/80">
            <p>
              When I was preparing for the Life in the UK Test, I subscribed to an online
              preparation platform. It helped me pass the test, but I also noticed several things
              that made studying more difficult than it needed to be.
            </p>
            <p>
              Later, when my wife started preparing for the same exam, I wanted to recommend the
              same platform - but I couldn&apos;t. That experience inspired me to build Life in UK
              Mocks.
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute inset-4 rounded-full bg-primary/5" />
          <Landmark size={72} className="absolute left-8 top-6 text-primary/70 sm:left-10 sm:top-8" />
          <Flag size={40} className="absolute left-2 top-24 text-danger/70 sm:left-4 sm:top-28" />
          <ClipboardCheck
            size={88}
            className="absolute bottom-8 right-4 text-primary sm:bottom-10 sm:right-6"
            strokeWidth={1.5}
          />
          <GraduationCap
            size={56}
            className="absolute bottom-2 left-14 text-foreground/70 sm:bottom-4 sm:left-16"
          />
        </div>
      </div>

      {/* Problems */}
      <div className="mt-16 rounded-3xl bg-primary/5 p-6 sm:p-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ThumbsDown size={16} />
          </span>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            The problems I wanted to solve
          </h2>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <problem.icon size={20} />
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{problem.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{problem.description}</p>
                  {problem.list && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {problem.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-success" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {problem.iconList && (
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {problem.iconList.map((item) => (
                        <span
                          key={item.label}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.color}`}
                          >
                            <item.icon size={14} />
                          </span>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 border-l-4 border-primary/40 pl-4 text-sm leading-relaxed text-foreground/80">
          These are designed to help you remember information quickly instead of relying on rote
          memorisation.
        </p>
      </div>

      {/* Differentiators */}
      <div className="mt-16">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-bg text-success">
            <Trophy size={16} />
          </span>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            What makes Life in UK Mocks different?
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-2 rounded-2xl border border-card-border bg-card p-5 text-center shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success-bg text-success">
                <item.icon size={20} />
              </span>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My goal */}
      <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:p-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Target size={26} />
        </span>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold tracking-tight">My goal</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            My goal isn&apos;t to create the website with the most questions. It&apos;s to create
            the website that helps you pass faster, understand better, and remember longer.
          </p>
        </div>
      </div>

      {/* Who we are */}
      <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:flex-row sm:p-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Shield size={24} />
        </span>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold tracking-tight">Who we are</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
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
        <Mail size={32} className="hidden shrink-0 text-primary/30 sm:block" />
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
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
