import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Single owner of page-title styling: eyebrow badge, h1 size/weight, and the
// heading-to-intro gap - so pages stop each hand-rolling their own variant.
export function PageHeading({
  eyebrow,
  title,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={alignClass}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      )}
      <h1 className={cn("text-3xl font-semibold tracking-tight sm:text-4xl", eyebrow && "mt-4")}>
        {title}
      </h1>
      {children && <div className="mt-3 text-muted-foreground">{children}</div>}
    </div>
  );
}
