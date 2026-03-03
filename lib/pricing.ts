export type PrintSize =
  // Portrait
  | '4x6' | '5x7' | '8x10' | '11x14' | '12x16' | '16x20' | '16x24'
  | '8x12' | '12x18' | '20x30'
  // Landscape counterparts
  | '6x4' | '7x5' | '10x8' | '14x11' | '16x12' | '20x16' | '24x16'
  | '12x8' | '18x12' | '30x20'
  // Square
  | '8x8' | '10x10' | '12x12' | '16x16';

export type PrintFormat = 'print' | 'framed';
export type FrameColor = 'black' | 'white' | 'oak';
export type MatSize = 'none' | '1.0' | '1.5' | '2.0' | '2.5' | '3.0';
export type CropMode = 'fill' | 'fit';

export const printSizes: PrintSize[] = [
  // Portrait
  '4x6', '5x7', '8x10', '11x14', '12x16', '16x20', '16x24',
  '8x12', '12x18', '20x30',
  // Landscape
  '6x4', '7x5', '10x8', '14x11', '16x12', '20x16', '24x16',
  '12x8', '18x12', '30x20',
  // Square
  '8x8', '10x10', '12x12', '16x16',
];

export const sizeDimensions: Record<PrintSize, { width: number; height: number }> = {
  // Portrait
  '4x6':   { width: 4,  height: 6 },
  '5x7':   { width: 5,  height: 7 },
  '8x10':  { width: 8,  height: 10 },
  '11x14': { width: 11, height: 14 },
  '12x16': { width: 12, height: 16 },
  '16x20': { width: 16, height: 20 },
  '16x24': { width: 16, height: 24 },
  '8x12':  { width: 8,  height: 12 },
  '12x18': { width: 12, height: 18 },
  '20x30': { width: 20, height: 30 },

  // Landscape
  '6x4':   { width: 6,  height: 4 },
  '7x5':   { width: 7,  height: 5 },
  '10x8':  { width: 10, height: 8 },
  '14x11': { width: 14, height: 11 },
  '16x12': { width: 16, height: 12 },
  '20x16': { width: 20, height: 16 },
  '24x16': { width: 24, height: 16 },
  '12x8':  { width: 12, height: 8 },
  '18x12': { width: 18, height: 12 },
  '30x20': { width: 30, height: 20 },

  // Square
  '8x8':   { width: 8,  height: 8 },
  '10x10': { width: 10, height: 10 },
  '12x12': { width: 12, height: 12 },
  '16x16': { width: 16, height: 16 },
};

// Normalized short/long ratio for each print size (orientation-independent)
const printSizeRatios: Record<PrintSize, number> = Object.fromEntries(
  Object.entries(sizeDimensions).map(([size, d]) => [size, Math.min(d.width, d.height) / Math.max(d.width, d.height)])
) as Record<PrintSize, number>;

/**
 * Returns print sizes that naturally match the photo ratio (no crop/border needed).
 * Uses Lumaprints 1% aspect tolerance.
 */
export function getCompatibleSizes(photoAspectRatio: number): PrintSize[] {
  const photoRatio = photoAspectRatio > 1 ? 1 / photoAspectRatio : photoAspectRatio;

  return printSizes.filter((size) => {
    const diff = Math.abs(printSizeRatios[size] - photoRatio) / Math.max(printSizeRatios[size], photoRatio);
    return diff <= 0.01;
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

export const matSizeOptionIds: Record<MatSize, number> = {
  none:  64,
  '1.0': 65,
  '1.5': 66,
  '2.0': 67,
  '2.5': 68,
  '3.0': 69,
};

export const printSizeLabels: Record<PrintSize, string> = {
  // Portrait
  '4x6': '4 × 6"',
  '5x7': '5 × 7"',
  '8x10': '8 × 10"',
  '11x14': '11 × 14"',
  '12x16': '12 × 16"',
  '16x20': '16 × 20"',
  '16x24': '16 × 24"',
  '8x12': '8 × 12"',
  '12x18': '12 × 18"',
  '20x30': '20 × 30"',

  // Landscape
  '6x4': '6 × 4"',
  '7x5': '7 × 5"',
  '10x8': '10 × 8"',
  '14x11': '14 × 11"',
  '16x12': '16 × 12"',
  '20x16': '20 × 16"',
  '24x16': '24 × 16"',
  '12x8': '12 × 8"',
  '18x12': '18 × 12"',
  '30x20': '30 × 20"',

  // Square
  '8x8': '8 × 8"',
  '10x10': '10 × 10"',
  '12x12': '12 × 12"',
  '16x16': '16 × 16"',
};

export const frameColors: FrameColor[] = ['black', 'white', 'oak'];

export const frameColorLabels: Record<FrameColor, string> = {
  black: 'Black',
  white: 'White',
  oak:   'Oak',
};

// Base print prices (customer-facing)
const printPrices: Record<PrintSize, number> = {
  // Portrait
  '4x6': 18,
  '5x7': 28,
  '8x10': 45,
  '11x14': 65,
  '12x16': 80,
  '16x20': 110,
  '16x24': 135,
  '8x12': 55,
  '12x18': 95,
  '20x30': 180,

  // Landscape (same as portrait counterparts)
  '6x4': 18,
  '7x5': 28,
  '10x8': 45,
  '14x11': 65,
  '16x12': 80,
  '20x16': 110,
  '24x16': 135,
  '12x8': 55,
  '18x12': 95,
  '30x20': 180,

  // Square
  '8x8': 40,
  '10x10': 55,
  '12x12': 70,
  '16x16': 100,
};

const frameAddonPrices: Record<FrameColor, number> = {
  black: 55,
  white: 65,
  oak:   65,
};

export const matAddonPrices: Record<MatSize, number> = {
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
