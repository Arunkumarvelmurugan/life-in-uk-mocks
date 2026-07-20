import { MarketingContainer } from "@/components/marketing-container";

type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };
type Section = { heading: string; blocks: Block[] };

const p = (text: string): Block => ({ type: "p", text });
const ul = (items: string[]): Block => ({ type: "ul", items });

const sections: Section[] = [
  {
    heading: "1. Who We Are",
    blocks: [
      p(`Life in UK Mocks ("Life in UK Mocks", "we", "us", "our") is an independent online platform providing mock tests to help users prepare for the official "Life in the UK" test. We are not affiliated with, endorsed by, or connected to the Home Office, UK Visas and Immigration, GOV.UK, or any other UK government department or agency.`),
      p(`This Privacy Policy explains what personal data we collect, why we collect it, how we use it, and the rights you have over it under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. It should be read alongside our Terms and Conditions.`),
    ],
  },
  {
    heading: "2. Personal Data We Collect",
    blocks: [
      p(`We collect the following categories of personal data:`),
      ul([
        "Account data - when you sign in with Google, we receive and store your Google account ID, email address, name, and profile picture. You can also set a separate display name.",
        "Test activity - your answers, scores, and progress on each mock test, so you can pick up where you left off and review past attempts.",
        "Payment data - if you purchase Premium or Lifetime Access, we store the plan, amount, currency, payment status, and Stripe reference identifiers (checkout session, payment intent, invoice, and subscription IDs). We never receive or store your full card details - these are handled entirely by Stripe, our PCI-compliant payment processor.",
        "Contact form submissions - your name, email address, the topic and content of your message, and (for a limited time, for abuse prevention) your IP address, if you use our Contact Us page.",
        "Technical data - standard web request information such as your IP address, browser type, and device information, processed transiently for security and to operate the Service.",
      ]),
    ],
  },
  {
    heading: "3. How We Use Your Personal Data",
    blocks: [
      p(`We use your personal data to:`),
      ul([
        "create and maintain your account, and keep you signed in;",
        "provide the Service, including saving and displaying your mock test progress and scores;",
        "process payments and manage your subscription, including renewals and cancellations;",
        "send transactional emails - for example, a welcome email when you sign up, and a payment confirmation when you make a purchase or your subscription renews;",
        "respond to messages you send via our Contact Us page;",
        "detect and prevent fraud, abuse, and unauthorised access;",
        "analyse test results in aggregated and anonymised form - for example, to identify which questions are most commonly answered incorrectly, to improve our content, or to publish general statistics. We will not publish this data in a way that identifies you personally without your consent.",
      ]),
      p(`We do not sell your personal data, and we do not use it for third-party advertising or targeted marketing.`),
    ],
  },
  {
    heading: "4. Legal Basis for Processing",
    blocks: [
      p(`We rely on the following legal bases under UK GDPR:`),
      ul([
        "Performance of a contract - to create your account, provide the Service, and process payments you request.",
        "Legitimate interests - to keep the Service secure, prevent abuse, understand aggregate usage patterns, and improve our content, in each case balanced against your rights and interests.",
        "Consent - where you voluntarily submit information via our Contact Us page, or where otherwise required by law.",
        "Legal obligation - where we need to retain payment records for accounting, tax, or regulatory purposes.",
      ]),
    ],
  },
  {
    heading: "5. Cookies and Similar Technologies",
    blocks: [
      p(`We use a small number of strictly necessary cookies to operate the Service - primarily to keep you signed in securely (via our authentication provider, Auth.js) and to protect against cross-site request forgery. These cookies are essential to the Service and cannot be switched off.`),
      p(`Your light/dark theme preference is stored in your browser's local storage, not a cookie, and never leaves your device.`),
      p(`With your consent, we use Google Analytics to understand how the Service is used and to improve it. Google Analytics sets analytics cookies (such as _ga and _ga_*) that are not strictly necessary and are only set after you accept them via the cookie banner shown on your first visit. You can withdraw or change your consent at any time using the "Cookie preferences" link in the footer, which removes these cookies and stops further analytics collection. We do not use any advertising or cross-site tracking cookies.`),
    ],
  },
  {
    heading: "6. How We Share Your Data",
    blocks: [
      p(`We share personal data only with the third-party service providers we rely on to run the Service, each acting as a data processor on our behalf:`),
      ul([
        "Google - to provide sign-in (Google OAuth). See Google's Privacy Policy.",
        "Stripe - to process payments and manage subscriptions. See Stripe's Privacy Policy.",
        "Supabase - to host our database and authentication infrastructure.",
        "Resend - to deliver transactional emails (welcome emails, payment confirmations, and contact form notifications).",
        "Google Analytics - to understand how the Service is used, only if you have accepted analytics cookies. See Google's Privacy Policy.",
      ]),
      p(`We do not share your personal data with any other third party for their own marketing purposes. We may disclose personal data if required to do so by law, regulation, or a valid request from a public authority.`),
    ],
  },
  {
    heading: "7. International Data Transfers",
    blocks: [
      p(`Some of our service providers may process data outside the UK. Where this occurs, we rely on their compliance with recognised safeguards, such as the UK's International Data Transfer Agreement (IDTA), EU Standard Contractual Clauses, or an equivalent adequacy decision, as applicable to that provider.`),
    ],
  },
  {
    heading: "8. Data Retention",
    blocks: [
      p(`We retain your account and test activity data for as long as your account remains active, so that your progress is preserved between visits. Payment records are retained for as long as required for accounting, tax, and legal purposes.`),
      p(`If you would like your account and associated personal data deleted, please contact us via the Contact Us page. We will action verified deletion requests within a reasonable time, except where we are required or permitted by law to retain certain records (for example, payment records for tax purposes).`),
    ],
  },
  {
    heading: "9. Your Rights Under UK GDPR",
    blocks: [
      p(`Subject to certain exemptions, you have the right to:`),
      ul([
        "access the personal data we hold about you;",
        "have inaccurate personal data corrected;",
        "request erasure of your personal data;",
        "restrict or object to certain processing;",
        "receive your data in a portable format;",
        "withdraw consent at any time, where processing is based on consent.",
      ]),
      p(`To exercise any of these rights, please contact us via the Contact Us page. You also have the right to lodge a complaint with the UK's supervisory authority, the Information Commissioner's Office (ICO), at ico.org.uk, if you believe we have not handled your personal data in accordance with the law.`),
    ],
  },
  {
    heading: "10. Children's Privacy",
    blocks: [
      p(`The Service is not directed at children under 13, and we do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, please contact us and we will take appropriate steps to remove it.`),
    ],
  },
  {
    heading: "11. Data Security",
    blocks: [
      p(`We use reasonable technical and organisational measures to protect your personal data, including encrypted connections (HTTPS), access-controlled database infrastructure, and reliance on PCI-compliant payment processing via Stripe so that we never handle your full card details directly. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.`),
    ],
  },
  {
    heading: "12. Changes to This Policy",
    blocks: [
      p(`We may update this Privacy Policy from time to time. Updated versions will be published on this page with a revised "last updated" date. Where changes are material, we will make reasonable efforts to notify you, for example via the website or by email. Your continued use of the Service after changes are published constitutes acceptance of the revised policy.`),
    ],
  },
  {
    heading: "13. Contact Us",
    blocks: [
      p(`If you have any questions about this Privacy Policy or how we handle your personal data, or wish to exercise any of your rights, please contact us via the Contact Us page or the support email address published on our website.`),
    ],
  },
];

export const metadata = {
  title: "Privacy Policy - Life in UK Mocks",
  description:
    "How Life in UK Mocks collects, uses, and protects your personal data, and your rights under UK GDPR.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <MarketingContainer className="py-16">
      {/* Long-form legal text, so it keeps a narrower prose width even
          inside the wider marketing container. */}
      <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Life in UK Mocks</p>
      <p className="mt-1 text-sm text-muted-foreground">Last updated: 15 July 2026</p>

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
