import type { CSSProperties } from "react";
import { ScrollAway } from "@/components/motion/ScrollAway";
import { EnterWords } from "@/components/typography/EnterWords";
import type { ListingPage } from "@/content/schema";

/** Centered header for index pages: title and intro. */
export function ListingHeader({ content }: { content: ListingPage }) {
  return (
    <ScrollAway distance={600}>
      <header className="shell text-center">
        <h1 className="display-xl">
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
