import "server-only";
import type { Metadata } from "next";
import { getProfile, getSite } from "@/content/settings";

/** The home page title: the person's full name and the site tagline. */
export function homeTitle() {
  return `${getProfile().name} | ${getSite().tagline}`;
}

type Options = {
  title?: string;
  description?: string;
  /** Canonical path. Leave it out for metadata shared by every page. */
  path?: string;
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, type = "website" }: Options): Metadata {
  const site = getSite();
  const fullTitle = title ? `${title} | ${site.name}` : homeTitle();
  const summary = description ?? site.description;

  return {
    ...(title ? { title } : {}),
    description: summary,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      type,
      locale: "en_US",
      siteName: site.name,
      ...(path ? { url: path } : {}),
      title: fullTitle,
      description: summary,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: summary },
  };
}
