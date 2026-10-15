import { getProject, getProjects } from "@/content/projects";
import { OG_SIZE, projectOgImage } from "@/lib/og";

export const alt = "Case study cover";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  return projectOgImage(project ?? { title: "Case study", year: "", tags: [], cover: undefined });
}
