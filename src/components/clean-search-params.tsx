"use client";

import { useEffect } from "react";

/**
 * Strips the given query params from the visible URL after mount, without
 * a navigation/re-render (plain History API, not the Next.js router).
 * Used for one-shot banner triggers like ?signin=required that would
 * otherwise linger in the address bar forever after the condition clears.
 */
export function CleanSearchParams({ params }: { params: string[] }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    let changed = false;
    for (const p of params) {
      if (url.searchParams.has(p)) {
        url.searchParams.delete(p);
        changed = true;
      }
    }
    if (changed) {
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- params is a fresh array each render; only mount matters
  }, []);

  return null;
}
