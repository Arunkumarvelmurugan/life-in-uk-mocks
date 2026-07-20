import Link from "next/link";
import { Mail, Headset, ArrowRight, Clock, Shield, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact us - Life in UK Mocks",
  description:
    "Get in touch about mock tests, your Pass Guarantee claim, billing, or anything else - we usually reply within one business day.",
  alternates: {
    canonical: "/contact",
  },
};

const trustPoints = [
  {
    icon: Clock,
    title: "Our response time",
    description: "We aim to respond to all messages within 24 hours (usually much faster).",
  },
  {
    icon: Shield,
    title: "Your privacy matters",
    description: "We respect your privacy - your information is never sold or shared for marketing purposes.",
  },
  {
    icon: CheckCircle2,
    title: "Here to support you",
    description: "Our team is dedicated to helping you pass the Life in the UK Test with confidence.",
  },
];

export default async function ContactPage() {
  const session = await auth();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      {/* Hero */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Mail size={12} />
            We&apos;re here to help
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Contact us</h1>
          <p className="mt-4 text-muted-foreground">
            Questions about a mock test, your Pass Guarantee claim, or billing? Send us a message
            and we&apos;ll get back to you as soon as possible.
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-card-border bg-card px-4 py-3 text-sm shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail size={16} />
            </span>
            <span className="text-muted-foreground">
              Or email us directly at{" "}
              <a
                href="mailto:support@lifeinukmocks.co.uk"
                className="font-medium text-primary hover:underline"
              >
                support@lifeinukmocks.co.uk
              </a>
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-6 rounded-full bg-primary/5" />
          <span className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl sm:h-40 sm:w-40">
            <Mail size={56} />
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="mt-12 rounded-2xl border border-card-border bg-card p-8 shadow-sm">
        <ContactForm defaultName={session?.user?.name ?? ""} defaultEmail={session?.user?.email ?? ""} />
      </div>

      {/* Need immediate help */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Headset size={20} />
          </span>
          <div>
            <p className="font-semibold">Need immediate help?</p>
            <p className="text-sm text-muted-foreground">
              Check our FAQ section - you might find the answer you&apos;re looking for.
            </p>
          </div>
        </div>
        <Link
          href="/faq"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-card-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          View FAQ
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Trust points */}
      <div className="mt-12 grid grid-cols-1 gap-8 border-t border-card-border pt-10 sm:grid-cols-3">
        {trustPoints.map((point) => (
          <div
            key={point.title}
            className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <point.icon size={20} />
            </span>
            <p className="font-semibold">{point.title}</p>
            <p className="text-sm text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
