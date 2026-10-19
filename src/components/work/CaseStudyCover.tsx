import { ViewTransition, type CSSProperties } from "react";
import { Device } from "@/components/media/Device";
import { ScrollZoom } from "@/components/motion/ScrollZoom";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

const STAGE = {
  laptop: "top-[9%] w-[86%] md:w-[70%]",
  browser: "top-[9%] w-[84%] md:w-[66%]",
  phone: "top-[7%] w-[44%] md:w-[24%]",
} as const;

/** Shares its view transition name with the project card, so opening a project morphs the card into this cover. */
export function CaseStudyCover({ project }: { project: Project }) {
  const { mockup } = project;

  return (
    <div className="shell enter-fade mt-16 md:mt-24" style={{ "--d": 620 } as CSSProperties}>
      <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
        <div
          className={cn(
            "relative overflow-hidden rounded-[2rem] bg-card shadow-soft ring-1 ring-black/[0.05] md:rounded-[2.75rem]",
            mockup === "phone" ? "aspect-[4/5] md:aspect-[16/9]" : "aspect-[4/3] md:aspect-[16/9]",
          )}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(90%_70%_at_30%_0%,#ffffff_0%,rgb(255_255_255/0)_60%),linear-gradient(180deg,rgb(0_0_0/0)_55%,rgb(18_20_17/0.06))]"
          />
          {mockup === "none" ? (
            <div className="absolute inset-[5%]">
              <Device
                kind="none"
                src={project.cover}
                video={project.video}
                alt={project.coverAlt}
                sizes="90vw"
                priority
                fallback={project.title}
                className="size-full !aspect-auto"
              />
            </div>
          ) : (
            <ScrollZoom className={cn("absolute left-1/2 -translate-x-1/2", STAGE[mockup])}>
              <Device
                kind={mockup}
                src={project.cover}
                video={project.video}
                alt={project.coverAlt}
                sizes="(min-width: 768px) 64vw, 90vw"
                priority
                fallback={project.title}
              />
            </ScrollZoom>
          )}
        </div>
      </ViewTransition>
    </div>
  );
}
