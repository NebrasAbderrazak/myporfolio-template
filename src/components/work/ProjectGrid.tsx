import { CardReveal, RevealGroup } from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";
import type { Project } from "@/lib/content";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ projects, t }: { projects: Project[]; t: Dictionary["work"] }) {
  const featureFirst = projects.length % 2 === 1;
  return (
    <RevealGroup as="ul" className="grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20" stagger={0.12}>
      {projects.map((project, i) => {
        const wide = featureFirst && i === 0;
        return (
          <CardReveal key={project.slug} className={wide ? "md:col-span-2" : undefined}>
            <ProjectCard project={project} t={t} wide={wide} />
          </CardReveal>
        );
      })}
    </RevealGroup>
  );
}
