import Link from "next/link";
import type { CSSProperties } from "react";
import { Picture } from "@/components/media/Picture";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrollAway } from "@/components/motion/ScrollAway";
import { EnterWords } from "@/components/typography/EnterWords";
import { Icon } from "@/components/ui/Icon";
import { plainLine } from "@/content/emphasis";
import type { Project } from "@/content/projects";
import { getDictionary } from "@/i18n";
import { PlaceholderBadge } from "./PlaceholderBadge";

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

export function CaseStudyHeader({ project }: { project: Project }) {
  const t = getDictionary();

  return (
    <ScrollAway distance={700}>
      <header className="shell">
        <div className="enter-fade flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/work/"
            transitionTypes={["page-back"]}
            className="pill group !gap-2.5 !py-2 !pl-2 !pr-4 transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
          >
            <span className="grid size-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-out-expo group-hover:-translate-x-0.5">
              <Icon name="arrow-left" className="size-3.5" />
            </span>
            {t.caseStudy.back}
          </Link>
          {project.placeholder && <PlaceholderBadge />}
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <div
              className="enter-fade relative grid size-20 place-items-center overflow-hidden rounded-[1.4rem] bg-ink shadow-lift md:size-24 md:rounded-[1.6rem]"
              style={delay(60)}
            >
              {project.icon ? (
                <Picture src={project.icon} alt="" fill sizes="96px" className="object-cover" />
              ) : (
                <span aria-hidden className="font-serif text-[3.2rem] italic leading-none text-paper md:text-[3.8rem]">
                  {project.title.charAt(0)}
                </span>
              )}
            </div>

            <h1 className="display-xl mt-8">
              <EnterWords value={plainLine(project.title)} delay={140} step={70} />
            </h1>

            {project.tags.length > 0 && (
              <ul className="enter-fade mt-7 flex flex-wrap gap-2" style={delay(380)} aria-label={t.work.tags}>
                {project.tags.map((tag) => (
                  <li key={tag} className="pill">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-4 lg:pb-1">
            <p className="enter-fade max-w-[40rem] text-[1.2rem] leading-relaxed text-ink-soft md:text-[1.3rem]" style={delay(460)}>
              {project.summary}
            </p>

            <div className="enter-fade mt-8 flex flex-wrap gap-3" style={delay(540)}>
              {project.link && (
                <MagneticButton href={project.link} external icon="link">
                  {t.caseStudy.liveLink}
                </MagneticButton>
              )}
              <MagneticButton href="#contact" variant={project.link ? "outline" : "solid"}>
                {t.caseStudy.contact}
              </MagneticButton>
            </div>
          </div>
        </div>
      </header>
    </ScrollAway>
  );
}
