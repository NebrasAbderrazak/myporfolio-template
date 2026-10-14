"use client";

import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  return (
    <Tag
      id={id}
      className={cn(
        "flex items-center gap-4 font-serif text-[1.3rem] italic leading-none md:text-[1.5rem]",
        align === "center" ? "justify-center" : "justify-start",
        dark ? "text-white/55" : "text-ink-faint",
        className,
      )}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      {align === "center" && (
        <m.span
          aria-hidden
          className={cn(line, "origin-right")}
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease: EASE } } }}
        />
      )}
      <m.span
        data-reveal=""
        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
      >
        {children}
      </m.span>
      <m.span
        aria-hidden
        className={cn(line, "origin-left")}
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease: EASE } } }}
      />
    </Tag>
  );
}
