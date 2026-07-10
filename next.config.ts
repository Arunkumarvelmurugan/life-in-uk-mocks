import type { NextConfig } from "next";

// Report-only: violations are logged to the browser console, nothing is
// blocked. This is a diagnostic step before ever enforcing a real CSP —
// enforcing now would need per-request nonces threaded through proxy.ts
// for next-themes' anti-flash inline script, which we haven't set up yet.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.googleusercontent.com",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Blocks the whole site from being framed by another origin (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers guessing content types away from what we declare.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Sends full URL only to our own origin; just the origin to third parties.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // We don't use any of these browser features anywhere in the app.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
        ],
      },
    ];
  },
};

export default nextConfig;
