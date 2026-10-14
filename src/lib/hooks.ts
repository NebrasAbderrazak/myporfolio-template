"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const useWideScreen = () => useMediaQuery("(min-width: 768px)");

export function useMinute() {
  const minute = useSyncExternalStore(
    (onChange) => {
      const id = window.setInterval(onChange, 10_000);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / 60_000),
    () => -1,
  );
  return minute < 0 ? null : minute * 60_000;
}
