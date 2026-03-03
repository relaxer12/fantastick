export type PrintSize = '4x6' | '5x7' | '8x10' | '11x14' | '12x16' | '16x20' | '16x24';
export type PrintFormat = 'print' | 'framed';
export type FrameColor = 'black' | 'maple' | 'espresso';
export type MatSize = 'none' | '1.0' | '1.5' | '2.0' | '2.5' | '3.0';

export const printSizes: PrintSize[] = ['4x6', '5x7', '8x10', '11x14', '12x16', '16x20', '16x24'];

// Normalised short/long ratio for each print size (orientation-independent)
const printSizeRatios: Record<PrintSize, number> = {
  '4x6':   4 / 6,   // 0.6667
  '5x7':   5 / 7,   // 0.7143
  '8x10':  8 / 10,  // 0.8000
  '11x14': 11 / 14, // 0.7857
  '12x16': 12 / 16, // 0.7500
  '16x20': 16 / 20, // 0.8000
  '16x24': 16 / 24, // 0.6667
};

/**
 * Returns the print sizes compatible with a given photo aspect ratio.
 * Uses the same 1% tolerance enforced by Lumaprints.
 * Both portrait and landscape photos work — comparison is orientation-independent.
 */
export function getCompatibleSizes(photoAspectRatio: number): PrintSize[] {
  // Normalise photo ratio to short/long (always ≤ 1)
  const photoRatio = photoAspectRatio > 1
    ? 1 / photoAspectRatio
    : photoAspectRatio;

  return printSizes.filter((size) => {
    const diff = Math.abs(printSizeRatios[size] - photoRatio) / Math.max(printSizeRatios[size], photoRatio);
    return diff <= 0.01; // 1% tolerance — matches Lumaprints requirement
  });
}
export const matSizes: MatSize[] = ['none', '1.0', '1.5', '2.0', '2.5', '3.0'];

export const matSizeLabels: Record<MatSize, string> = {
  none:  'No Mat',
  '1.0': '1″ Mat',
  '1.5': '1.5″ Mat',
  '2.0': '2″ Mat',
  '2.5': '2.5″ Mat',
  '3.0': '3″ Mat',
};

// Lumaprints optionId for each mat size (same across all frame subcategories)
export const matSizeOptionIds: Record<MatSize, number> = {
  none:  64,
  '1.0': 65,
  '1.5': 66,
  '2.0': 67,
  '2.5': 68,
  '3.0': 69,
};

export const printSizeLabels: Record<PrintSize, string> = {
  '4x6': '4 × 6"',
  '5x7': '5 × 7"',
  '8x10': '8 × 10"',
  '11x14': '11 × 14"',
  '12x16': '12 × 16"',
  '16x20': '16 × 20"',
  '16x24': '16 × 24"',
};

export const frameColors: FrameColor[] = ['black', 'maple', 'espresso'];

export const frameColorLabels: Record<FrameColor, string> = {
  black: 'Black',
  maple: 'Maple',
  espresso: 'Espresso',
};

// Base print prices (customer-facing)
const printPrices: Record<PrintSize, number> = {
  '4x6': 18,
  '5x7': 28,
  '8x10': 45,
  '11x14': 65,
  '12x16': 80,
  '16x20': 110,
  '16x24': 135,
};

// Frame add-on prices
const frameAddonPrices: Record<FrameColor, number> = {
  black: 55,
  maple: 65,
  espresso: 60,
};

// Mat add-on prices (on top of frame price)
const matAddonPrices: Record<MatSize, number> = {
  none:  0,
  '1.0': 15,
  '1.5': 18,
  '2.0': 22,
  '2.5': 25,
  '3.0': 28,
};

export const SHIPPING_PRICE = 12;

export function getPrice(
  size: PrintSize,
  format: PrintFormat,
  frameColor?: FrameColor,
  matSize?: MatSize
): number {
  const base = printPrices[size];
  if (format === 'framed' && frameColor) {
    const frameAddon = frameAddonPrices[frameColor];
    const matAddon = matSize ? matAddonPrices[matSize] : 0;
    return base + frameAddon + matAddon;
  }
  return base;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function getPriceInCents(
  size: PrintSize,
  format: PrintFormat,
  frameColor?: FrameColor,
  matSize?: MatSize
): number {
  return getPrice(size, format, frameColor, matSize) * 100;
}

export function getShippingInCents(): number {
  return SHIPPING_PRICE * 100;
}
