import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { Now as NowContent } from "@/content/schema";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { SectionHeading } from "./SectionHeading";

export function Now({ content }: { content: NowContent }) {
  const t = getDictionary().now;

  return (
    <section id="now" aria-labelledby="now-title" className="shell pt-32 md:pt-52">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <SectionHeading id="now-title" title={content.title} align="left" size="md" />
          {content.updated && (
            <p className="mt-5 font-serif text-[1.2rem] italic text-ink-faint">
              {t.updated} <time dateTime={content.updated}>{formatDate(content.updated)}</time>
            </p>
          )}
        </div>

        <RevealGroup as="dl" className="divide-y divide-line border-y border-line md:col-span-8" stagger={0.08}>
          {content.items.map((item) => (
            <RevealItem key={item.label} className="grid gap-2 py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8 md:py-7">
              <dt className="font-serif text-[1.6rem] italic leading-none text-mute">{item.label}</dt>
              <dd className="text-[1.15rem] leading-relaxed text-ink md:text-[1.25rem]">{item.text}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
