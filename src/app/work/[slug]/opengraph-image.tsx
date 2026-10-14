import { getProject, getProjects } from "@/lib/content";
import { OG_SIZE, projectOgImage } from "@/lib/og";

export const alt = "Case study cover";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return projectOgImage(
    project ?? { title: "Case study", year: "", tags: [] },
  );
}
