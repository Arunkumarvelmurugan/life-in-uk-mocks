import type { MetadataRoute } from "next";
import { memoryTipsCategories } from "@/lib/memory-tips-data";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

// Only public, crawlable pages - /mock-tests and /account sit entirely behind
// sign-in (src/proxy.ts), so listing them would just send crawlers into a
// sign-in redirect.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/memory-tips`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...memoryTipsCategories.map((c) => ({
      url: `${SITE_URL}/memory-tips/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
