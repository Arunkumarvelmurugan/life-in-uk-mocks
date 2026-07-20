import Link from "next/link";
import { CookiePreferencesButton } from "@/components/cookie-consent";
import { AppContainer } from "@/components/app-container";

const linkClasses = "text-muted-foreground hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="border-t border-card-border bg-muted">
      <AppContainer className="py-12">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex shrink-0 items-center whitespace-nowrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
              <img src="/logo-header.svg" alt="Life in UK Mocks" className="h-8 w-auto dark:hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
              <img
                src="/logo-header-dark.svg"
                alt="Life in UK Mocks"
                className="hidden h-8 w-auto dark:block"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The smart way to prepare for the Life in the UK Test. Practice smart, remember
              better, pass with confidence.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Product</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/mock-tests" className={linkClasses}>
                  Mock Tests
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className={linkClasses}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#guarantee" className={linkClasses}>
                  Pass Guarantee
                </Link>
              </li>
              <li>
                <Link href="/memory-tips" className={linkClasses}>
                  Memory Tips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Resources</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/about" className={linkClasses}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className={linkClasses}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClasses}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Legal</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/terms" className={linkClasses}>
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={linkClasses}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#guarantee" className={linkClasses}>
                  Refund Policy
                </Link>
              </li>
              <li>
                <CookiePreferencesButton />
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Support</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm">
              <li>
                <a href="mailto:support@lifeinukmocks.co.uk" className={linkClasses}>
                  support@lifeinukmocks.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-card-border pt-6 text-center text-sm text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} Life in UK Mocks. Independent practice resource - not
          affiliated with the UK government.
        </p>
      </AppContainer>
    </footer>
  );
}
