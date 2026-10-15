import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Timeline } from "@/components/updates/Timeline";
import type { HomePage } from "@/content/schema";
import type { Update } from "@/content/updates";
import { getDictionary } from "@/i18n";
import { SectionHeading } from "./SectionHeading";

export function Updates({ content, updates }: { content: HomePage["updates"]; updates: Update[] }) {
  const t = getDictionary().updates;

  return (
    <section id="updates" aria-labelledby="updates-title" className="shell pt-32 md:pt-52">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionHeading id="updates-title" overline={content.overline} title={content.title} align="left" size="md" />
            <Reveal delay={0.12}>
              {content.intro && <p className="mt-5 max-w-xs text-[1.05rem] text-ink-soft">{content.intro}</p>}
              <ArrowLink href="/updates/" className="mt-8">
                {t.all}
              </ArrowLink>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-8">
          <Timeline updates={updates} />
        </div>
      </div>
    </section>
  );
}
