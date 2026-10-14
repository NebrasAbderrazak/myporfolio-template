import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { site } from "@/lib/site";

type Options = {
  title?: string;
  description?: string;
  path: string;
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, type = "website" }: Options): Metadata {
  const t = getDictionary();
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${t.meta.title}`;
  const desc = description ?? t.meta.description;

  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description: desc,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc },
  };
}
