import { CardReveal, RevealGroup } from "@/components/motion/Reveal";
import type { Project } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const featureFirst = projects.length % 2 === 1;
  return (
    <RevealGroup as="ul" className="grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20" stagger={0.12}>
      {projects.map((project, i) => {
        const wide = featureFirst && i === 0;
        return (
          <CardReveal key={project.slug} className={wide ? "md:col-span-2" : undefined}>
            <ProjectCard project={project} wide={wide} />
          </CardReveal>
        );
      })}
    </RevealGroup>
  );
}
