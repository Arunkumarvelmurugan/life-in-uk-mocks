import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingContainer } from "@/components/marketing-container";
import { PageHeading } from "@/components/page-heading";

type Block = { type: "p"; text: ReactNode } | { type: "ul"; items: string[] };
type Section = { heading: string; blocks: Block[] };

const p = (text: ReactNode): Block => ({ type: "p", text });
const ul = (items: string[]): Block => ({ type: "ul", items });

const sections: Section[] = [
  {
    heading: "1. Agreement to These Terms",
    blocks: [
      p(`Welcome to Life in UK Mocks ("Life in UK Mocks", "we", "us", "our", "Company").`),
      p(`These Terms and Conditions ("Terms") govern your access to and use of the Life in UK Mocks website and all related services (collectively, the "Service"). The Service is currently accessible via our website only; no mobile application is available at this time. If we launch a mobile app in future, these Terms will apply to it as well unless replaced by an updated version.`),
      p(
        <>
          By accessing or using the Service, creating an account, or purchasing any paid plan,
          you (&quot;User&quot;, &quot;you&quot;) confirm that you have read, understood, and agree
          to be legally bound by these Terms and our{" "}
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          . If you do not agree, you must not use the Service.
        </>
      ),
    ],
  },
  {
    heading: "2. About Our Service",
    blocks: [
      p(`Life in UK Mocks is an independent online platform providing mock tests to help users prepare informally for the official "Life in the UK" test, including instant scoring and a record of your past attempts. At present, the Service consists solely of mock test functionality; it does not include study guides, revision notes, or other study materials, though we may introduce these or other features in future.`),
      p(`We are not affiliated with, endorsed by, authorised by, or connected with the Home Office, UK Visas and Immigration, GOV.UK, or any other UK government department or agency.`),
    ],
  },
  {
    heading: "3. Educational Disclaimer",
    blocks: [
      p(`The mock tests on this website are designed solely for educational and revision purposes. The official Life in the UK Test questions are confidential and are not publicly released.`),
      p(`Our mock tests are independently created to reflect the general style, format, and level of difficulty of the official examination. We do not represent or guarantee that:`),
      ul([
        "any mock test question will appear in the official examination;",
        "our content is identical to the official test;",
        "completing our mock tests will result in you passing the official examination.",
      ]),
      p(`Your success in the official examination depends on your own preparation and performance.`),
    ],
  },
  {
    heading: "4. Intellectual Property",
    blocks: [
      p(`Unless otherwise stated, all content on the Service - including but not limited to mock test questions, explanations, software, website design, graphics, logos, databases, source code, text, and functionality - is owned by or licensed to us and is protected by copyright, trade mark, and other intellectual property laws. No ownership rights are transferred to users.`),
    ],
  },
  {
    heading: "5. Limited Licence",
    blocks: [
      p(`We grant you a limited, personal, non-exclusive, non-transferable, and revocable licence to use the Service solely for your own personal, non-commercial learning purposes.`),
      p(`You must not:`),
      ul([
        "copy, reproduce, or republish our mock tests or other content;",
        "scrape or systematically extract data from the website;",
        "redistribute or publish our questions elsewhere;",
        "create a competing product using our content;",
        "reverse engineer or attempt to access our source code;",
        "commercially exploit any part of the Service.",
      ]),
    ],
  },
  {
    heading: "6. Accounts",
    blocks: [
      p(`To access certain features you need to register an account. Registration is currently only available via Google Sign-In; we do not offer a separate email-and-password login. If we add other sign-in methods in future, these Terms will apply to them as well. You are responsible for:`),
      ul([
        "providing accurate and current information when registering;",
        "keeping your login credentials confidential and secure;",
        "all activity carried out under your account;",
        "notifying us promptly of any unauthorised use of your account.",
      ]),
      p(`We may suspend or terminate accounts that we reasonably believe are being used fraudulently, abusively, or in breach of these Terms.`),
    ],
  },
  {
    heading: "7. Your Answers and Usage Data",
    blocks: [
      p(
        <>
          We store information necessary to operate the Service, including your account details,
          mock test attempts, and progress. We may analyse this data in aggregated and anonymised
          form - for example, to identify which questions are most commonly answered incorrectly,
          to improve our content, or to publish general statistics or insights. We will not
          publish this data in a way that identifies you personally without your consent, and we
          do not sell it to third parties. Full details of how we collect, use, and protect your
          personal data are set out in our{" "}
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </>
      ),
    ],
  },
  {
    heading: "8. GDPR Guarantee",
    blocks: [
      p(`We are committed to handling your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Subject to certain legal exemptions, you have the right to:`),
      ul([
        "request access to the personal data we hold about you;",
        "request correction of inaccurate or incomplete data;",
        "request erasure of your personal data;",
        "request restriction of, or object to, certain processing;",
        "request a portable copy of your data in a structured, machine-readable format.",
      ]),
      p(
        <>
          To exercise any of these rights, contact us via our{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact Us
          </Link>{" "}
          page or by emailing{" "}
          <a
            href="mailto:support@lifeinukmocks.co.uk"
            className="font-medium text-primary hover:underline"
          >
            support@lifeinukmocks.co.uk
          </a>
          . We will respond to verified requests within one calendar month, as required by law.
          You also have the right to lodge a complaint with the UK&apos;s supervisory authority,
          the Information Commissioner&apos;s Office (ICO), at ico.org.uk. Full details of what
          data we collect, why, and how we protect it are set out in our{" "}
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </>
      ),
    ],
  },
  {
    heading: "9. Prohibited Activities",
    blocks: [
      p(`You agree not to:`),
      ul([
        "use the Service for any unlawful or fraudulent purpose;",
        "interfere with the operation or security of the website;",
        "attempt to gain unauthorised access to the Service, its servers, or connected networks;",
        "use automated software, bots, or scripts to access or extract content;",
        "copy, resell, sublicense, or distribute any part of the Service;",
        "share paid account access with others;",
        "upload or transmit malicious software, viruses, or anything unlawful or harmful;",
        "impersonate any person or entity, or misrepresent your affiliation with any person or entity.",
      ]),
      p(`We reserve the right to investigate suspected breaches and to suspend or permanently terminate any account that violates these Terms, restrict functionality, or take other action we consider appropriate, at our sole discretion, without prior notice.`),
    ],
  },
  {
    heading: "10. Payments",
    blocks: [
      p(`Some features of the Service may require a paid subscription or one-off purchase. Payments are securely processed by third-party payment providers, including Stripe. By purchasing a subscription or plan, you authorise the payment provider to charge your selected payment method. Subscription prices, billing periods, and available plans will be clearly displayed before you complete a purchase.`),
    ],
  },
  {
    heading: "11. Subscription Renewal and Cancellation",
    blocks: [
      p(`Subscriptions renew automatically for successive billing periods unless cancelled before the renewal date. You may cancel at any time via your account settings or the payment provider's billing portal. Cancellation stops future renewals but does not refund payments already made, and does not entitle you to a partial refund for the current billing period - you will retain access until the end of the period already paid for.`),
    ],
  },
  {
    heading: "12. Refund Policy",
    blocks: [
      p(`Unless required by applicable consumer law, all purchases are final and non-refundable once processing has begun. As access to paid digital content is provided immediately upon payment, you acknowledge that you may lose your statutory 14-day cancellation right in respect of that content once access has begun, in accordance with the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013. Refunds outside of this policy may be granted entirely at our discretion. Nothing in this clause affects any statutory right you may have to a refund, repair, or replacement under consumer protection law in your country of residence.`),
    ],
  },
  {
    heading: "13. Third-Party Services",
    blocks: [
      p(`Our website uses third-party services, including payment processing (Stripe), authentication (Google Sign-In), transactional email delivery (Resend), and, only if you consent via our cookie banner, analytics (Google Analytics). We are not responsible for the availability, security, or policies of these third-party services. Your use of them is subject to their own terms and privacy policies.`),
    ],
  },
  {
    heading: "14. Disclaimer of Warranties",
    blocks: [
      p(`The Service is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, we disclaim all warranties of any kind, whether express or implied, including but not limited to accuracy, completeness, reliability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, timely, secure, or error-free, or that any defects will be corrected.`),
    ],
  },
  {
    heading: "15. Limitation of Liability",
    blocks: [
      p(`To the fullest extent permitted by applicable law, we shall not be liable for:`),
      ul([
        "your failure to pass the official Life in the UK Test, or any other assessment;",
        "any indirect, incidental, special, consequential, or punitive damages;",
        "loss of profits, revenue, business, goodwill, or data;",
        "interruptions to the Service or technical failures beyond our reasonable control.",
      ]),
      p(`Where liability cannot legally be excluded, our total aggregate liability to you for any claim arising out of or relating to the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or £50, whichever is greater.`),
      p(`Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot lawfully be excluded or limited under English law.`),
    ],
  },
  {
    heading: "16. Indemnity",
    blocks: [
      p(`You agree to indemnify and hold us, our directors, employees, and agents harmless from any claim, demand, loss, or liability (including reasonable legal fees) arising out of your breach of these Terms, your misuse of the Service, or your violation of any law or third-party right.`),
    ],
  },
  {
    heading: "17. Website Availability and Modifications",
    blocks: [
      p(`We aim to keep the Service available at all times but do not guarantee uninterrupted access. We may change, suspend, or discontinue any part of the Service, including content, features, or pricing, at any time and without notice or liability to you, for maintenance, security, technical issues, or other operational reasons.`),
    ],
  },
  {
    heading: "18. Suspension and Termination",
    blocks: [
      p(`We may suspend or terminate your account without notice if you breach these Terms, misuse the Service, commit fraud, or infringe our intellectual property rights. Termination does not affect any outstanding payment obligations. You may stop using the Service and close your account at any time.`),
    ],
  },
  {
    heading: "19. Changes to These Terms",
    blocks: [
      p(`We may amend these Terms at any time. Updated Terms will be published on this page, and where changes are material we will make reasonable efforts to notify you (for example, via the website or by email). Your continued use of the Service after changes are published constitutes acceptance of the revised Terms. You are responsible for reviewing these Terms periodically.`),
    ],
  },
  {
    heading: "20. Governing Law and Disputes",
    blocks: [
      p(`These Terms are governed by and construed in accordance with the laws of England and Wales. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales, save that if you are a consumer resident elsewhere in the UK, you may also be entitled to bring proceedings in your local courts under mandatory consumer protection law.`),
      p(`Before initiating any formal legal action, you agree to first contact us and allow a reasonable period (at least 4 weeks) to resolve the matter informally.`),
    ],
  },
  {
    heading: "21. Severability",
    blocks: [
      p(`If any provision of these Terms is found invalid or unenforceable by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.`),
    ],
  },
  {
    heading: "22. Who We Are and How to Contact Us",
    blocks: [
      p(`Life in UK Mocks is operated by Arunkumar Velmurugan, trading as Life in UK Mocks.`),
      p(
        <>
          If you have any questions about these Terms or our{" "}
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          , please contact us via our{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact Us
          </Link>{" "}
          page or by email at{" "}
          <a
            href="mailto:support@lifeinukmocks.co.uk"
            className="font-medium text-primary hover:underline"
          >
            support@lifeinukmocks.co.uk
          </a>
          .
        </>
      ),
    ],
  },
];

export const metadata = {
  title: "Terms and Conditions",
  description:
    "The terms and conditions governing your use of Life in UK Mocks, including plans, payments, refunds, and account rules.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <MarketingContainer className="py-16">
      {/* Long-form legal text, so it keeps a narrower prose width even
          inside the wider marketing container. */}
      <div className="mx-auto max-w-3xl">
      <PageHeading title="Terms and Conditions">
        <p>Life in UK Mocks</p>
        <p className="mt-1 text-sm">Last updated: 7 July 2026</p>
      </PageHeading>

      <div className="mt-10 flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-lg font-semibold tracking-tight">{section.heading}</h2>
            <div className="flex flex-col gap-3">
              {section.blocks.map((block, i) =>
                block.type === "p" ? (
                  <p key={i} className="text-sm leading-relaxed text-foreground/80">
                    {block.text}
                  </p>
                ) : (
                  <ul key={i} className="flex flex-col gap-1.5 pl-5 text-sm leading-relaxed text-foreground/80">
                    {block.items.map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </section>
        ))}
      </div>
      </div>
    </MarketingContainer>
  );
}
