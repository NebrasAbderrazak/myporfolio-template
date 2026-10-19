import { LaptopHinge } from "@/components/motion/Hinge";
import type { VideoSources } from "@/components/media/LoopVideo";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { cn } from "@/lib/cn";

export type DeviceKind = "laptop" | "phone" | "browser" | "none";

type Props = {
  kind: DeviceKind;
  src?: string;
  video?: VideoSources;
  alt: string;
  sizes: string;
  open?: boolean;
  priority?: boolean;
  fallback?: string;
  className?: string;
};

export function Device({ kind, src, video, alt, sizes, open = false, priority, fallback = "", className }: Props) {
  const screen = src ? (
    <ProjectMedia src={src} alt={alt} sizes={sizes} video={video} priority={priority} />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <span className="font-serif text-[clamp(2.5rem,8vw,7rem)] italic leading-none text-paper/90">{fallback.charAt(0)}</span>
    </div>
  );

  if (kind === "phone") {
    return (
      <div className={cn("device-phone", className)}>
        <div className="screen">
          <span className="island" aria-hidden />
          {screen}
        </div>
      </div>
    );
  }

  if (kind === "browser") {
    return (
      <div className={cn("device-browser", className)}>
        <div className="bar" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div className="screen">{screen}</div>
      </div>
    );
  }

  if (kind === "none") {
    return <div className={cn("relative aspect-[16/10] overflow-hidden rounded-2xl", className)}>{screen}</div>;
  }

  const lid = <div className="screen">{screen}</div>;
  if (open) return <LaptopHinge className={className}>{lid}</LaptopHinge>;
  return (
    <div className={cn("device-laptop", className)}>
      <div className="lid">{lid}</div>
      <div className="base" aria-hidden />
    </div>
  );
}
