// Everything personal lives here. Replace the values marked TODO before going live.

export type IconName = "linkedin" | "github" | "x" | "instagram" | "whatsapp" | "email";

export type Social = {
  label: string;
  icon: IconName;
  href: string;
  handle: string;
  placeholder?: boolean;
};

export const site = {
  /** TODO: your full name. Used in page titles, Open Graph images and JSON-LD. */
  name: "Nebras",
  shortName: "Nebras",
  /** TODO: your domain, with https:// and without a trailing slash. */
  url: "https://example.com",
  /** TODO: the email address you want to show publicly. */
  email: "hello@example.com",
  whatsapp: "https://wa.me/21624746277",
  whatsappDisplay: "+216 24 746 277",
  jobTitle: "Developer & Founder",
  location: {
    city: "Gabès",
    country: "Tunisia",
    countryCode: "TN",
    timeZone: "Africa/Tunis",
    coords: "33.88° N, 10.10° E",
  },
  company: { name: "Jasper Tech", url: "https://jaspertech.tn" },
  // TODO: replace "your-handle" with your real profiles, then set placeholder to false.
  socials: [
    { label: "LinkedIn", icon: "linkedin", handle: "/in/your-handle", href: "https://www.linkedin.com/in/your-handle", placeholder: true },
    { label: "GitHub", icon: "github", handle: "@your-handle", href: "https://github.com/your-handle", placeholder: true },
    { label: "X", icon: "x", handle: "@your-handle", href: "https://x.com/your-handle", placeholder: true },
    { label: "Instagram", icon: "instagram", handle: "@your-handle", href: "https://www.instagram.com/your-handle", placeholder: true },
  ] satisfies Social[] as Social[],
};

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, site.url).toString();
}
