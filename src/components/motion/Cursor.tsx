"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/hooks";

export function Cursor() {
  const enabled = useFinePointer();
  const reduce = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let px = -200;
    let py = -200;

    const update = () => {
      const el = document.elementFromPoint(px, py);
      setLabel(el?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? null);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      x.set(px);
      y.set(py);
      update();
    };
    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", update);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
    >
      <m.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-paper"
        initial={false}
        animate={{ scale: label ? 1 : 0.2, opacity: label ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>{label ?? ""}</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </m.div>
    </m.div>
  );
}
