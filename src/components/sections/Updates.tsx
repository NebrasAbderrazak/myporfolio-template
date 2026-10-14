import Link from "next/link";
import { BlurWords } from "@/components/motion/BlurWords";
import { Overline } from "@/components/motion/Overline";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Timeline } from "@/components/updates/Timeline";
import { getDictionary } from "@/i18n";
import type { Update } from "@/lib/content";

export function Updates({ updates }: { updates: Update[] }) {
  const t = getDictionary().updates;

  return (
    <section id="updates" aria-labelledby="updates-title" className="shell pt-32 md:pt-52">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Overline align="left">{t.overline}</Overline>
            <h2 id="updates-title" className="display-md mt-6">
              <BlurWords lines={[t.title]} />
            </h2>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xs text-[1.05rem] text-ink-soft">{t.intro}</p>
              <Link
                href="/updates/"
                transitionTypes={["page-forward"]}
                className="pill group mt-8 !gap-3 !py-2.5 !pl-5 !pr-3 transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
              >
                {t.all}
                <span className="grid size-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]">
                  <Icon name="arrow-right" className="size-3.5" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-8">
          <Timeline updates={updates} latestLabel={t.latest} />
        </div>
      </div>
    </section>
  );
}
