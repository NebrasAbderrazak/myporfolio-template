import type { Metadata } from "next";
import { Fragment, type CSSProperties } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getDictionary } from "@/i18n";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

const t = getDictionary();

export const metadata: Metadata = pageMetadata({
  title: "All projects",
  description: `${t.workIndex.intro} ${t.meta.description}`,
  path: "/work/",
});

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

export default function WorkIndexPage() {
  const projects = getProjects();
  const w = t.workIndex;

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="pt-36 md:pt-44">
        <header className="shell text-center">
          <p className="enter-fade font-serif text-[1.4rem] italic text-ink-faint">
            {w.overline} · {String(projects.length).padStart(2, "0")}
          </p>
          <h1 className="display-xl mt-6">
            <span className="blur-words">
              {w.title.map((seg, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className={cn("w", `tone-${seg.tone}`, seg.italic && "italic")} style={delay(100 + i * 90)}>
                    {seg.text.trim()}
                  </span>
                </Fragment>
              ))}
            </span>
          </h1>
          <p className="enter-fade mx-auto mt-7 max-w-md text-[1.15rem] text-ink-soft" style={delay(320)}>
            {w.intro}
          </p>
        </header>

        <div className="shell mt-16 md:mt-24">
          <ProjectGrid projects={projects} t={t.work} />
        </div>
      </main>
    </PageTransition>
  );
}
