import { getDictionary } from "@/i18n";

/** Marks sample entries so nobody mistakes them for real client work. */
export function PlaceholderBadge({ as: Tag = "span" }: { as?: "span" | "li" }) {
  return (
    <Tag className="pill border border-dashed border-line-strong !bg-transparent !shadow-none !text-[0.82rem] text-ink-soft">
      {getDictionary().work.placeholder}
    </Tag>
  );
}
