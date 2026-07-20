import { cn } from "@/lib/utils";

// Wraps content on public marketing/content pages (home, pricing, about,
// contact, memory tips, faq, legal). Caps width well below the viewport on
// large monitors so text and cards don't sprawl edge to edge.
export function MarketingContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12", className)}>
      {children}
    </div>
  );
}
