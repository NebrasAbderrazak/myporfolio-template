import type { CSSProperties } from "react";
import { ScrollAway } from "@/components/motion/ScrollAway";
import { EnterWords } from "@/components/typography/EnterWords";
import type { ListingPage } from "@/content/schema";

/** Centered header for index pages: overline with a count, title and intro. */
export function ListingHeader({ content, count }: { content: ListingPage; count: number }) {
  return (
    <ScrollAway distance={600}>
      <header className="shell text-center">
        <p className="enter-fade font-serif text-[1.4rem] italic text-ink-faint">
          {content.overline} · {String(count).padStart(2, "0")}
        </p>
        <h1 className="display-xl mt-6">
          <EnterWords value={content.title} step={90} />
        </h1>
        {content.intro && (
          <p className="enter-fade mx-auto mt-7 max-w-md text-[1.15rem] text-ink-soft" style={{ "--d": 320 } as CSSProperties}>
            {content.intro}
          </p>
        )}
      </header>
    </ScrollAway>
  );
}
