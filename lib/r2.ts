const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? 'https://pub-426ed2c6f024444c8b80fb544d13a890.r2.dev';

/**
 * Returns the public R2 URL for a given photo key.
 * @param key  e.g. "35mm/35mm-1-4.jpg" or "mf/MF-3-12.jpg"
 */
export function r2Url(key: string): string {
  return `${R2_BASE}/${key}`;
}
