import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Now } from "@/components/sections/Now";
import { SideProjects } from "@/components/sections/SideProjects";
import { Socials } from "@/components/sections/Socials";
import { Toolbox } from "@/components/sections/Toolbox";
import { Updates } from "@/components/sections/Updates";
import { Work } from "@/components/sections/Work";
import { PersonJsonLd } from "@/components/seo/JsonLd";
import { contactChannels } from "@/content/channels";
import { getFeaturedProjects, getProjects, getSideProjects } from "@/content/projects";
import { getHomePage, getNow, getProfile, getSideProjectsPage } from "@/content/settings";
import { getUpdates } from "@/content/updates";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata({ path: "/" });
}

export default function HomePage() {
  const home = getHomePage();
  const profile = getProfile();
  const now = getNow();
  const sidePage = getSideProjectsPage();
  const sideProjects = getSideProjects();

  return (
    <PageTransition>
      <main id="main" tabIndex={-1}>
        <Hero content={home.hero} profile={profile} />
        <Work content={home.work} projects={getFeaturedProjects(home.work.limit)} total={getProjects().length} />
        {!sidePage.draft && sideProjects.length > 0 && <SideProjects content={sidePage} projects={sideProjects} />}
        <About content={home.about} profile={profile} />
        {!now.draft && <Now content={now} />}
        <Toolbox content={home.toolbox} />
        <Updates content={home.updates} updates={getUpdates().slice(0, home.updates.limit)} />
        <Socials content={home.socials} channels={contactChannels(profile)} />
        <PersonJsonLd />
      </main>
    </PageTransition>
  );
}
