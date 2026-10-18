"use client";

import type { Transition, Variants } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useViewState } from "./useViewState";

export const EASE = [0.16, 1, 0.3, 1] as const;
const ENTER: Transition = { duration: 0.9, ease: EASE };
const EXIT: Transition = { duration: 0.55, ease: [0.4, 0, 1, 1] };

type Pose = Record<string, string | number>;

function presence(below: Pose, inside: Pose, above: Pose, enter: Transition = ENTER): Variants {
  return {
    below: { ...below, transition: EXIT },
    inside: { ...inside, transition: enter },
    above: { ...above, transition: EXIT },
  };
}

const ITEM_POSES: [Pose, Pose, Pose] = [
  { opacity: 0, y: 26 },
  { opacity: 1, y: 0 },
  { opacity: 0, y: -26 },
];
const itemVariants = presence(...ITEM_POSES);

const cardBelow = { opacity: 0, y: 80, scale: 0.94 };
const cardInside = { opacity: 1, y: 0, scale: 1 };
const cardAbove = { opacity: 0, y: -60, scale: 0.96 };

const VIEWPORT = { amount: 0.12, margin: "0px 0px -8% 0px" };

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
  const ref = useRef<HTMLDivElement>(null);
  const state = useViewState(ref, VIEWPORT);

  return (
    <Comp
      ref={ref}
      data-reveal=""
      initial="below"
      animate={state}
      variants={delay ? presence(...ITEM_POSES, { ...ENTER, delay }) : itemVariants}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Reveals its RevealItem children one after another, and hides them together. */
export function RevealGroup({ as = "div", delay = 0, stagger = 0.09, children, ...rest }: Props & { stagger?: number }) {
  const Comp = tags[as] as typeof m.div;
  const ref = useRef<HTMLDivElement>(null);
  const state = useViewState(ref, VIEWPORT);
  const leave = { transition: { staggerChildren: 0.04 } };

  return (
    <Comp
      ref={ref}
      initial="below"
      animate={state}
      variants={{ below: leave, inside: { transition: { staggerChildren: stagger, delayChildren: delay } }, above: leave }}
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

/** A project card list item that tracks the viewport on its own, so long grids reveal card by card. */
export function CardReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const state = useViewState(ref, { amount: 0.15 });

  return (
    <m.li
      ref={ref}
      data-reveal=""
      className={className}
      initial="below"
      animate={state}
      variants={presence(cardBelow, cardInside, cardAbove, { duration: 1.1, ease: EASE, delay })}
    >
      {children}
    </m.li>
  );
}
