"use client";

import { useReducedMotion, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";

export function RailFill({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="absolute bottom-3 left-[0.625rem] top-3 w-px bg-line md:left-[9.625rem]">
        <m.div className="absolute inset-0 origin-top bg-accent-bright" style={{ scaleY: reduce ? 1 : scaleY }} />
      </div>
      {children}
    </div>
  );
}
