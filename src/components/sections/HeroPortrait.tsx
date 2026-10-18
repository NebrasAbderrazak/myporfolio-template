import type { ReactNode } from "react";

export function HeroPortrait({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="enter-portrait relative size-[9.5rem] overflow-hidden rounded-full bg-paper-deep shadow-lift ring-[5px] ring-card md:size-[12.5rem]">
        {children}
      </div>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -inset-3 size-[calc(100%+1.5rem)] -rotate-90 md:-inset-4 md:size-[calc(100%+2rem)]"
      >
        <circle
          cx="50"
          cy="50"
          r="49.6"
          pathLength={1}
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth="0.5"
          className="enter-ring"
        />
      </svg>
      <span
        aria-hidden
        className="status-dot absolute bottom-[8%] right-[8%] size-4 rounded-full bg-accent-bright ring-4 ring-card md:size-[1.15rem]"
      />
    </div>
  );
}
