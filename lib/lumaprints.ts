import type { PrintSize, PrintFormat, FrameColor } from './pricing';

const LUMAPRINTS_BASE = 'https://us.api.lumaprints.com';
const STORE_ID = 82920;

// ─── Verified subcategoryIds from live catalog (2026-03-02) ──────────────────
// Print Only
const SUBCATEGORY_ARCHIVAL_MATTE = 103001; // Archival Matte Fine Art Paper

// Framed — each frame color is its own subcategory (max 60×40" each)
const SUBCATEGORY_BLACK_FRAME   = 105005; // 1.25w x 0.875h Black Frame
const SUBCATEGORY_MAPLE_FRAME   = 105022; // 1.25w x 0.875h Maple Wood Frame
const SUBCATEGORY_ESPRESSO_FRAME = 105012; // 0.875w x 1.125h Espresso Frame
// ─────────────────────────────────────────────────────────────────────────────

const framedSubcategoryMap: Record<FrameColor, number> = {
  black:    SUBCATEGORY_BLACK_FRAME,
  maple:    SUBCATEGORY_MAPLE_FRAME,
  espresso: SUBCATEGORY_ESPRESSO_FRAME,
};

const sizeDimensions: Record<PrintSize, { width: number; height: number }> = {
  '4x6':   { width: 4,  height: 6 },
  '5x7':   { width: 5,  height: 7 },
  '8x10':  { width: 8,  height: 10 },
  '11x14': { width: 11, height: 14 },
  '12x16': { width: 12, height: 16 },
  '16x20': { width: 16, height: 20 },
  '16x24': { width: 16, height: 24 },
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

export interface LumaprintsOrderResponse {
  message: string;
  orderNumber: number;
}

function getAuthHeader(): string {
  const apiKey = process.env.LUMAPRINTS_API_KEY;
  const apiSecret = process.env.LUMAPRINTS_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error('LUMAPRINTS_API_KEY and LUMAPRINTS_API_SECRET must be set');
  }
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
}

export async function createLumaprintsOrder(
  externalOrderId: string,
  photoUrl: string,
  size: PrintSize,
  format: PrintFormat,
  frameColor: FrameColor | undefined,
  shipping: ShippingAddress
): Promise<LumaprintsOrderResponse> {
  const { width, height } = sizeDimensions[size];

  const subcategoryId =
    format === 'framed' && frameColor
      ? framedSubcategoryMap[frameColor]
      : SUBCATEGORY_ARCHIVAL_MATTE;

  // Split full name into first / last
  const nameParts = shipping.name.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '.';

  const payload = {
    externalId: externalOrderId,
    storeId: String(STORE_ID),
    shippingMethod: 'default',
    productionTime: 'regular',
    recipient: {
      firstName,
      lastName,
      addressLine1: shipping.line1,
      ...(shipping.line2 ? { addressLine2: shipping.line2 } : {}),
      city: shipping.city,
      state: shipping.state,
      zipCode: shipping.postal_code,
      country: shipping.country,
      phone: '000-000-0000', // Stripe doesn't collect phone — placeholder
    },
    orderItems: [
      {
        externalItemId: `${externalOrderId}-1`,
        subcategoryId,
        quantity: 1,
        width,
        height,
        file: {
          imageUrl: photoUrl,
        },
        solidColorHexCode: null,
      },
    ],
  };

  const response = await fetch(`${LUMAPRINTS_BASE}/api/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lumaprints API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<LumaprintsOrderResponse>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalog discovery — used by /api/lumaprints-catalog
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchLumaprintsCatalog() {
  const auth = getAuthHeader();

  const cats = await fetch(`${LUMAPRINTS_BASE}/api/v1/products/categories`, {
    headers: { Authorization: auth },
  }).then((r) => r.json());

  const result: Record<string, unknown[]> = {};
  for (const cat of cats) {
    const subs = await fetch(
      `${LUMAPRINTS_BASE}/api/v1/products/categories/${cat.id}/subcategories`,
      { headers: { Authorization: auth } }
    ).then((r) => r.json());
    result[cat.name] = subs;
  }
  return result;
}
