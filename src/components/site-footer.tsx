import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-card-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact us
          </Link>
          <Link href="/faq" className="font-medium text-primary hover:underline">
            FAQ
          </Link>
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms and Conditions
          </Link>
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>
        <p>
          © {new Date().getFullYear()} Life in UK Mocks. Independent practice resource - not
          affiliated with the UK government.
        </p>
      </div>
    </footer>
  );
}
