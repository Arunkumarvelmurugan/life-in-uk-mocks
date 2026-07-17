import Link from "next/link";
import { SearchX, Home, ClipboardList } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX size={28} />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Home size={16} />
          Back to home
        </Link>
        <Link
          href="/mock-tests"
          className="flex items-center gap-1.5 rounded-lg border border-card-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          <ClipboardList size={16} />
          Mock Tests
        </Link>
      </div>
    </div>
  );
}
