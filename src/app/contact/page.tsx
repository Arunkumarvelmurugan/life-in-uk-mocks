import { Mail } from "lucide-react";
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

export default async function ContactPage() {
  const session = await auth();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Contact us</h1>
      <p className="mt-3 text-muted-foreground">
        Questions about a mock test, your Pass Guarantee claim, or billing? Send us a message and
        we&apos;ll get back to you.
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Mail size={16} className="shrink-0" />
        Or email us directly at{" "}
        <a href="mailto:support@lifeinukmocks.co.uk" className="font-medium text-primary hover:underline">
          support@lifeinukmocks.co.uk
        </a>
      </div>

      <div className="mt-10 rounded-2xl border border-card-border bg-card p-8 shadow-sm">
        <ContactForm defaultName={session?.user?.name ?? ""} defaultEmail={session?.user?.email ?? ""} />
      </div>
    </div>
  );
}
