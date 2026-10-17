import { BlurWords } from "@/components/motion/BlurWords";
import type { Emphasis } from "@/content/emphasis";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  title: Emphasis;
  align?: "left" | "center";
  size?: "lg" | "md";
};

export function SectionHeading({ id, title, align = "center", size = "lg" }: Props) {
  return (
    <h2 id={id} className={cn(size === "lg" ? "display-lg" : "display-md", align === "center" && "text-center")}>
      <BlurWords value={title} />
    </h2>
  );
}
