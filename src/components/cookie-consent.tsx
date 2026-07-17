"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

type ConsentStatus = "accepted" | "rejected" | null;

const STORAGE_KEY = "cookie-consent";

interface CookieConsentContextValue {
  /** null both before the localStorage read completes and when no choice has been made yet. */
  status: ConsentStatus;
  loaded: boolean;
  accept: () => void;
  reject: () => void;
  /** Re-opens the banner so a visitor can change their mind - used by the footer link. */
  reset: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  // status and loaded are read together from localStorage in one effect, so
  // there's a single setState call to reconcile with React's effect rules -
  // localStorage isn't available during SSR, so this can only happen after mount.
  const [{ status, loaded }, setState] = useState<{ status: ConsentStatus; loaded: boolean }>({
    status: null,
    loaded: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable client-side, so this has to run after mount
    setState({ status: stored === "accepted" || stored === "rejected" ? stored : null, loaded: true });
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setState({ status: "accepted", loaded: true });
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setState({ status: "rejected", loaded: true });
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setState({ status: null, loaded: true });
  }

  return (
    <CookieConsentContext.Provider value={{ status, loaded, accept, reject, reset }}>
      {children}
      {loaded && status === null && <CookieConsentBanner />}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}

function CookieConsentBanner() {
  const { accept, reject } = useCookieConsent();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-card-border bg-card px-6 py-4 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-foreground/80">
          We use analytics cookies to understand how the site is used and improve it. See our{" "}
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          for details. You can change your choice at any time from the footer.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={reject}
            className="cursor-pointer rounded-lg border border-card-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesButton() {
  const { reset } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={reset}
      className="cursor-pointer font-medium text-primary hover:underline"
    >
      Cookie preferences
    </button>
  );
}
