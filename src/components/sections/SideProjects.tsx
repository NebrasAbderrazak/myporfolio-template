import { CardReveal } from "@/components/motion/Reveal";
import { MaskWords } from "@/components/motion/MaskWords";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { Project } from "@/content/projects";
import type { SideProjectsPage } from "@/content/schema";
import { SectionHeading } from "./SectionHeading";

export function SideProjects({ content, projects }: { content: SideProjectsPage; projects: Project[] }) {
  return (
    <section id="side-projects" aria-labelledby="side-projects-title" className="shell pt-32 md:pt-52">
      <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-8">
          <SectionHeading id="side-projects-title" title={content.title} align="left" />
        </div>
        {content.intro && (
          <div className="md:col-span-4">
            <MaskWords text={content.intro} delay={0.15} className="max-w-sm text-[1.05rem] text-ink-soft md:ml-auto" />
          </div>
        )}
      </div>

      <ul className="mt-12 grid gap-x-8 gap-y-14 md:mt-16 md:grid-cols-2 md:gap-y-20">
        {projects.map((project, i) => (
          <CardReveal key={project.slug} delay={(i % 2) * 0.12}>
            <ProjectCard project={project} href={project.link ?? null} />
          </CardReveal>
        ))}
      </ul>
    </section>
  );
}
