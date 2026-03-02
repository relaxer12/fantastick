import type { PrintSize, PrintFormat, FrameColor } from './pricing';

const LUMAPRINTS_API_BASE = 'https://api.lumaprints.com/v1';

// Map our size strings to Lumaprints dimensions
const sizeDimensions: Record<PrintSize, { width: number; height: number }> = {
  '4x6':   { width: 4,  height: 6 },
  '5x7':   { width: 5,  height: 7 },
  '8x10':  { width: 8,  height: 10 },
  '11x14': { width: 11, height: 14 },
  '12x16': { width: 12, height: 16 },
  '16x20': { width: 16, height: 20 },
  '16x24': { width: 16, height: 24 },
};

// Lumaprints product type codes
const PRODUCT_FINE_ART_PAPER = 'fine-art-paper-archival-matte';
const PRODUCT_FRAMED_FINE_ART = 'framed-fine-art-paper-1-25in';

const frameColorCodes: Record<FrameColor, string> = {
  black: 'black',
  maple: 'maple-wood',
  espresso: 'espresso',
};

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface LumaprintsOrderItem {
  product: string;
  width: number;
  height: number;
  imageUrl: string;
  frameColor?: string;
  quantity: number;
}

export interface LumaprintsOrderPayload {
  externalOrderId: string;
  items: LumaprintsOrderItem[];
  shippingAddress: ShippingAddress;
}

export interface LumaprintsOrderResponse {
  orderId: string;
  status: string;
  estimatedDelivery?: string;
}

export async function createLumaprintsOrder(
  externalOrderId: string,
  photoUrl: string,
  size: PrintSize,
  format: PrintFormat,
  frameColor: FrameColor | undefined,
  shippingAddress: ShippingAddress
): Promise<LumaprintsOrderResponse> {
  const apiKey = process.env.LUMAPRINTS_API_KEY;
  if (!apiKey) {
    throw new Error('LUMAPRINTS_API_KEY is not set');
  }

  const dimensions = sizeDimensions[size];

  const item: LumaprintsOrderItem = {
    product: format === 'framed' ? PRODUCT_FRAMED_FINE_ART : PRODUCT_FINE_ART_PAPER,
    width: dimensions.width,
    height: dimensions.height,
    imageUrl: photoUrl,
    quantity: 1,
  };

  if (format === 'framed' && frameColor) {
    item.frameColor = frameColorCodes[frameColor];
  }

  const payload: LumaprintsOrderPayload = {
    externalOrderId,
    items: [item],
    shippingAddress,
  };

  const response = await fetch(`${LUMAPRINTS_API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lumaprints API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<LumaprintsOrderResponse>;
}
