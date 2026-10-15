import { Overline } from "@/components/motion/Overline";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import type { HomePage } from "@/content/schema";

export function About({ content }: { content: HomePage["about"] }) {
  return (
    <section id="about" aria-labelledby="about-title" className="shell pt-32 md:pt-52">
      <Overline as="h2" id="about-title">
        {content.overline}
      </Overline>
      <ScrollWords
        text={content.bio}
        className="mx-auto mt-10 max-w-[30ch] text-center font-serif text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.06] tracking-[-0.01em] text-ink md:mt-14"
      />

      {content.facts.length > 0 && (
        <RevealGroup as="dl" className="mx-auto mt-20 grid max-w-5xl gap-10 border-t border-line pt-10 md:mt-28 md:grid-cols-3 md:gap-8">
          {content.facts.map((fact) => (
            <RevealItem key={fact.label}>
              <dt className="font-serif text-[1.7rem] italic leading-none text-mute">{fact.label}</dt>
              <dd className="mt-3 text-[1.15rem] leading-snug text-ink md:text-[1.25rem]">{fact.value}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
