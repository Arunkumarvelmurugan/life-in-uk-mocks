import { cn } from "@/lib/utils";

// Shared className builders so every button/card in the app pulls from one
// place instead of each page hand-rolling its own radius/padding/shadow.

const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn font-medium transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const BUTTON_VARIANT = {
  primary: "bg-primary text-primary-foreground",
  secondary: "border border-card-border bg-card text-foreground",
  ghost: "text-foreground/80 hover:bg-muted",
} as const;

const BUTTON_SIZE = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT;
export type ButtonSize = keyof typeof BUTTON_SIZE;

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className);
}

const CARD_PADDING = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export type CardPadding = keyof typeof CARD_PADDING;

export function cardClass(opts?: { padding?: CardPadding; raised?: boolean; className?: string }) {
  const { padding = "md", raised = false, className } = opts ?? {};
  return cn(
    "rounded-card border border-card-border bg-card",
    CARD_PADDING[padding],
    raised && "shadow-raised",
    className
  );
}
