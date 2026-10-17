import { z } from "zod";
import { findUnclosedMarker, parseEmphasis } from "./emphasis";

// Pages CMS writes "" for fields left empty, so blank strings mean "not set".
const blankToUndefined = (value: unknown) => (typeof value === "string" && value.trim() === "" ? undefined : value);

const optional = <T extends z.ZodType>(schema: T) => z.preprocess(blankToUndefined, schema.optional());

const text = z.string().trim().min(1, "Required");

const httpUrl = z.url({ protocol: /^https?$/, error: "Use a full URL that starts with https://" });

const assetPath = z
  .string()
  .trim()
  .regex(/^(\/[^/]|https?:\/\/)/, "Use a path inside /public (for example /media/cover.jpg) or a full URL");

const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === "string" ? value.trim().slice(0, 10) : value),
  z.iso.date({ error: "Use the format YYYY-MM-DD" }),
);

const emphasis = text
  .superRefine((value, ctx) => {
    const marker = findUnclosedMarker(value);
    if (marker) ctx.addIssue({ code: "custom", message: `"${marker}" is opened but never closed` });
  })
  .transform(parseEmphasis);

const timeZone = text.refine((value) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, "Use an IANA time zone, for example Africa/Tunis");

const limit = (fallback: number) => z.preprocess(blankToUndefined, z.number().int().min(1).max(24).default(fallback));

const sectionHeading = { title: emphasis };

export const SOCIAL_PLATFORMS = ["linkedin", "github", "x", "instagram", "website"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const MOCKUPS = ["laptop", "browser", "phone", "none"] as const;
export type Mockup = (typeof MOCKUPS)[number];

export const siteSchema = z.object({
  name: text,
  url: httpUrl.transform((url) => url.replace(/\/+$/, "")),
  tagline: text,
  description: text,
  contact: z.object({ ...sectionHeading, intro: optional(text), button: text }),
  footer: z.object({ credit: optional(text) }),
});

export const profileSchema = z.object({
  name: text,
  role: text,
  portrait: assetPath,
  portraitAlt: optional(text),
  portraitFraming: z
    .object({
      x: z.number().min(0).max(100).default(50),
      y: z.number().min(0).max(100).default(35),
      zoom: z.number().min(1).max(4).default(1),
    })
    .default({ x: 50, y: 35, zoom: 1 }),
  status: optional(text),
  location: z.object({
    city: text,
    country: text,
    countryCode: text.length(2, "Use a two-letter country code, for example TN").toUpperCase(),
    timeZone,
  }),
  company: z
    .object({ label: optional(text), name: optional(text), url: optional(httpUrl) })
    .optional()
    .transform((company) => (company?.name ? { label: company.label ?? "Founder of", name: company.name, url: company.url } : undefined)),
  email: z.email({ error: "Use a valid email address" }),
  whatsapp: optional(text.regex(/^\+?[\d\s().-]{6,}$/, "Use the full international number, for example +216 24 746 277")),
  socials: z
    .array(
      z.object({
        platform: z.enum(SOCIAL_PLATFORMS),
        url: httpUrl,
        handle: optional(text),
      }),
    )
    .default([]),
});

export const homePageSchema = z.object({
  hero: z.object({
    headline: emphasis,
    intro: emphasis,
    primaryButton: text,
    secondaryButton: text,
  }),
  work: z.object({ ...sectionHeading, limit: limit(6) }),
  about: z.object({
    bio: text,
    facts: z.array(z.object({ label: text, value: text })).default([]),
  }),
  toolbox: z.object({
    ...sectionHeading,
    intro: optional(text),
    groups: z
      .array(z.object({ name: text, tools: z.array(z.object({ name: text, note: optional(text) })).default([]) }))
      .default([]),
  }),
  updates: z.object({ ...sectionHeading, intro: optional(text), limit: limit(4) }),
  socials: z.object(sectionHeading),
});

export const listingPageSchema = z.object({ ...sectionHeading, intro: optional(text) });

export const projectSchema = z.object({
  title: text,
  summary: text,
  date: isoDate,
  tags: z.array(text).default([]),
  cover: optional(assetPath),
  coverAlt: optional(text),
  mockup: z.preprocess(blankToUndefined, z.enum(MOCKUPS).default("laptop")),
  icon: optional(assetPath),
  mission: optional(text),
  role: optional(text),
  link: optional(httpUrl),
  featured: z.boolean().default(false),
  placeholder: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export const updateSchema = z.object({
  title: text,
  date: isoDate,
  tags: z.array(text).default([]),
  link: optional(httpUrl),
  draft: z.boolean().default(false),
});

export type Site = z.output<typeof siteSchema>;
export type Profile = z.output<typeof profileSchema>;
export type HomePage = z.output<typeof homePageSchema>;
export type ListingPage = z.output<typeof listingPageSchema>;
