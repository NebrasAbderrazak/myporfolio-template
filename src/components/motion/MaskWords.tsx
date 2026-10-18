"use client";

import * as m from "motion/react-m";
import { Fragment, useRef } from "react";
import { EASE } from "./Reveal";
import { useViewState } from "./useViewState";

const word = {
  below: { y: "110%", transition: { duration: 0.45, ease: EASE } },
  inside: { y: "0%", transition: { duration: 0.9, ease: EASE } },
  above: { y: "-110%", transition: { duration: 0.45, ease: EASE } },
};

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

/** Paragraph whose words slide up out of their own line masks, and back out again when scrolled past. */
export function MaskWords({ text, className, delay = 0 }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const state = useViewState(ref, { amount: 0.6 });
  const words = text.trim().split(/\s+/);

  return (
    <m.p
      ref={ref}
      className={className}
      initial="below"
      animate={state}
      variants={{
        below: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
        inside: { transition: { staggerChildren: 0.025, delayChildren: delay } },
        above: { transition: { staggerChildren: 0.01 } },
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
              <m.span data-reveal="" className="inline-block" variants={word}>
                {w}
              </m.span>
            </span>
          </Fragment>
        ))}
      </span>
    </m.p>
  );
}
