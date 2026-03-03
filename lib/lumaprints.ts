import type { PrintSize, PrintFormat, FrameColor, MatSize } from './pricing';
import { matSizeOptionIds, sizeDimensions } from './pricing';

const LUMAPRINTS_BASE = 'https://us.api.lumaprints.com';
const STORE_ID = 82920;

// ─── Subcategory IDs per Lumaprints Product Configuration docs ───────────────
// https://api-docs.lumaprints.com/doc-420501
const SUBCATEGORY_ARCHIVAL_MATTE = 103001; // Print only
const SUBCATEGORY_BLACK_FRAME = 105005; // 1.25in Black
const SUBCATEGORY_WHITE_FRAME = 105006; // 1.25in White
const SUBCATEGORY_OAK_FRAME   = 105007; // 1.25in Oak

const framedSubcategoryMap: Record<FrameColor, number> = {
  black: SUBCATEGORY_BLACK_FRAME,
  white: SUBCATEGORY_WHITE_FRAME,
  oak:   SUBCATEGORY_OAK_FRAME,
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

export function getLumaprintsSubcategory(format: PrintFormat, frameColor?: FrameColor): number {
  return format === 'framed' && frameColor
    ? framedSubcategoryMap[frameColor]
    : SUBCATEGORY_ARCHIVAL_MATTE;
}

export function getLumaprintsOrderItemOptions(
  format: PrintFormat,
  matSize: MatSize | undefined
): number[] {
  // orderItemOptions is required by OrderItemsDto schema for all order items.
  if (format === 'framed') {
    return [
      74,  // Paper Type: Archival Matte
      matSizeOptionIds[matSize ?? 'none'], // Mat size (64 = No Mat)
      ...(matSize && matSize !== 'none' ? [96] : []), // Mat color white only if mat exists
      83,  // Hanging wire
      95,  // Kraft paper backing
    ];
  }

  return [36]; // Fine Art Paper bleed: 0.25in (default)
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

  // Match ordered dimensions to image orientation to satisfy aspect checks.
  if (photoAspectRatio && Number.isFinite(photoAspectRatio) && photoAspectRatio > 1 && width < height) {
    [width, height] = [height, width];
  }

  const subcategoryId = getLumaprintsSubcategory(format, frameColor);
  const orderItemOptions = getLumaprintsOrderItemOptions(format, matSize);

  // Split full name into first / last
  const nameParts = shipping.name.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '.';

  const payload = {
    externalId: externalOrderId,
    storeId: STORE_ID,
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
        orderItemOptions,
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
