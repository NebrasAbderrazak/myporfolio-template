"use client";

import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function LaptopHinge({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Measured on the untransformed laptop: a closed lid is flat and never counts as in view.
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className={cn("device-laptop", className)}>
      <m.div
        data-reveal=""
        className="lid"
        initial={reduce ? false : { rotateX: -92, opacity: 0.6 }}
        animate={inView || reduce ? { rotateX: 0, opacity: 1 } : undefined}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {children}
      </m.div>
      <div className="base" aria-hidden />
    </div>
  );
}
