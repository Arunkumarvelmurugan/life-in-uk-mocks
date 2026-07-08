import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max,
  variant = "success",
  className,
}: {
  value: number;
  max: number;
  variant?: "success" | "danger" | "primary";
  className?: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  const fillClass = {
    success: "bg-success",
    danger: "bg-danger",
    primary: "bg-primary",
  }[variant];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all duration-300", fillClass)} style={{ width: `${pct}%` }} />
    </div>
  );
}
