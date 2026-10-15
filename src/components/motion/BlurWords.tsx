"use client";

import * as m from "motion/react-m";
import { Fragment } from "react";
import { toWords, type Emphasis } from "@/content/emphasis";
import { useWideScreen } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  value: Emphasis;
  className?: string;
  delay?: number;
};

/** Scroll-triggered heading reveal: words rise and unblur one after another. */
export function BlurWords({ value, className, delay = 0 }: Props) {
  const wide = useWideScreen();
  const hidden = wide ? { opacity: 0, y: "0.3em", filter: "blur(12px)" } : { opacity: 0, y: "0.3em" };
  const shown = wide ? { opacity: 1, y: "0em", filter: "blur(0px)" } : { opacity: 1, y: "0em" };

  return (
    <m.span
      className={cn("block", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {value.map((line, li) => (
        <span key={li} className="block">
          {toWords(line).map((word, wi) => (
            <Fragment key={wi}>
              {word.spaced && " "}
              <m.span
                data-reveal=""
                className={cn("inline-block", `tone-${word.tone}`, word.italic && "italic")}
                variants={{ hidden, show: { ...shown, transition: { duration: 1, ease: EASE } } }}
              >
                {word.text}
              </m.span>
            </Fragment>
          ))}
        </span>
      ))}
    </m.span>
  );
}
