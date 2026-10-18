import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const HEADER_OFFSET = 72;

export function scrollToId(id: string, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4, immediate });
  } else {
    window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
  }
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
  return true;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
