"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

/**
 * Where an element sits relative to the viewport:
 * "below" until it scrolls in, "inside" while visible, "above" once scrolled past.
 * Used as the variant name, so reveals enter from below and leave upwards.
 */
export type ViewState = "below" | "inside" | "above";

type Options = {
  /** Share of the element that must be visible to count as inside. */
  amount?: number;
  /** IntersectionObserver root margin. */
  margin?: string;
};

export function useViewState(ref: RefObject<Element | null>, { amount = 0.12, margin = "0px" }: Options = {}): ViewState {
  const [state, setState] = useState<ViewState>("below");
  const reduce = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= amount * 0.99) {
          setState("inside");
        } else if (!reduce) {
          const top = entry.rootBounds?.top ?? 0;
          setState(entry.boundingClientRect.top < top ? "above" : "below");
        }
      },
      { threshold: [0, amount], rootMargin: margin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, amount, margin, reduce]);

  return state;
}
