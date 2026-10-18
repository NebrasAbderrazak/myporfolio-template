import { Fragment, type CSSProperties } from "react";
import { toWords, type Emphasis } from "@/content/emphasis";
import { cn } from "@/lib/cn";

type Props = {
  value: Emphasis;
  /** Delay before the first word, in milliseconds. */
  delay?: number;
  /** Delay added for each following word, in milliseconds. */
  step?: number;
};

/**
 * Page-load entrance for headings: each word blurs in with a CSS animation,
 * so it plays before hydration and counts towards LCP.
 */
export function EnterWords({ value, delay = 100, step = 75 }: Props) {
  let index = 0;
  return value.map((line, li) => (
    <span key={li} className="blur-words block">
      {toWords(line).map((word, wi) => (
        <Fragment key={wi}>
          {word.spaced && " "}
          <span
            className={cn("w", `tone-${word.tone}`, word.italic && "italic")}
            style={{ "--d": delay + index++ * step } as CSSProperties}
          >
            {word.text}
          </span>
        </Fragment>
      ))}
    </span>
  ));
}
