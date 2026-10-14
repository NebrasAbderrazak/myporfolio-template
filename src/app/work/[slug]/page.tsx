import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, ViewTransition, type CSSProperties } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Device } from "@/components/media/Device";
import { Picture } from "@/components/media/Picture";
import { Mdx } from "@/components/mdx/Mdx";
import { BlurWords } from "@/components/motion/BlurWords";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Overline } from "@/components/motion/Overline";
import { CardReveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ScrollZoom } from "@/components/motion/ScrollZoom";
import { ProjectJsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getDictionary } from "@/i18n";
import { getMoreProjects, getProject, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({ title: project.title, description: project.summary, path: `/work/${slug}/`, type: "article" });
}

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

const STAGE = {
  laptop: "top-[9%] w-[86%] md:w-[70%]",
  browser: "top-[9%] w-[84%] md:w-[66%]",
  phone: "top-[7%] w-[44%] md:w-[24%]",
} as const;

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const more = getMoreProjects(slug, 2);
  const t = getDictionary();
  const c = t.caseStudy;
  const words = project.title.split(/\s+/);

  const facts = [
    { label: c.mission, value: project.mission ?? project.summary },
    { label: c.builtWith, value: project.tags.join(", ") || "—" },
    { label: c.role, value: [project.role, project.year].filter(Boolean).join(" · ") },
  ];

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="pt-32 md:pt-40">
        <article>
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
                {c.back}
              </Link>
              {project.placeholder && (
                <span className="pill border border-dashed border-line-strong !bg-transparent !shadow-none !text-[0.82rem] text-ink-soft">
                  {t.work.placeholder}
                </span>
              )}
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
                <span className="blur-words">
                  {words.map((w, i) => (
                    <Fragment key={i}>
                      {i > 0 && " "}
                      <span className="w" style={delay(140 + i * 70)}>
                        {w}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </h1>

              <ul className="enter-fade mt-7 flex flex-wrap gap-2" style={delay(380)} aria-label="Tags">
                {project.tags.map((tag) => (
                  <li key={tag} className="pill">
                    {tag}
                  </li>
                ))}
              </ul>
              </div>

              <div className="lg:col-span-4 lg:pb-1">
              <p
                className="enter-fade max-w-[40rem] text-[1.2rem] leading-relaxed text-ink-soft md:text-[1.3rem]"
                style={delay(460)}
              >
                {project.summary}
              </p>

              <div className="enter-fade mt-8 flex flex-wrap gap-3" style={delay(540)}>
                {project.link && (
                  <MagneticButton href={project.link} external icon="link">
                    {c.liveLink}
                  </MagneticButton>
                )}
                <MagneticButton href="#contact" variant={project.link ? "outline" : "solid"}>
                  {c.contact}
                </MagneticButton>
              </div>
              </div>
            </div>
          </header>

          <div className="shell enter-fade mt-16 md:mt-24" style={delay(620)}>
            <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
              <div
                className={cn(
                  "relative overflow-hidden rounded-[2rem] bg-card shadow-soft ring-1 ring-black/[0.05] md:rounded-[2.75rem]",
                  project.mockup === "phone" ? "aspect-[4/5] md:aspect-[16/9]" : "aspect-[4/3] md:aspect-[16/9]",
                )}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(90%_70%_at_30%_0%,#ffffff_0%,rgb(255_255_255/0)_60%),linear-gradient(180deg,rgb(0_0_0/0)_55%,rgb(18_20_17/0.06))]"
                />
                {project.mockup === "none" ? (
                  <div className="absolute inset-[5%]">
                    <Device kind="none" src={project.cover} alt={project.coverAlt} sizes="90vw" priority fallback={project.title} className="size-full !aspect-auto" />
                  </div>
                ) : (
                  <ScrollZoom className={cn("absolute left-1/2 -translate-x-1/2", STAGE[project.mockup])}>
                    <Device
                      kind={project.mockup}
                      src={project.cover}
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

          <RevealGroup as="dl" className="shell mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-10">
            {facts.map((f) => (
              <RevealItem key={f.label}>
                <dt className="font-serif text-[1.9rem] italic leading-none text-mute">{f.label}</dt>
                <dd className="mt-3 text-[1.15rem] leading-relaxed text-ink md:text-[1.25rem]">{f.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="shell mt-20 grid md:mt-28 md:grid-cols-12">
            <div className="prose md:col-span-8 md:col-start-3 lg:col-span-7 lg:col-start-3">
              <Mdx source={project.body} />
            </div>
          </div>
        </article>

        {more.length > 0 && (
          <section aria-labelledby="more-title" className="shell mt-32 md:mt-48">
            <Overline>{c.seeAlso}</Overline>
            <h2 id="more-title" className="display-lg mt-6 text-center">
              <BlurWords lines={[c.more]} />
            </h2>
            <RevealGroup as="ul" className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2" stagger={0.12}>
              {more.map((p) => (
                <CardReveal key={p.slug}>
                  <ProjectCard project={p} t={t.work} />
                </CardReveal>
              ))}
            </RevealGroup>
          </section>
        )}

        <ProjectJsonLd title={project.title} summary={project.summary} slug={project.slug} date={project.date} tags={project.tags} />
      </main>
    </PageTransition>
  );
}
