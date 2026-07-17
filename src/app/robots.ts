import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /practice and /account sit entirely behind sign-in (src/proxy.ts) -
      // an anonymous crawler only ever gets redirected to /?signin=required.
      disallow: ["/practice", "/account", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
