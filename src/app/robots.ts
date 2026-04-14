import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/chat",
          "/visa-bulletin",
          "/cost-calculator",
          "/pricing",
          "/attorneys",
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
