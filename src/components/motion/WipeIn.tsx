"use client";

import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { EASE } from "./Reveal";

const OUT = { duration: 0.6, ease: [0.4, 0, 1, 1] as const };
const IN = { duration: 1.3, ease: EASE };

const frame = {
  below: { clipPath: "inset(16% 8% 0% 8% round 1.75rem)", transition: OUT },
  inside: { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", transition: IN },
  above: { clipPath: "inset(0% 8% 16% 8% round 1.75rem)", transition: OUT },
};

const content = {
  below: { scale: 1.14, transition: OUT },
  inside: { scale: 1, transition: IN },
  above: { scale: 1.08, transition: OUT },
};

/**
 * Opens its content like a window: the frame unclips while the picture settles
 * from a slight zoom. Follows the view state of the nearest CardReveal.
 */
export function WipeIn({ children }: { children: ReactNode }) {
  return (
    <m.div data-reveal="" variants={frame}>
      <m.div data-reveal="" className="origin-bottom" variants={content}>
        {children}
      </m.div>
    </m.div>
  );
}
