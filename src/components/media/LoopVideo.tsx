"use client";

import { useEffect, useRef } from "react";

export type VideoSources = {
  mp4: string;
  webm?: string;
  poster?: string;
};

type Props = VideoSources & {
  label: string;
  className?: string;
};

const VISIBLE = 0.25;

/**
 * A muted, looping preview that plays only while it is on screen.
 * With "reduce motion" on, or without JavaScript, it stays on its poster frame.
 */
export function LoopVideo({ mp4, webm, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      if (visible && !motion.matches) {
        // play() rejects when the browser blocks autoplay; the poster simply stays up.
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: VISIBLE },
    );

    observer.observe(video);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
      disablePictureInPicture
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
