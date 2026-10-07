import type { ImgHTMLAttributes } from "react";
import { preload } from "react-dom";
import { imageManifest } from "@/lib/imageManifest";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes"> & {
  /** Original path, e.g. "/images/aboutimg.webp" (must be listed in scripts/optimize-images.mjs) */
  src: string;
  /** How wide the image is drawn, e.g. "100vw" or "(max-width: 991px) 100vw, 50vw" */
  sizes: string;
  /** Above-the-fold hero image: preloaded with high priority and never lazy-loaded */
  priority?: boolean;
};

/**
 * Responsive image: the browser picks the copy (public/images/r/) that matches the size it is drawn at
 * and the screen's pixel density, so phones get a small file and large/retina screens a sharp one.
 * Every copy is high quality (see scripts/optimize-images.mjs). Unknown paths fall back to a plain <img>.
 */
export default function RImg({ src, sizes, priority, alt = "", ...rest }: Props) {
  const m = imageManifest[src];
  if (!m) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" {...rest} />;
  }
  const srcSet = m.widths.map((w) => `${m.base}-${w}.webp ${w}w`).join(", ");
  const full = `${m.base}-${m.width}.webp`;
  if (priority) preload(full, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={full}
      srcSet={srcSet}
      sizes={sizes}
      width={m.width}
      height={m.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding={priority ? "sync" : "async"}
      {...rest}
    />
  );
}
