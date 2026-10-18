import { CardReveal } from "@/components/motion/Reveal";
import type { Project } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const featureFirst = projects.length % 2 === 1;
  // Cards in the right-hand column enter slightly after their neighbour on the left.
  const column = (index: number) => (featureFirst ? index - 1 : index) % 2;
  return (
    <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20">
      {projects.map((project, i) => {
        const wide = featureFirst && i === 0;
        return (
          <CardReveal key={project.slug} className={wide ? "md:col-span-2" : undefined} delay={wide ? 0 : column(i) * 0.12}>
            <ProjectCard project={project} wide={wide} />
          </CardReveal>
        );
      })}
    </ul>
  );
}
