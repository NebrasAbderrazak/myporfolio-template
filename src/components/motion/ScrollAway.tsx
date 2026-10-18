"use client";

import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { useWideScreen } from "@/lib/hooks";

/**
 * Wraps the intro at the top of a page: as you scroll down it sinks back and fades,
 * and it returns as you scroll up. Phones get the fade and drift without the scale.
 */
export function ScrollAway({ children, distance = 800 }: { children: ReactNode; distance?: number }) {
  const reduce = useReducedMotion();
  const wide = useWideScreen();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, distance], [1, 0.86]);
  const y = useTransform(scrollY, [0, distance], [0, distance * 0.2]);
  const opacity = useTransform(scrollY, [distance * 0.19, distance * 0.94], [1, 0]);

  if (reduce) return <div>{children}</div>;
  return (
    <m.div className="origin-top" style={wide ? { scale, y, opacity } : { y, opacity }}>
      {children}
    </m.div>
  );
}
