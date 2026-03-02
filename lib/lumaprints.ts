import type { PrintSize, PrintFormat, FrameColor } from './pricing';

const LUMAPRINTS_BASE = 'https://us.api.lumaprints.com';
const STORE_ID = 82920;

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: These IDs must be verified via the Lumaprints catalog API once
// your account's payment method and billing address are configured.
// Call GET /api/v1/products/categories to list categories,
// then GET /api/v1/products/categories/{id}/subcategories for subcategoryIds,
// then GET /api/v1/products/categories/{id}/subcategories/{id}/options for option IDs.
// ─────────────────────────────────────────────────────────────────────────────

// subcategoryId for unframed fine art paper (archival matte) — VERIFY
const SUBCATEGORY_FINE_ART_PAPER = 103001;

// subcategoryId for 1.25" framed fine art paper — VERIFY
const SUBCATEGORY_FRAMED_FINE_ART = 103002;

// orderItemOption IDs for frame colors — VERIFY these numeric IDs
const FRAME_OPTION_IDS: Record<FrameColor, number> = {
  black: 11,
  maple: 23,
  espresso: 51,
};

// Size dimensions in inches
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
  const encoded = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  return `Basic ${encoded}`;
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
  const subcategoryId = format === 'framed' ? SUBCATEGORY_FRAMED_FINE_ART : SUBCATEGORY_FINE_ART_PAPER;

  // Build orderItemOptions — only add frame option for framed prints
  const orderItemOptions: number[] = [];
  if (format === 'framed' && frameColor) {
    orderItemOptions.push(FRAME_OPTION_IDS[frameColor]);
  }

  // Split name into first/last (Stripe gives us full name)
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
        ...(orderItemOptions.length > 0 ? { orderItemOptions } : {}),
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
// Helper: call this once to discover subcategoryIds and option IDs
// after your Lumaprints account payment/billing is configured.
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
