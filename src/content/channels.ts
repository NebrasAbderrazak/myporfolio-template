import type { IconName } from "@/components/ui/Icon";
import type { Profile, SocialPlatform } from "./schema";

export type Channel = {
  kind: "direct" | "social";
  label: string;
  icon: IconName;
  href: string;
  handle: string;
  external: boolean;
};

const PLATFORMS: Record<SocialPlatform, { label: string; icon: IconName }> = {
  linkedin: { label: "LinkedIn", icon: "linkedin" },
  github: { label: "GitHub", icon: "github" },
  x: { label: "X", icon: "x" },
  instagram: { label: "Instagram", icon: "instagram" },
  website: { label: "Website", icon: "globe" },
};

export function whatsappUrl(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

function prettyUrl(url: string) {
  const { hostname, pathname } = new URL(url);
  return `${hostname.replace(/^www\./, "")}${pathname}`.replace(/\/$/, "");
}

type Contact = Pick<Profile, "email" | "whatsapp" | "socials">;

/** Every way to reach the person, direct channels first. */
export function contactChannels({ email, whatsapp, socials }: Contact): Channel[] {
  const direct: Channel[] = [
    ...(whatsapp
      ? [{ kind: "direct" as const, label: "WhatsApp", icon: "whatsapp" as const, href: whatsappUrl(whatsapp), handle: whatsapp, external: true }]
      : []),
    { kind: "direct", label: "Email", icon: "email", href: `mailto:${email}`, handle: email, external: false },
  ];

  const social = socials.map<Channel>(({ platform, url, handle }) => ({
    kind: "social",
    ...PLATFORMS[platform],
    href: url,
    handle: handle ?? prettyUrl(url),
    external: true,
  }));

  return [...direct, ...social];
}
