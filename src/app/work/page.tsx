import type { Metadata } from "next";
import { ListingHeader } from "@/components/layout/ListingHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { plainEmphasis } from "@/content/emphasis";
import { getProjects } from "@/content/projects";
import { getWorkPage } from "@/content/settings";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  const page = getWorkPage();
  return pageMetadata({ title: plainEmphasis(page.title), description: page.intro, path: "/work/" });
}

export default function WorkIndexPage() {
  const projects = getProjects();

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="pt-36 md:pt-44">
        <ListingHeader content={getWorkPage()} />
        <div className="shell mt-16 md:mt-24">
          <ProjectGrid projects={projects} />
        </div>
      </main>
    </PageTransition>
  );
}
