"use client";

import {
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { cn } from "@/lib/cn";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

type Props = {
  items: string[];
  direction?: 1 | -1;
  speed?: number;
  className?: string;
  italic?: boolean;
};

export function Marquee({ items, direction = 1, speed = 2.2, className, italic }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px 0px" });
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef<number>(direction);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    const b = boost.get();
    if (b < 0) dir.current = -direction;
    else if (b > 0) dir.current = direction;
    const move = dir.current * speed * (delta / 1000) * (1 + Math.abs(b));
    baseX.set(baseX.get() - move);
  });

  const row = (copy: number) => (
    <div aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={`${copy}-${item}`} className="flex items-center">
          <span className={cn("px-5 md:px-8", italic && "italic")}>{item}</span>
          <svg viewBox="0 0 24 24" aria-hidden className="size-[0.32em] shrink-0 text-accent-bright">
            <path fill="currentColor" d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={cn("overflow-hidden whitespace-nowrap", className)}>
      <m.div className="flex w-max" style={{ x }}>
        {row(0)}
        {row(1)}
      </m.div>
    </div>
  );
}
