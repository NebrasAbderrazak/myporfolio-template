import type { Segment } from "@/i18n";
import { cn } from "@/lib/cn";

export function Toned({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((s, i) => (
        <span key={i} className={cn(`tone-${s.tone}`, s.italic && "italic")}>
          {s.text}
        </span>
      ))}
    </>
  );
}

export function plain(segments: Segment[]) {
  return segments.map((s) => s.text).join("");
}
