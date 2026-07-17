"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg text-danger">
        <AlertTriangle size={28} />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 text-muted-foreground">
        We hit a snag loading this page. This has been logged - please try again, and if it keeps
        happening, let us know via the Contact page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <RotateCcw size={16} />
          Try again
        </button>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border border-card-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          <Home size={16} />
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
