import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getPriceInCents, getShippingInCents, printSizeLabels, frameColorLabels } from '@/lib/pricing';
import type { PrintSize, PrintFormat, FrameColor } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { photoId, photoTitle, photoSrc, size, format, frameColor } = body as {
      photoId: string;
      photoTitle: string;
      photoSrc: string;
      size: PrintSize;
      format: PrintFormat;
      frameColor?: FrameColor;
    };

    if (!photoId || !size || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const printAmountCents = getPriceInCents(size, format, frameColor);
    const shippingCents = getShippingInCents();

    const sizeLabel = printSizeLabels[size];
    const frameLabel = format === 'framed' && frameColor ? ` — ${frameColorLabels[frameColor]} Frame` : '';
    const productName = `${photoTitle} · ${sizeLabel} ${format === 'framed' ? 'Framed Print' : 'Print'}${frameLabel}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: `Fine art ${format === 'framed' ? 'framed ' : ''}print on archival matte paper`,
              images: [photoSrc],
            },
            unit_amount: printAmountCents,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping & Handling',
              description: 'Carefully packaged and shipped to your door',
            },
            unit_amount: shippingCents,
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
      },
      metadata: {
        photoId,
        photoTitle,
        photoSrc,
        size,
        format,
        frameColor: frameColor || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fantastick.work'}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fantastick.work'}/shop/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
