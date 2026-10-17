import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import type { Project } from "@/content/projects";
import type { HomePage } from "@/content/schema";
import { getDictionary } from "@/i18n";
import { SectionHeading } from "./SectionHeading";

type Props = {
  content: HomePage["work"];
  projects: Project[];
  total: number;
};

export function Work({ content, projects, total }: Props) {
  const t = getDictionary().work;

  return (
    <section id="work" aria-labelledby="work-title" className="shell pt-28 md:pt-40">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionHeading id="work-title" title={content.title} align="left" />
        </div>
        <Reveal delay={0.2}>
          <ArrowLink href="/work/" size="lg">
            {t.viewAll}
            <span className="text-ink-faint">({String(total).padStart(2, "0")})</span>
          </ArrowLink>
        </Reveal>
      </div>

      <div className="mt-12 md:mt-16">
        <ProjectGrid projects={projects} />
      </div>
    </section>
  );
}
