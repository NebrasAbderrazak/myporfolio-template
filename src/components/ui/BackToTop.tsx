"use client";

import { scrollToTop } from "@/lib/scroll";
import { Icon } from "./Icon";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTop();
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className="group inline-flex min-h-11 items-center gap-2"
    >
      <span className="link-draw">{label}</span>
      <Icon name="arrow-up" className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" />
    </button>
  );
}
