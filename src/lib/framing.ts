export type Framing = {
  /** Horizontal focus point, 0–100 % of the image width. */
  x: number;
  /** Vertical focus point, 0–100 % of the image height. */
  y: number;
  /** 1 fills the frame; higher values zoom in on the focus point. */
  zoom: number;
};

/** Position of the image inside its frame, as fractions of the frame size. */
export type Placement = { left: number; top: number; width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Places an image inside a frame of the given aspect ratio so the focus point
 * sits as close to the centre as the edges allow, without ever showing a gap.
 */
export function placeImage(image: { width: number; height: number }, framing: Framing, frameAspect = 1): Placement {
  const imageAspect = image.width / image.height;
  const coverWidth = imageAspect >= frameAspect ? imageAspect / frameAspect : 1;
  const width = coverWidth * framing.zoom;
  const height = (width * frameAspect) / imageAspect;

  return {
    width,
    height,
    left: clamp(0.5 - (framing.x / 100) * width, 1 - width, 0),
    top: clamp(0.5 - (framing.y / 100) * height, 1 - height, 0),
  };
}
