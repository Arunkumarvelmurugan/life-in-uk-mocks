import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsentProvider } from "@/components/cookie-consent";
import { Analytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://lifeinukmocks.co.uk";
const OG_TITLE = "Pass the Life in the UK Test 2026";
const OG_DESCRIPTION =
  "17 realistic mock tests with full explanations, memory tips and quick rules to help you pass first time.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pass the Life in the UK Test 2026 | 17 Mocks + Memory Tips",
    template: "%s | Life in UK Mocks",
  },
  description:
    "17 realistic Life in the UK Test mocks with full explanations for every answer, plus memory tips and quick rules to help you pass first time. Start free.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Life in UK Mocks",
    url: SITE_URL,
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: "/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Life in UK Mocks - 17 practice tests for the Life in the UK Test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ["/og-image-v2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CookieConsentProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </ThemeProvider>
          <Analytics />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
