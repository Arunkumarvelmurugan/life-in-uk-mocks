"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>
            Life in UK Mocks is temporarily unavailable
          </h1>
          <p style={{ color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
            Something went wrong loading the app. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              background: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
