import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Picture } from "@/components/media/Picture";
import { ExternalAnchor } from "@/components/ui/ExternalAnchor";

function MarkdownImage({ src, alt, title }: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string") return null;
  return (
    <span className="prose-media block">
      <Picture
        src={src}
        alt={alt ?? ""}
        sizes="(min-width: 768px) 46rem, 100vw"
        className="h-auto w-full rounded-[1.25rem] bg-paper-deep shadow-soft ring-1 ring-black/[0.05]"
      />
      {title && <span className="figcaption mt-3 block text-center">{title}</span>}
    </span>
  );
}

const FILE_LINK = /.[a-z0-9]{2,5}$/i;

function MarkdownLink({ href = "", ...rest }: ComponentPropsWithoutRef<"a">) {
  // Links to files (a video, a PDF) are plain downloads, not pages for the router.
  if (href.startsWith("/") && !FILE_LINK.test(href)) return <Link href={href} {...rest} />;
  return <ExternalAnchor href={href} external={href.startsWith("/") || undefined} {...rest} />;
}

const components = { img: MarkdownImage, a: MarkdownLink };

type Props = {
  source: string;
  /** "md" for files written in the admin panel, "mdx" for files that use JSX. */
  format: "md" | "mdx";
};

export function Markdown({ source, format }: Props) {
  return <MDXRemote source={source} components={components} options={{ mdxOptions: { format } }} />;
}
