"use client";

import { AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ExternalAnchor } from "@/components/ui/ExternalAnchor";
import { Icon } from "@/components/ui/Icon";
import { LocalTime } from "@/components/ui/LocalTime";
import type { Channel } from "@/content/channels";
import type { Dictionary } from "@/i18n";
import { getLenis, scrollToId, scrollToTop } from "@/lib/scroll";
import { cn } from "@/lib/cn";

type Props = {
  t: Dictionary["nav"];
  brand: string;
  channels: Channel[];
  clock: { city: string; timeZone: string; offset: string };
};

const EASE = [0.16, 1, 0.3, 1] as const;
const CURTAIN = [0.76, 0, 0.24, 1] as const;

export function Header({ t, brand, channels, clock }: Props) {
  const direct = channels.filter((channel) => channel.kind === "direct");
  const socials = channels.filter((channel) => channel.kind === "social");
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const [origin, setOrigin] = useState({ x: 0, y: 0, r: 2000 });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 420 && y > prev + 2);
  });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    getLenis()?.stop();
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 350);
    const toggle = toggleRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      root.style.overflow = "";
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const toggle = () => {
    const b = toggleRef.current?.getBoundingClientRect();
    if (b) {
      const x = b.left + b.width / 2;
      const y = b.top + b.height / 2;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      setOrigin({ x, y, r });
    }
    setOpen(!open);
  };

  const goTo = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    if (document.getElementById(id)) {
      window.setTimeout(() => scrollToId(id), open ? 420 : 0);
    } else {
      router.push(`/#${id}`, { transitionTypes: ["page-back"] });
    }
  };

  const circle = (r: number) => `circle(${r}px at ${origin.x}px ${origin.y}px)`;

  return (
    <>
      <m.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
        style={{ viewTransitionName: "site-header" }}
        animate={{ y: hidden && !open ? "-130%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="shell flex items-center justify-between pt-4 md:pt-6">
          <Link
            href="/"
            className="pill group pointer-events-auto !gap-0 !px-5 !py-2 font-serif !text-[1.55rem] italic !leading-none md:!px-6 md:!py-2.5 md:!text-[1.7rem]"
            aria-label={`${brand}, ${t.home}`}
            transitionTypes={["page-back"]}
            onClick={(e) => {
              setOpen(false);
              if (onHome) {
                e.preventDefault();
                window.setTimeout(scrollToTop, open ? 420 : 0);
              }
            }}
          >
            {brand}
            <span className="not-italic text-accent-bright transition-colors group-hover:text-accent">.</span>
          </Link>

          <div className="pointer-events-auto flex items-center gap-2.5">
            <button
              ref={toggleRef}
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t.close : t.menu}
              className="group relative grid size-12 place-items-center rounded-full bg-card shadow-soft ring-1 ring-black/[0.06] transition-transform duration-500 ease-out-expo hover:scale-105 md:size-[3.25rem]"
            >
              <span aria-hidden className="relative block h-2.5 w-[1.15rem]">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-full rounded bg-ink transition-transform duration-500 ease-out-expo",
                    open && "translate-y-[4.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-ink transition-transform duration-500 ease-out-expo",
                    open && "-translate-y-[4.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.menu}
            className="on-dark fixed inset-0 z-40 overflow-y-auto bg-ink text-paper"
            initial={reduce ? { opacity: 0 } : { clipPath: circle(0) }}
            animate={reduce ? { opacity: 1 } : { clipPath: circle(origin.r) }}
            exit={reduce ? { opacity: 0 } : { clipPath: circle(0), transition: { duration: 0.6, ease: CURTAIN } }}
            transition={{ duration: 0.9, ease: CURTAIN }}
          >
            <div aria-hidden className="beams-dark" />
            <div className="shell relative grid min-h-full content-between gap-14 pb-10 pt-28 md:grid-cols-12 md:content-center md:pt-32">
              <nav aria-label="Main" className="md:col-span-7">
                <ul>
                  {t.links.map((link, i) => (
                    <li key={link.id} className="overflow-hidden border-b border-white/10 first:border-t">
                      <m.div
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.06 }}
                      >
                        <Link
                          ref={i === 0 ? firstLinkRef : undefined}
                          href={`/#${link.id}`}
                          onClick={goTo(link.id)}
                          className="group flex items-baseline justify-between gap-6 py-3 md:py-4"
                        >
                          <span className="font-serif text-[clamp(2.9rem,7.5vw,6rem)] leading-[0.95] tracking-[-0.02em] transition-[transform,color] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:italic group-hover:text-accent-bright">
                            {link.label}
                          </span>
                          <span className="font-serif text-xl italic text-white/40">0{i + 1}</span>
                        </Link>
                      </m.div>
                    </li>
                  ))}
                </ul>
              </nav>

              <m.aside
                className="grid content-start gap-10 md:col-span-4 md:col-start-9 md:self-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              >
                <div>
                  <p className="label !text-white/45">{t.getInTouch}</p>
                  {direct.map((channel, i) => (
                    <ExternalAnchor
                      key={channel.href}
                      href={channel.href}
                      external={channel.external}
                      className={cn(
                        "block w-fit font-serif text-[1.9rem] leading-tight link-draw",
                        i === 0 ? "mt-3" : "mt-1 italic text-white/70",
                      )}
                    >
                      {channel.handle}
                    </ExternalAnchor>
                  ))}
                </div>
                {socials.length > 0 && (
                  <div>
                    <p className="label !text-white/45">{t.elsewhere}</p>
                    <ul className="mt-4 flex flex-wrap gap-2.5">
                      {socials.map((channel) => (
                        <li key={channel.href}>
                          <ExternalAnchor
                            href={channel.href}
                            rel="me"
                            aria-label={channel.label}
                            className="grid size-12 place-items-center rounded-full border border-white/15 text-white/80 transition-[background-color,color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:bg-paper hover:text-ink"
                          >
                            <Icon name={channel.icon} className="size-[1.1rem]" />
                          </ExternalAnchor>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="label !text-white/45">
                    {t.localTime} {clock.city}
                  </p>
                  <p className="mt-2 font-serif text-[2.6rem] leading-none tabular-nums">
                    <LocalTime timeZone={clock.timeZone} />
                    <span className="ml-2 align-middle font-sans text-sm text-white/45">{clock.offset}</span>
                  </p>
                </div>
              </m.aside>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
