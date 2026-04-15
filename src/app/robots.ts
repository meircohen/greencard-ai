import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.bigcohen.org";
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/assessment",
          "/pricing",
          "/guides",
          "/contact",
          "/login",
          "/signup",
        ],
        disallow: [
          "/dashboard",
          "/cases",
          "/documents",
          "/settings",
          "/admin",
          "/api",
          "/onboarding",
          "/notifications",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
