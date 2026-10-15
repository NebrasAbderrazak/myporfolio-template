import type { MetadataRoute } from "next";
import { getProjects } from "@/content/projects";
import { absoluteUrl } from "@/content/settings";
import { getUpdates } from "@/content/updates";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();
  const latestUpdate = getUpdates()[0]?.date;
  const latestProject = projects[0]?.date;
  const newest = [latestUpdate, latestProject].filter(Boolean).sort().pop();

  return [
    { url: absoluteUrl("/"), lastModified: newest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/work/"), lastModified: latestProject, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/updates/"), lastModified: latestUpdate, changeFrequency: "weekly", priority: 0.6 },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}/`),
      lastModified: project.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
