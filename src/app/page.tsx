import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Socials } from "@/components/sections/Socials";
import { Toolbox } from "@/components/sections/Toolbox";
import { Updates } from "@/components/sections/Updates";
import { Work } from "@/components/sections/Work";
import { PersonJsonLd } from "@/components/seo/JsonLd";
import { getFeaturedProjects, getProjects, getUpdates } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <PageTransition>
      <main id="main" tabIndex={-1}>
        <Hero />
        <Work projects={getFeaturedProjects()} total={getProjects().length} />
        <About />
        <Toolbox />
        <Updates updates={getUpdates(4)} />
        <Socials />
        <PersonJsonLd />
      </main>
    </PageTransition>
  );
}
