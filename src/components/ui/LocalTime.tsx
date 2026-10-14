"use client";

import { useMinute } from "@/lib/hooks";

export function LocalTime({ timeZone, className }: { timeZone: string; className?: string }) {
  const now = useMinute();
  const text =
    now === null
      ? "--:--"
      : new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(now);
  return (
    <time className={className} dateTime={now === null ? undefined : new Date(now).toISOString()}>
      {text}
    </time>
  );
}
