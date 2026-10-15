import { Markdown } from "@/components/content/Markdown";
import { RailFill } from "@/components/motion/RailFill";
import { Reveal } from "@/components/motion/Reveal";
import { ExternalAnchor } from "@/components/ui/ExternalAnchor";
import { Icon } from "@/components/ui/Icon";
import type { Update } from "@/content/updates";
import { getDictionary } from "@/i18n";
import { formatDate, hostname } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Timeline({ updates }: { updates: Update[] }) {
  const t = getDictionary().updates;

  return (
    <RailFill>
      <ol className="space-y-12 md:space-y-16">
        {updates.map((update, i) => (
          <Reveal
            as="li"
            key={update.slug}
            id={`update-${update.slug}`}
            className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-5 md:grid-cols-[7.5rem_1.25rem_minmax(0,1fr)] md:gap-x-6"
          >
            <time dateTime={update.date} className="hidden pt-1 text-right font-serif text-[1.2rem] italic text-ink-faint md:block">
              {formatDate(update.date, "short")}
            </time>

            <div aria-hidden className="relative flex justify-center">
              <span
                className={cn(
                  "relative mt-[0.6rem] size-3 rounded-full ring-4 ring-paper",
                  i === 0 ? "status-dot bg-accent-bright" : "border border-ink-faint bg-paper",
                )}
              />
            </div>

            <article className="min-w-0 rounded-[1.5rem] bg-card/80 p-6 shadow-soft ring-1 ring-black/[0.05] md:p-7">
              <p className="flex flex-wrap items-center gap-3">
                <time dateTime={update.date} className="font-serif text-[1.1rem] italic text-ink-faint md:hidden">
                  {formatDate(update.date, "short")}
                </time>
                {i === 0 && <span className="pill !py-0.5 !px-2.5 !text-[0.75rem] !text-accent">{t.latest}</span>}
              </p>
              <h3 className="mt-1 font-serif text-[1.9rem] leading-[1.05] md:mt-0 md:text-[2.1rem]">{update.title}</h3>
              {update.body && (
                <div className="prose prose-sm mt-3">
                  <Markdown source={update.body} format={update.format} />
                </div>
              )}
              {update.link && (
                <ExternalAnchor href={update.link} className="group mt-5 inline-flex items-center gap-2 text-[0.95rem] text-ink">
                  <span className="link-line">{hostname(update.link)}</span>
                  <Icon name="arrow-up-right" className="size-4" />
                </ExternalAnchor>
              )}
            </article>
          </Reveal>
        ))}
      </ol>
    </RailFill>
  );
}
