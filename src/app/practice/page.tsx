import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export default function PracticePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Breadcrumb items={[{ label: "Practice" }]} />
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Practice</h1>

      <Link
        href="/practice/mock-tests"
        className="flex max-w-sm items-center gap-4 rounded-xl border border-card-border bg-card p-6 shadow-sm transition-colors hover:border-primary"
      >
        <BookOpenCheck className="text-primary" size={28} />
        <div>
          <h2 className="font-semibold">Mock Tests</h2>
          <p className="text-sm text-muted-foreground">24 full practice tests</p>
        </div>
      </Link>
    </div>
  );
}
