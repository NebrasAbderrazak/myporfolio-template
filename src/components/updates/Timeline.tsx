import { Mdx } from "@/components/mdx/Mdx";
import { RailFill } from "@/components/motion/RailFill";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { formatDate, type Update } from "@/lib/content";
import { cn } from "@/lib/cn";

export function Timeline({ updates, latestLabel }: { updates: Update[]; latestLabel: string }) {
  return (
    <RailFill>
      <ol className="space-y-12 md:space-y-16">
        {updates.map((u, i) => (
          <Reveal
            as="li"
            key={u.slug}
            id={`update-${u.slug}`}
            className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-5 md:grid-cols-[7.5rem_1.25rem_minmax(0,1fr)] md:gap-x-6"
          >
            <time dateTime={u.date} className="hidden pt-1 text-right font-serif text-[1.2rem] italic text-ink-faint md:block">
              {formatDate(u.date, "short")}
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
                <time dateTime={u.date} className="font-serif text-[1.1rem] italic text-ink-faint md:hidden">
                  {formatDate(u.date, "short")}
                </time>
                {i === 0 && <span className="pill !py-0.5 !px-2.5 !text-[0.75rem] !text-accent">{latestLabel}</span>}
              </p>
              <h3 className="mt-1 font-serif text-[1.9rem] leading-[1.05] md:mt-0 md:text-[2.1rem]">{u.title}</h3>
              <div className="prose prose-sm mt-3">
                <Mdx source={u.body} />
              </div>
              {u.link && (
                <a
                  href={u.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex items-center gap-2 text-[0.95rem] text-ink"
                >
                  <span className="link-line">{new URL(u.link).hostname.replace(/^www\./, "")}</span>
                  <Icon name="arrow-up-right" className="size-4" />
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </ol>
    </RailFill>
  );
}
