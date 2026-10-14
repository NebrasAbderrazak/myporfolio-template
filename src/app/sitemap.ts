import type { MetadataRoute } from "next";
import { getProjects, getUpdates } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();
  const latestUpdate = getUpdates(1)[0]?.date;
  const latestProject = projects[0]?.date;
  const newest = [latestUpdate, latestProject].filter(Boolean).sort().pop();

  return [
    { url: absoluteUrl("/"), lastModified: newest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/work/"), lastModified: latestProject, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/updates/"), lastModified: latestUpdate, changeFrequency: "weekly", priority: 0.6 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/work/${p.slug}/`),
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
