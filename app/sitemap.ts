import type { MetadataRoute } from "next";

const BASE_URL = "https://accessmate.vrajvithalani.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
