import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://meetnote-ai.vercel.app"
).trim();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: `${SITE_URL}/pricing`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/example`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/changelog`, lastModified: now, priority: 0.6, changeFrequency: "weekly" },
    { url: `${SITE_URL}/legal/privacy`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${SITE_URL}/legal/terms`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${SITE_URL}/sign-in`, lastModified: now, priority: 0.4, changeFrequency: "yearly" },
    { url: `${SITE_URL}/sign-up`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
  ];
  return routes;
}
