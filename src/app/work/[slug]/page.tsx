import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/content/Markdown";
import { PageTransition } from "@/components/layout/PageTransition";
import { CardReveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ProjectJsonLd } from "@/components/seo/JsonLd";
import { CaseStudyCover } from "@/components/work/CaseStudyCover";
import { CaseStudyHeader } from "@/components/work/CaseStudyHeader";
import { ProjectCard } from "@/components/work/ProjectCard";
import { parseEmphasis } from "@/content/emphasis";
import { getNextProjects, getProject, getProjects } from "@/content/projects";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({ title: project.title, description: project.summary, path: `/work/${project.slug}/`, type: "article" });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const t = getDictionary().caseStudy;
  const more = getNextProjects(project.slug, 2);
  const facts = [
    { label: t.mission, value: project.mission ?? project.summary },
    { label: t.builtWith, value: project.tags.join(", ") || "—" },
    { label: t.role, value: [project.role, project.year].filter(Boolean).join(" · ") },
  ];

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="pt-32 md:pt-40">
        <article>
          <CaseStudyHeader project={project} />
          <CaseStudyCover project={project} />

          <RevealGroup as="dl" className="shell mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-10">
            {facts.map((fact) => (
              <RevealItem key={fact.label}>
                <dt className="font-serif text-[1.9rem] italic leading-none text-mute">{fact.label}</dt>
                <dd className="mt-3 text-[1.15rem] leading-relaxed text-ink md:text-[1.25rem]">{fact.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>

          {project.body && (
            <div className="shell mt-20 grid md:mt-28 md:grid-cols-12">
              <div className="prose md:col-span-8 md:col-start-3 lg:col-span-7 lg:col-start-3">
                <Markdown source={project.body} format={project.format} />
              </div>
            </div>
          )}
        </article>

        {more.length > 0 && (
          <section aria-labelledby="more-title" className="shell mt-32 md:mt-48">
            <SectionHeading id="more-title" overline={t.seeAlso} title={parseEmphasis(t.more)} />
            <RevealGroup as="ul" className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2" stagger={0.12}>
              {more.map((next) => (
                <CardReveal key={next.slug}>
                  <ProjectCard project={next} />
                </CardReveal>
              ))}
            </RevealGroup>
          </section>
        )}

        <ProjectJsonLd project={project} />
      </main>
    </PageTransition>
  );
}
