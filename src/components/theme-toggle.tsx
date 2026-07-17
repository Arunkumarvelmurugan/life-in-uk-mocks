"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-card-border bg-card text-foreground transition-colors hover:bg-muted"
    >
      {/* next-themes sets the "dark" class on <html> synchronously before
          first paint, so both icons can render immediately and let CSS
          pick the right one - no waiting on React state/hydration like the
          old mounted-gate approach did (that's what caused the late pop-in). */}
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="dark:hidden" />
    </button>
  );
}
