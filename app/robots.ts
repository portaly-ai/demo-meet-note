import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).trim();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/notes",
          "/settings",
          "/share/", // 分享連結是私有的，不該被搜尋引擎索引
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
