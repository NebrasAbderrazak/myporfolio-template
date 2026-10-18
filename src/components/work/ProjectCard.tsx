import Link from "next/link";
import { ViewTransition } from "react";
import { Device } from "@/components/media/Device";
import { Tilt } from "@/components/motion/Tilt";
import { WipeIn } from "@/components/motion/WipeIn";
import type { Project } from "@/content/projects";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { PlaceholderBadge } from "./PlaceholderBadge";

type Props = {
  project: Project;
  wide?: boolean;
};

const PLACEMENT = {
  laptop: { normal: "top-[14%] w-[90%]", wide: "top-[14%] w-[90%] md:top-[11%] md:w-[58%]" },
  browser: { normal: "top-[13%] w-[80%]", wide: "top-[13%] w-[80%] md:top-[12%] md:w-[54%]" },
  phone: { normal: "top-[9%] w-[34%]", wide: "top-[9%] w-[34%] md:w-[18%]" },
} as const;

export function ProjectCard({ project, wide = false }: Props) {
  const t = getDictionary().work;
  const href = `/work/${project.slug}/`;
  const kind = project.mockup;
  const sizes = wide ? "(min-width: 768px) 52vw, 92vw" : "(min-width: 768px) 42vw, 92vw";

  return (
    <article className="group">
      <Link href={href} transitionTypes={["page-forward"]} tabIndex={-1} aria-hidden data-cursor={t.cursor} className="block">
        <WipeIn>
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <div
              className={cn(
                "relative overflow-hidden rounded-[1.75rem] bg-card shadow-soft ring-1 ring-black/[0.05] transition-shadow duration-700 ease-out-expo group-hover:shadow-lift md:rounded-[2rem]",
                wide ? "aspect-[4/3] md:aspect-[2.15/1]" : "aspect-[4/3]",
              )}
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(110%_80%_at_30%_0%,#ffffff_0%,rgb(255_255_255/0)_60%),linear-gradient(180deg,rgb(0_0_0/0)_60%,rgb(18_20_17/0.05))]"
              />
              {kind === "none" ? (
                <div className="absolute inset-[6%] transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]">
                  <Device
                    kind="none"
                    src={project.cover}
                    alt={project.coverAlt}
                    sizes={sizes}
                    fallback={project.title}
                    className="size-full !aspect-auto"
                  />
                </div>
              ) : (
                <Tilt>
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 transition-transform duration-[1.2s] ease-out-expo group-hover:-translate-y-[2.5%]",
                      PLACEMENT[kind][wide ? "wide" : "normal"],
                    )}
                  >
                    <Device kind={kind} src={project.cover} alt={project.coverAlt} sizes={sizes} open fallback={project.title} />
                  </div>
                </Tilt>
              )}
            </div>
          </ViewTransition>
        </WipeIn>
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-1 md:mt-6">
        <h3 className="font-sans text-[1.3rem] leading-snug tracking-[-0.01em] md:text-[1.5rem]">
          <Link href={href} transitionTypes={["page-forward"]} className="link-draw">
            {project.title}
          </Link>
        </h3>
        <ul className="flex flex-wrap gap-2" aria-label={t.tags}>
          {project.placeholder && <PlaceholderBadge as="li" />}
          {project.tags.slice(0, 2).map((tag) => (
            <li key={tag} className="pill !text-[0.85rem]">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
