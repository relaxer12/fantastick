import { NextResponse } from 'next/server';
import { fetchLumaprintsCatalog } from '@/lib/lumaprints';

// Secret-gated endpoint — call this once to discover real subcategory + option IDs
// Usage: GET /api/lumaprints-catalog?secret=YOUR_SECRET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== process.env.CATALOG_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const catalog = await fetchLumaprintsCatalog();
    return NextResponse.json(catalog);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
