"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/cn";

export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18, mass: 0.6 });
  const active = fine && !reduce;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 1.4);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className={cn("absolute inset-0 [perspective:1400px]", className)} onPointerMove={onMove} onPointerLeave={onLeave}>
      <m.div className="size-full" style={active ? { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" } : undefined}>
        {children}
      </m.div>
    </div>
  );
}
