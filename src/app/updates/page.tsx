import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Timeline } from "@/components/updates/Timeline";
import { getDictionary } from "@/i18n";
import { getUpdates } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary().updates;

export const metadata: Metadata = pageMetadata({
  title: t.pageTitle,
  description: t.pageIntro,
  path: "/updates/",
});

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

export default function UpdatesPage() {
  const updates = getUpdates();

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="pt-36 md:pt-44">
        <header className="shell text-center">
          <p className="enter-fade font-serif text-[1.4rem] italic text-ink-faint">
            {t.overline} · {String(updates.length).padStart(2, "0")}
          </p>
          <h1 className="display-xl mt-6">
            <span className="blur-words">
              <span className="w" style={delay(100)}>
                {t.pageTitle}
              </span>
            </span>
          </h1>
          <p className="enter-fade mx-auto mt-7 max-w-md text-[1.15rem] text-ink-soft" style={delay(280)}>
            {t.pageIntro}
          </p>
        </header>

        <div className="shell mt-16 grid md:mt-24 md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
            <Timeline updates={updates} latestLabel={t.latest} />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
