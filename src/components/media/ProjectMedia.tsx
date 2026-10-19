import { LoopVideo, type VideoSources } from "./LoopVideo";
import { Picture } from "./Picture";

type Props = {
  /** Still image: the screenshot, or the fallback behind a video. */
  src: string;
  alt: string;
  sizes: string;
  video?: VideoSources;
  priority?: boolean;
};

/** Fills its positioned parent with a looping video when the project has one, and with its image otherwise. */
export function ProjectMedia({ src, alt, sizes, video, priority }: Props) {
  if (video) {
    return <LoopVideo {...video} label={alt} className="absolute inset-0 size-full object-cover" />;
  }

  return (
    <Picture
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover object-top"
      {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
    />
  );
}
