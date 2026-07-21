import Link from "next/link";
import Image from "next/image";
import { Mail, Headset, ArrowRight, Clock, Shield, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { ContactForm } from "@/components/contact-form";
import { MarketingContainer } from "@/components/marketing-container";
import { PageHeading } from "@/components/page-heading";
import { buttonClass, cardClass } from "@/lib/ui";

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
    <MarketingContainer className="py-16">
      {/* Hero */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <PageHeading eyebrow="We're here to help" title="Contact us">
          <p>
            Questions about a mock test, your Pass Guarantee claim, or billing? Send us a message
            and we&apos;ll get back to you as soon as possible.
          </p>

          <div className={cardClass({ padding: "sm", className: "mt-6 flex items-center gap-3 text-sm" })}>
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
        </PageHeading>

        <div className="mx-auto w-full max-w-md">
          <Image
            src="/contact-illustration.png"
            alt="An open envelope with a letter, next to a UK flag, Big Ben, and a potted plant"
            width={733}
            height={613}
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Form */}
      <div className={cardClass({ padding: "lg", className: "mt-12 rounded-panel" })}>
        <ContactForm defaultName={session?.user?.name ?? ""} defaultEmail={session?.user?.email ?? ""} />
      </div>

      {/* Need immediate help */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-panel border border-primary/20 bg-primary/5 p-6 sm:flex-row">
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
        <Link href="/faq" className={buttonClass("secondary", "md", "shrink-0")}>
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
    </MarketingContainer>
  );
}
