"use client";

import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { useWideScreen } from "@/lib/hooks";

export function ScrollZoom({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useWideScreen();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const active = wide && !reduce;

  return (
    <m.div ref={ref} className={className} style={active ? { scale, y } : undefined}>
      {children}
    </m.div>
  );
}
