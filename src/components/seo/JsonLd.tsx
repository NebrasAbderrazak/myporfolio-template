import type { Project } from "@/content/projects";
import { absoluteUrl, getHomePage, getProfile, getSite } from "@/content/settings";

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c") }}
    />
  );
}

export function PersonJsonLd() {
  const site = getSite();
  const profile = getProfile();
  const skills = getHomePage().toolbox.groups.flatMap((group) => group.tools.map((tool) => tool.name));
  const sameAs = profile.socials.map((social) => social.url);

  return (
    <Script
      data={{
        "@type": "Person",
        name: profile.name,
        url: site.url,
        image: absoluteUrl(profile.portrait),
        jobTitle: profile.role,
        description: site.description,
        email: `mailto:${profile.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.location.city,
          addressCountry: profile.location.countryCode,
        },
        ...(profile.company && {
          worksFor: { "@type": "Organization", name: profile.company.name, ...(profile.company.url && { url: profile.company.url }) },
        }),
        ...(skills.length > 0 && { knowsAbout: skills }),
        ...(sameAs.length > 0 && { sameAs }),
      }}
    />
  );
}

export function ProjectJsonLd({ project }: { project: Project }) {
  const site = getSite();
  return (
    <Script
      data={{
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: absoluteUrl(`/work/${project.slug}/`),
        dateCreated: project.date,
        keywords: project.tags.join(", "),
        creator: { "@type": "Person", name: getProfile().name, url: site.url },
      }}
    />
  );
}
