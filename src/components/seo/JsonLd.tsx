import { getDictionary } from "@/i18n";
import { absoluteUrl, site } from "@/lib/site";

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function PersonJsonLd() {
  const t = getDictionary();
  const sameAs = site.socials.filter((s) => !s.placeholder).map((s) => s.href);
  const skills = t.toolbox.groups.flatMap((g) => g.items.map((i) => i.name));

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.name,
        url: site.url,
        image: absoluteUrl("/me.jpg"),
        jobTitle: site.jobTitle,
        description: t.meta.description,
        ...(site.email.endsWith("example.com") ? {} : { email: `mailto:${site.email}` }),
        address: {
          "@type": "PostalAddress",
          addressLocality: site.location.city,
          addressCountry: site.location.countryCode,
        },
        worksFor: { "@type": "Organization", name: site.company.name, url: site.company.url },
        knowsAbout: skills,
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}

export function ProjectJsonLd({ title, summary, slug, date, tags }: { title: string; summary: string; slug: string; date: string; tags: string[] }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: title,
        description: summary,
        url: absoluteUrl(`/work/${slug}/`),
        dateCreated: date,
        keywords: tags.join(", "),
        creator: { "@type": "Person", name: site.name, url: site.url },
      }}
    />
  );
}
