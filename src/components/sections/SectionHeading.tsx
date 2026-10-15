import { BlurWords } from "@/components/motion/BlurWords";
import { Overline } from "@/components/motion/Overline";
import type { Emphasis } from "@/content/emphasis";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  overline: string;
  title: Emphasis;
  align?: "left" | "center";
  size?: "lg" | "md";
};

export function SectionHeading({ id, overline, title, align = "center", size = "lg" }: Props) {
  return (
    <>
      <Overline align={align}>{overline}</Overline>
      <h2 id={id} className={cn("mt-6", size === "lg" ? "display-lg" : "display-md", align === "center" && "text-center")}>
        <BlurWords value={title} />
      </h2>
    </>
  );
}
