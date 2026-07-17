"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useCookieConsent } from "@/components/cookie-consent";

/** Only loads Google Analytics once the visitor has accepted analytics cookies. */
export function Analytics() {
  const { status } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (status !== "accepted" || !gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
