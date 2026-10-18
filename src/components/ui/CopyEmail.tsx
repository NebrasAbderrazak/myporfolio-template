"use client";

import { useRef, useState } from "react";
import { Icon } from "./Icon";

export function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number>(undefined);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setDone(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <a href={`mailto:${email}`} className="link-line font-serif text-[clamp(1.7rem,3.4vw,2.6rem)] italic leading-tight">
        {email}
      </a>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-current/20 px-4 text-[0.9rem] opacity-75 transition-opacity hover:opacity-100"
      >
        <Icon name="copy" className="size-4" />
        {done ? copied : copy}
      </button>
      <span className="sr-only" aria-live="polite">
        {done ? copied : ""}
      </span>
    </span>
  );
}
