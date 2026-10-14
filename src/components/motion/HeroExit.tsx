"use client";

import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { useWideScreen } from "@/lib/hooks";

export function HeroExit({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const wide = useWideScreen();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 800], [1, 0.86]);
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const opacity = useTransform(scrollY, [150, 750], [1, 0]);
  const active = wide && !reduce;

  return (
    <m.div className="origin-top" style={active ? { scale, y, opacity } : undefined}>
      {children}
    </m.div>
  );
}
