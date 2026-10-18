"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { useFinePointer } from "@/lib/hooks";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "light";
  external?: boolean;
  halo?: boolean;
  className?: string;
  icon?: "arrow-right" | "arrow-down" | "arrow-up-right" | "link";
};

const STYLES = {
  solid: { button: "bg-ink text-paper shadow-button", fill: "bg-accent", hoverText: "" },
  outline: {
    button: "bg-card/70 text-ink ring-1 ring-black/10 shadow-soft",
    fill: "bg-ink",
    hoverText: "group-hover:text-paper group-focus-visible:text-paper",
  },
  light: { button: "bg-paper text-ink shadow-button", fill: "bg-accent-bright", hoverText: "" },
};

export function MagneticButton({ href, children, variant = "solid", external, halo, className, icon = "arrow-right" }: Props) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const magnetic = fine && !reduce;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.6 });
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const s = STYLES[variant];

  const setFillOrigin = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
  };

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };

  const onLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    setFillOrigin(e);
    x.set(0);
    y.set(0);
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#") && scrollToId(href.slice(1))) e.preventDefault();
  };

  const vertical = icon === "arrow-down";

  const button = (
    <m.a
      href={href}
      onClick={onClick}
      onPointerEnter={setFillOrigin}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group relative isolate inline-flex min-h-[3.4rem] items-center justify-center gap-3 overflow-hidden rounded-full px-7 text-[1.02rem] font-medium tracking-[-0.005em] transition-colors duration-500 md:min-h-[3.75rem] md:px-8 md:text-[1.08rem]",
        s.button,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -z-10 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-700 ease-out-expo group-hover:scale-100 group-focus-visible:scale-100",
          s.fill,
        )}
        style={{ left: origin.x, top: origin.y }}
      />
      <span className={cn("transition-colors duration-500", s.hoverText)}>{children}</span>
      <span aria-hidden className={cn("relative block size-4 overflow-hidden transition-colors duration-500", s.hoverText)}>
        {[0, 1].map((i) => (
          <span
            key={i}
            className={cn(
              "absolute inset-0 transition-transform duration-500 ease-out-expo",
              i === 0
                ? vertical
                  ? "group-hover:translate-y-full"
                  : "group-hover:translate-x-full"
                : vertical
                  ? "-translate-y-full group-hover:translate-y-0"
                  : "-translate-x-full group-hover:translate-x-0",
            )}
          >
            <Icon name={icon} className="size-4" />
          </span>
        ))}
      </span>
    </m.a>
  );

  if (!halo) return button;
  return (
    <span className="inline-flex rounded-full p-1.5 ring-1 ring-current/10 [box-shadow:0_0_0_6px_rgb(255_255_255/0.04)]">{button}</span>
  );
}
