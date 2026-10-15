"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE } from "./Reveal";
import { useViewState } from "./useViewState";

export function LaptopHinge({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Measured on the untransformed laptop: a closed lid is flat and never counts as in view.
  const open = useViewState(ref, { amount: 0.2 }) === "inside";
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className={cn("device-laptop", className)}>
      <m.div
        data-reveal=""
        className="lid"
        initial={reduce ? false : { rotateX: -92, opacity: 0.6 }}
        animate={open || reduce ? { rotateX: 0, opacity: 1 } : { rotateX: -92, opacity: 0.6 }}
        transition={open ? { duration: 1.6, ease: EASE, delay: 0.1 } : { duration: 0.7, ease: EASE }}
      >
        {children}
      </m.div>
      <div className="base" aria-hidden />
    </div>
  );
}
