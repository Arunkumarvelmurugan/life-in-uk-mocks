import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { MarketingContainer } from "@/components/marketing-container";

type FAQItem = {
  question: string;
  /** Rendered on the page - can include links and lists. */
  answer: ReactNode;
  /** Plain-text version for the FAQPage JSON-LD schema (no markup). */
  plainAnswer: string;
};
type FAQCategory = { name: string; items: FAQItem[] };

/** Most answers are plain text with no links/lists - same string for both the visible page and JSON-LD. */
function faq(question: string, text: string): FAQItem {
  return { question, answer: text, plainAnswer: text };
}

const categories: FAQCategory[] = [
  {
    name: "General",
    items: [
      faq(
        "What is Life in UK Mocks?",
        "Life in UK Mocks is an online practice platform designed to help you prepare for the official Life in the UK Test. Our platform provides realistic mock tests, detailed explanations, memory tips, and progress tracking to help you study with confidence."
      ),
      faq(
        "Is this the official Life in the UK Test?",
        "No. Life in UK Mocks is an independent practice platform and is not affiliated with or endorsed by the UK Government or GOV.UK. Our goal is to help you prepare for the official test through realistic practice questions and study resources."
      ),
      {
        question: "Who is this platform for?",
        answer: (
          <>
            <p>
              Life in UK Mocks is suitable for anyone preparing for the official Life in the UK
              Test, including applicants for:
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>British Citizenship</li>
              <li>Indefinite Leave to Remain (ILR)</li>
              <li>Settlement in the UK</li>
            </ul>
          </>
        ),
        plainAnswer:
          "Life in UK Mocks is suitable for anyone preparing for the official Life in the UK Test, including applicants for: British Citizenship, Indefinite Leave to Remain (ILR), and Settlement in the UK.",
      },
      faq(
        "Can I use the website on my mobile phone?",
        "Yes. Life in UK Mocks works on desktop computers, tablets, and smartphones."
      ),
    ],
  },
  {
    name: "Practice Tests",
    items: [
      faq(
        "How many mock tests are available?",
        "The platform currently offers 17 full-length mock tests, each designed to reflect the format and difficulty of the official Life in the UK Test."
      ),
      faq(
        "How many questions are in each mock test?",
        "Each mock test contains 24 multiple-choice questions, matching the format of the official test."
      ),
      faq(
        "What is the pass mark?",
        "To pass the official Life in the UK Test, you need to answer 18 out of 24 questions correctly (75%)."
      ),
      {
        question: "What is the Pass Guarantee, and how do I qualify?",
        answer: (
          <>
            <p>
              If you complete our full study plan and still don&apos;t pass, we&apos;ll refund
              your Lifetime Access payment in full. To qualify, you must:
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>Have Lifetime Access (the Pass Guarantee isn&apos;t included with Premium).</li>
              <li>Complete all 17 mock tests.</li>
              <li>Achieve a score of 75% or higher on each mock test.</li>
              <li>Take your official Life in the UK Test within 60 days of completing the mock tests.</li>
            </ul>
            <p className="mt-2">
              See the full{" "}
              <Link href="/#guarantee" className="font-medium text-primary hover:underline">
                Pass Guarantee details
              </Link>{" "}
              for how to claim it.
            </p>
          </>
        ),
        plainAnswer:
          "If you complete our full study plan and still don't pass, we'll refund your Lifetime Access payment in full. To qualify, you must: have Lifetime Access (the Pass Guarantee isn't included with Premium), complete all 17 mock tests, achieve a score of 75% or higher on each mock test, and take your official Life in the UK Test within 60 days of completing the mock tests.",
      },
      faq(
        "Are the questions similar to the official test?",
        "Our mock tests are designed to reflect the style, structure, and topics of the official Life in the UK Test to help you prepare effectively. While no practice platform can reproduce the exact official exam questions, our aim is to provide realistic and comprehensive practice."
      ),
      faq(
        "Can I retake mock tests?",
        "Yes. You can take each mock test as many times as you like to improve your knowledge and confidence."
      ),
      faq(
        "Will I see explanations for each answer?",
        "Yes. Every question includes a detailed explanation so you can understand why the correct answer is right."
      ),
      faq(
        "What are Memory Tips?",
        "Memory Tips are short learning aids designed to help you remember key facts more easily. They complement the explanations by highlighting useful associations and revision techniques."
      ),
      faq(
        "Does the platform track my progress?",
        "Yes. Your progress, completed mock tests, and performance are saved to your account so you can monitor your improvement over time."
      ),
    ],
  },
  {
    name: "Premium Membership",
    items: [
      {
        question: "What's included with Premium?",
        answer: (
          <>
            <p>Premium members receive access to:</p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>All mock tests</li>
              <li>Detailed explanations</li>
              <li>Memory Tips</li>
              <li>Progress tracking</li>
              <li>Pass Guarantee progress</li>
              <li>Future premium learning features as they are released</li>
            </ul>
          </>
        ),
        plainAnswer:
          "Premium members receive access to: all mock tests, detailed explanations, Memory Tips, progress tracking, Pass Guarantee progress, and future premium learning features as they are released.",
      },
      faq(
        "Is there a free version?",
        "Yes. You can access selected features and sample content for free before deciding whether to upgrade."
      ),
      faq(
        "How long does my access last?",
        "It depends on the plan. Premium is a subscription that renews automatically every 30 days, so access continues for as long as your subscription is active. Lifetime Access is a one-time payment - once purchased, you keep full access permanently, with no renewals."
      ),
      faq(
        "Can I cancel my subscription?",
        "Yes. You can cancel your subscription at any time. Your Premium access will continue until the end of your current billing period."
      ),
      faq(
        "Will I lose my progress if I cancel?",
        "No. Your account and progress remain saved. However, Premium-only features become unavailable once your subscription ends."
      ),
    ],
  },
  {
    name: "Payments",
    items: [
      faq(
        "How are payments processed?",
        "Payments are securely processed by Stripe, one of the world's leading payment providers. We do not store your payment card details."
      ),
      faq(
        "Which payment methods are accepted?",
        "Payment methods available depend on your location and are displayed securely during Stripe Checkout."
      ),
      {
        question: "Can I get a refund?",
        answer: (
          <>
            Please refer to our{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              Refund Policy
            </Link>{" "}
            for full details. If you believe you&apos;ve been charged in error or have another
            billing issue,{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              contact us
            </Link>{" "}
            and we&apos;ll review your request.
          </>
        ),
        plainAnswer:
          "Please refer to our Refund Policy (in the Terms and Conditions) for full details. If you believe you've been charged in error or have another billing issue, contact us and we'll review your request.",
      },
    ],
  },
  {
    name: "Account",
    items: [
      faq(
        "Do I need an account?",
        "Yes. An account is required to save your progress, track completed tests, and access Premium features."
      ),
      faq("How do I sign in?", "You can sign in securely using your Google account."),
      {
        question: "Can I delete my account?",
        answer: (
          <>
            Yes. If you would like your account removed, please contact our support team.
            We&apos;ll process your request in accordance with our{" "}
            <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            and any legal obligations.
          </>
        ),
        plainAnswer:
          "Yes. If you would like your account removed, please contact our support team. We'll process your request in accordance with our Privacy Policy and any legal obligations.",
      },
    ],
  },
  {
    name: "Technical Support",
    items: [
      {
        question: "I haven't received my email.",
        answer: (
          <>
            Please check your Spam or Junk folder first. If you still haven&apos;t received it,
            contact us at{" "}
            <a
              href="mailto:support@lifeinukmocks.co.uk"
              className="font-medium text-primary hover:underline"
            >
              support@lifeinukmocks.co.uk
            </a>
            .
          </>
        ),
        plainAnswer:
          "Please check your Spam or Junk folder first. If you still haven't received it, contact us at support@lifeinukmocks.co.uk.",
      },
      faq(
        "The website isn't working properly.",
        "Try refreshing the page or using the latest version of Chrome, Edge, Safari, or Firefox. If the issue continues, contact our support team with details of the problem."
      ),
      {
        question: "How can I contact support?",
        answer: (
          <>
            You can contact us through our{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Contact Us
            </Link>{" "}
            page or email{" "}
            <a
              href="mailto:support@lifeinukmocks.co.uk"
              className="font-medium text-primary hover:underline"
            >
              support@lifeinukmocks.co.uk
            </a>
            .
          </>
        ),
        plainAnswer:
          "You can contact us through our Contact Us page or email support@lifeinukmocks.co.uk.",
      },
    ],
  },
  {
    name: "Legal",
    items: [
      {
        question: "Is my personal information safe?",
        answer: (
          <>
            Yes. We take appropriate measures to protect your personal information. Please see
            our{" "}
            <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            for details about how your data is collected, used, and protected.
          </>
        ),
        plainAnswer:
          "Yes. We take appropriate measures to protect your personal information. Please see our Privacy Policy for details about how your data is collected, used, and protected.",
      },
      faq(
        "Are my payment details stored?",
        "No. Payment card details are handled securely by Stripe and are never stored on our servers."
      ),
    ],
  },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Life in UK Mocks",
  description:
    "Answers to common questions about Life in UK Mocks - practice tests, Premium membership, payments, accounts, and support.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.plainAnswer,
        },
      }))
    ),
  };

  return (
    <MarketingContainer className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Long-form Q&A content, so it keeps a narrower prose width even
          inside the wider marketing container. */}
      <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        Answers to common questions about Life in UK Mocks.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {categories.map((category) => (
          <section key={category.name}>
            <h2 className="mb-3 text-lg font-semibold tracking-tight">{category.name}</h2>
            <div className="flex flex-col gap-2">
              {category.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-card-border bg-card p-4 open:pb-4"
                >
                  <summary className="cursor-pointer list-none font-medium marker:content-none">
                    <span className="flex items-center justify-between gap-3">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <div className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      </div>
    </MarketingContainer>
  );
}
