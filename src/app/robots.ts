import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/assessment",
          "/pricing",
          "/attorneys",
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
        ],
      },
    ],
    sitemap: "https://greencard.ai/sitemap.xml",
  };
}
