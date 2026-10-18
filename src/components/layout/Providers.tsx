"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";
import type { BackgroundStyle } from "@/content/schema";
import { Cursor } from "@/components/motion/Cursor";
import { LivingBackground } from "@/components/motion/LivingBackground";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export function Providers({ children, background }: { children: ReactNode; background: BackgroundStyle }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <LivingBackground style={background} />
        <SmoothScroll />
        {children}
        <Cursor />
      </LazyMotion>
    </MotionConfig>
  );
}
