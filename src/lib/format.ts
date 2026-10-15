const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats an ISO date (YYYY-MM-DD) without depending on the build machine's time zone. */
export function formatDate(iso: string, style: "long" | "short" = "long") {
  const [year, month, day] = iso.split("-").map(Number);
  if (style === "short") return `${day} ${SHORT_MONTHS[month - 1]} ${year}`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

/** "GMT+1" style label for a time zone, as it is right now. */
export function utcOffsetLabel(timeZone: string, at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" }).formatToParts(at);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
}

export function hostname(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}
