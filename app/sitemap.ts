import type { MetadataRoute } from "next";
import { services, siteUrl } from "./site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, priority: 1, changeFrequency: "weekly" },
    ...services.map((service) => ({
      url: `${siteUrl}/${service.slug}`,
      lastModified: now,
      priority: service.slug === "remont-kommercheskih-pomeshcheniy-spb" ? 0.9 : 0.82,
      changeFrequency: "monthly" as const,
    })),
    { url: `${siteUrl}/zavershit-remont-posle-podryadchika`, lastModified: now, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/remont-po-dizayn-proektu-spb`, lastModified: now, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/projects/neva-haus`, lastModified: now, priority: 0.75, changeFrequency: "monthly" as const },
  ];
}
