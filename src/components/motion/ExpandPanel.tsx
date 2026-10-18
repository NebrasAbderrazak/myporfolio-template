"use client";

import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { useWideScreen } from "@/lib/hooks";
import { cn } from "@/lib/cn";

export function ExpandPanel({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useWideScreen();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.4"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.85, 1], [64, 24, 0]);
  const active = wide && !reduce;

  return (
    <div ref={ref}>
      <m.div className={cn("origin-top", className)} style={active ? { scale, borderRadius: radius } : undefined}>
        {children}
      </m.div>
    </div>
  );
}

export function RisingWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "16%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative select-none overflow-hidden">
      <m.p
        className="text-center font-serif text-[clamp(6rem,29vw,30rem)] italic leading-[0.8] tracking-[-0.03em] text-white/[0.07]"
        style={reduce ? { y: "16%" } : { y, opacity }}
      >
        {text}
      </m.p>
    </div>
  );
}
