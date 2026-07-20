import { cn } from "@/lib/utils";

// Wraps content on authenticated app pages (mock tests, account) and shared
// chrome (header, footer). No max-width - fills the viewport, padding only.
export function AppContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12", className)}>{children}</div>
  );
}
