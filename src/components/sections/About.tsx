import type { ReactNode } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { LocalTime } from "@/components/ui/LocalTime";
import type { HomePage, Profile } from "@/content/schema";
import { getDictionary } from "@/i18n";
import { utcOffsetLabel } from "@/lib/format";

export function About({ content, profile }: { content: HomePage["about"]; profile: Profile }) {
  const t = getDictionary().about;
  const { city, country, timeZone } = profile.location;
  const facts: { label: string; value: ReactNode }[] = [
    { label: t.basedIn, value: `${city}, ${country}` },
    {
      label: t.localTime,
      value: (
        <span className="tabular-nums">
          <LocalTime timeZone={timeZone} /> <span className="text-ink-faint">{utcOffsetLabel(timeZone)}</span>
        </span>
      ),
    },
    ...(profile.status ? [{ label: t.currently, value: profile.status }] : []),
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="shell pt-32 md:pt-52">
      <h2 id="about-title" className="sr-only">
        {t.heading}
      </h2>
      <ScrollWords
        text={content.bio}
        className="mx-auto max-w-[30ch] text-center font-serif text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.06] tracking-[-0.01em] text-ink"
      />

      <RevealGroup as="dl" className="mx-auto mt-20 grid max-w-5xl gap-10 border-t border-line pt-10 md:mt-28 md:grid-cols-3 md:gap-8">
        {facts.map((fact) => (
          <RevealItem key={fact.label}>
            <dt className="font-serif text-[1.7rem] italic leading-none text-mute">{fact.label}</dt>
            <dd className="mt-3 text-[1.15rem] leading-snug text-ink md:text-[1.25rem]">{fact.value}</dd>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
