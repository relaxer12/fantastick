export type PrintSize = '4x6' | '5x7' | '8x10' | '11x14' | '12x16' | '16x20' | '16x24';
export type PrintFormat = 'print' | 'framed';
export type FrameColor = 'black' | 'maple' | 'espresso';

export const printSizes: PrintSize[] = ['4x6', '5x7', '8x10', '11x14', '12x16', '16x20', '16x24'];

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

export const SHIPPING_PRICE = 12;

export function getPrice(size: PrintSize, format: PrintFormat, frameColor?: FrameColor): number {
  const base = printPrices[size];
  if (format === 'framed' && frameColor) {
    return base + frameAddonPrices[frameColor];
  }
  return base;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function getPriceInCents(size: PrintSize, format: PrintFormat, frameColor?: FrameColor): number {
  return getPrice(size, format, frameColor) * 100;
}

export function getShippingInCents(): number {
  return SHIPPING_PRICE * 100;
}
