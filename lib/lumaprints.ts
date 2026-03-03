import type { PrintSize, PrintFormat, FrameColor, MatSize } from './pricing';
import { matSizeOptionIds } from './pricing';

const LUMAPRINTS_BASE = 'https://us.api.lumaprints.com';
const STORE_ID = 82920;

// ─── Subcategory IDs per Lumaprints Product Configuration docs ───────────────
// https://api-docs.lumaprints.com/doc-420501
// Print Only
const SUBCATEGORY_ARCHIVAL_MATTE = 103001; // Archival Matte Fine Art Paper

// Framed Fine Art Paper — 1.25in frames (consistent depth across all colors)
const SUBCATEGORY_BLACK_FRAME = 105005; // 1.25in Black Frame
const SUBCATEGORY_WHITE_FRAME = 105006; // 1.25in White Frame
const SUBCATEGORY_OAK_FRAME   = 105007; // 1.25in Oak Frame
// ─────────────────────────────────────────────────────────────────────────────

const framedSubcategoryMap: Record<FrameColor, number> = {
  black: SUBCATEGORY_BLACK_FRAME,
  white: SUBCATEGORY_WHITE_FRAME,
  oak:   SUBCATEGORY_OAK_FRAME,
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
  matSize: MatSize | undefined,
  shipping: ShippingAddress,
  photoAspectRatio?: number
): Promise<LumaprintsOrderResponse> {
  const dims = sizeDimensions[size];
  let width = dims.width;
  let height = dims.height;

  // Match ordered dimensions to image orientation to satisfy Lumaprints aspect checks.
  if (photoAspectRatio && Number.isFinite(photoAspectRatio) && photoAspectRatio > 1 && width < height) {
    [width, height] = [height, width];
  }

  const subcategoryId =
    format === 'framed' && frameColor
      ? framedSubcategoryMap[frameColor]
      : SUBCATEGORY_ARCHIVAL_MATTE;

  // Split full name into first / last
  const nameParts = shipping.name.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '.';

  // orderItemOptions is required by the Lumaprints schema for all order items.
  // Framed Fine Art Paper options per docs: Mat Size, Mat Color, Paper Type, Hanging Hardware, Backing.
  // Options 146/149 (Glazing/Mount) are NOT in the documented catalog — omitted to prevent 400s.
  const orderItemOptions: number[] = format === 'framed'
    ? [
        74,  // Paper Type: Archival Matte Fine Art Paper
        matSizeOptionIds[matSize ?? 'none'], // Mat Size (64 = No Mat default)
        ...(matSize && matSize !== 'none' ? [96] : []), // Mat Color: White (only when mat exists)
        83,  // Hanging Hardware: Hanging Wire installed on frame
        95,  // Backing: Kraft Paper
      ]
    : [
        36,  // Fine Art Paper Bleed: 0.25in Bleed (default)
      ];

  const payload = {
    externalId: externalOrderId,
    storeId: STORE_ID, // number, not string — per API schema
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
      // phone is not required per Lumaprints RecipientDto schema — omitted
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
        orderItemOptions, // required field per schema
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

  const result = await response.json() as LumaprintsOrderResponse;
  console.log(`Lumaprints order created: orderNumber=${result.orderNumber} externalId=${externalOrderId}`);
  return result;
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
