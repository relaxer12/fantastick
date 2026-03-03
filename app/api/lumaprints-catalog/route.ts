import { NextResponse } from 'next/server';
import { fetchLumaprintsCatalog } from '@/lib/lumaprints';

const LUMAPRINTS_BASE = 'https://us.api.lumaprints.com';

function getAuthHeader(): string {
  const apiKey = process.env.LUMAPRINTS_API_KEY;
  const apiSecret = process.env.LUMAPRINTS_API_SECRET;
  const encoded = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  return `Basic ${encoded}`;
}

async function getOptions(subcategoryId: number) {
  const res = await fetch(
    `${LUMAPRINTS_BASE}/api/v1/products/subcategories/${subcategoryId}/options`,
    { headers: { Authorization: getAuthHeader() } }
  );
  if (!res.ok) return { error: res.status };
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== process.env.CATALOG_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch full catalog
    const catalog = await fetchLumaprintsCatalog();

    // Fetch options for our three frame subcategories + unframed
    const frameOptions = {
      black_105005:    await getOptions(105005), // 1.25in Black Frame
      white_105006:    await getOptions(105006), // 1.25in White Frame
      oak_105007:      await getOptions(105007), // 1.25in Oak Frame
      unframed_103001: await getOptions(103001), // Archival Matte Fine Art Paper
    };

    return NextResponse.json({ catalog, frameOptions });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
