"use client";

import * as m from "motion/react-m";
import { Fragment, useRef } from "react";
import { toWords, type Emphasis } from "@/content/emphasis";
import { useWideScreen } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { EASE } from "./Reveal";
import { useViewState } from "./useViewState";

type Props = {
  value: Emphasis;
  className?: string;
  delay?: number;
};

/** Scroll-driven heading: words rise and unblur on the way in, and blur away again on the way out. */
export function BlurWords({ value, className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const state = useViewState(ref, { amount: 0.4 });
  const wide = useWideScreen();
  const blur = (px: number) => (wide ? { filter: `blur(${px}px)` } : {});

  const word = {
    below: { opacity: 0, y: "0.3em", ...blur(12), transition: { duration: 0.5, ease: EASE } },
    inside: { opacity: 1, y: "0em", ...blur(0), transition: { duration: 1, ease: EASE } },
    above: { opacity: 0, y: "-0.3em", ...blur(12), transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <m.span
      ref={ref}
      className={cn("block", className)}
      initial="below"
      animate={state}
      variants={{
        below: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
        inside: { transition: { staggerChildren: 0.07, delayChildren: delay } },
        above: { transition: { staggerChildren: 0.025 } },
      }}
    >
      {value.map((line, li) => (
        <span key={li} className="block">
          {toWords(line).map((w, wi) => (
            <Fragment key={wi}>
              {w.spaced && " "}
              <m.span data-reveal="" className={cn("inline-block", `tone-${w.tone}`, w.italic && "italic")} variants={word}>
                {w.text}
              </m.span>
            </Fragment>
          ))}
        </span>
      ))}
    </m.span>
  );
}
