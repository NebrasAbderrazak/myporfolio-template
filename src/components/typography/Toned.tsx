import { Fragment } from "react";
import type { Emphasis } from "@/content/emphasis";
import { cn } from "@/lib/cn";

export function Toned({ value }: { value: Emphasis }) {
  return value.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && " "}
      {line.map((segment, si) => (
        <span key={si} className={cn(`tone-${segment.tone}`, segment.italic && "italic")}>
          {segment.text}
        </span>
      ))}
    </Fragment>
  ));
}
