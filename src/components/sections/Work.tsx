import Link from "next/link";
import { BlurWords } from "@/components/motion/BlurWords";
import { Overline } from "@/components/motion/Overline";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getDictionary } from "@/i18n";
import type { Project } from "@/lib/content";

export function Work({ projects, total }: { projects: Project[]; total: number }) {
  const t = getDictionary().work;

  return (
    <section id="work" aria-labelledby="work-title" className="shell pt-28 md:pt-40">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Overline align="left">{t.overline}</Overline>
          <h2 id="work-title" className="display-lg mt-6">
            <BlurWords lines={[t.title]} />
          </h2>
        </div>
        <Reveal delay={0.2}>
          <Link
            href="/work/"
            transitionTypes={["page-forward"]}
            className="pill group !gap-3 !py-3 !pl-5 !pr-4 !text-[1rem] transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
          >
            {t.viewAll}
            <span className="text-ink-faint">({String(total).padStart(2, "0")})</span>
            <span className="grid size-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]">
              <Icon name="arrow-right" className="size-3.5" />
            </span>
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 md:mt-16">
        <ProjectGrid projects={projects} t={t} />
      </div>
    </section>
  );
}
