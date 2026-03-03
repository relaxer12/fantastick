const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Returns an optimized Cloudinary URL for a given public ID.
 *
 * @param publicId  e.g. "landscapes/alpine-silence"
 * @param width     desired pixel width
 * @param crop      crop mode (default: "fill")
 */
export function cldUrl(publicId: string, width: number, crop = 'fill'): string {
  return `${BASE}/c_${crop},w_${width},f_auto,q_auto/${publicId}`;
}

/** Thumbnail URL — 800px wide */
export const cldThumb = (publicId: string) => cldUrl(publicId, 800);

/** Full-res URL — 1600px wide */
export const cldFull = (publicId: string) => cldUrl(publicId, 1600);

/** Hero URL — 1920px wide */
export const cldHero = (publicId: string) => cldUrl(publicId, 1920);
