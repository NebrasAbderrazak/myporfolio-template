"use client";

import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE } from "./Reveal";
import { useViewState } from "./useViewState";

const OUT = { duration: 0.45, ease: EASE };
const IN = { duration: 1, ease: EASE };

const hairline = {
  below: { scaleX: 0, transition: OUT },
  inside: { scaleX: 1, transition: IN },
  above: { scaleX: 0, transition: OUT },
};

const label = {
  below: { opacity: 0, y: 8, transition: OUT },
  inside: { opacity: 1, y: 0, transition: { ...IN, duration: 0.8 } },
  above: { opacity: 0, y: -8, transition: OUT },
};

export function Overline({
  children,
  align = "center",
  dark = false,
  as = "p",
  id,
  className,
}: {
  children: ReactNode;
  align?: "center" | "left";
  dark?: boolean;
  as?: "p" | "h1" | "h2";
  id?: string;
  className?: string;
}) {
  const line = cn("block h-px w-10 md:w-20", dark ? "bg-white/20" : "bg-line-strong");
  const Tag = { p: m.p, h1: m.h1, h2: m.h2 }[as];
  const ref = useRef<HTMLParagraphElement>(null);
  const state = useViewState(ref, { amount: 0.6 });

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn(
        "flex items-center gap-4 font-serif text-[1.3rem] italic leading-none md:text-[1.5rem]",
        align === "center" ? "justify-center" : "justify-start",
        dark ? "text-white/55" : "text-ink-faint",
        className,
      )}
      initial="below"
      animate={state}
    >
      {align === "center" && (
        <m.span
          aria-hidden
          className={cn(line, "origin-right")}
          variants={hairline}
        />
      )}
      <m.span
        data-reveal=""
        variants={label}
      >
        {children}
      </m.span>
      <m.span
        aria-hidden
        className={cn(line, "origin-left")}
        variants={hairline}
      />
    </Tag>
  );
}
