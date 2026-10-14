"use client";

import { useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Token = { word: string; italic: boolean };

function tokenize(text: string): Token[] {
  let italic = false;
  return text.split(/\s+/).map((raw) => {
    const starts = raw.startsWith("*");
    if (starts) italic = true;
    const token = { word: raw.replace(/\*/g, ""), italic };
    if (/\*[.,;:!?]*$/.test(raw) && (!starts || raw.length > 1)) italic = false;
    return token;
  });
}

function Word({ token, progress, range }: { token: Token; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <m.span data-reveal="" style={{ opacity }} className={cn(token.italic && "italic text-accent")}>
      {token.word}
    </m.span>
  );
}

export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const tokens = tokenize(text);

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {tokens.map((t, i) => (
          <span key={i} className={cn(t.italic && "italic text-accent")}>
            {i > 0 && " "}
            {t.word}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, i) => (
        <span key={i}>
          {i > 0 && " "}
          <Word token={token} progress={scrollYProgress} range={[i / tokens.length, (i + 1) / tokens.length]} />
        </span>
      ))}
    </p>
  );
}
