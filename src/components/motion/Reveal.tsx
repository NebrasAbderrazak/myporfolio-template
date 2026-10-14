"use client";

import { type Transition, type Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const BASE: Transition = { duration: 0.9, ease: EASE };

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: BASE },
};

const VIEWPORT = { once: true, amount: 0.12, margin: "0px 0px -8% 0px" } as const;

const tags = {
  div: m.div,
  section: m.section,
  header: m.header,
  article: m.article,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  p: m.p,
  dl: m.dl,
};

type Tag = keyof typeof tags;

type Props = {
  as?: Tag;
  children?: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className" | "id" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd">;

export function Reveal({ as = "div", delay = 0, children, ...rest }: Props) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp
      data-reveal=""
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: itemVariants.hidden,
        show: { opacity: 1, y: 0, transition: { ...BASE, delay } },
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function RevealGroup({
  as = "div",
  delay = 0,
  stagger = 0.09,
  children,
  ...rest
}: Props & { stagger?: number }) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ as = "div", children, ...rest }: Omit<Props, "delay">) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp data-reveal="" variants={itemVariants} {...rest}>
      {children}
    </Comp>
  );
}

export function CardReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.li
      data-reveal=""
      className={className}
      variants={{
        hidden: { opacity: 0, y: 70, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: EASE } },
      }}
    >
      {children}
    </m.li>
  );
}

