"use client";

import * as m from "motion/react-m";
import { Fragment } from "react";
import type { Segment } from "@/i18n";
import { useWideScreen } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  lines: Segment[][];
  className?: string;
  delay?: number;
};

export function BlurWords({ lines, className, delay = 0 }: Props) {
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
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((seg, si) =>
            seg.text
              .trim()
              .split(/\s+/)
              .map((word, wi) => (
                <Fragment key={`${si}-${wi}`}>
                  {(si > 0 || wi > 0) && " "}
                  <m.span
                    data-reveal=""
                    className={cn("inline-block", `tone-${seg.tone}`, seg.italic && "italic")}
                    variants={{ hidden, show: { ...shown, transition: { duration: 1, ease: EASE } } }}
                  >
                    {word}
                  </m.span>
                </Fragment>
              )),
          )}
        </span>
      ))}
    </m.span>
  );
}
