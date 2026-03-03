import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { r2Url } from '@/lib/r2';
import { getPhotoById } from '@/data/photos';
import {
  getPriceInCents,
  getShippingInCents,
  printSizeLabels,
  frameColorLabels,
  matSizeLabels,
  getCompatibleSizes,
  printSizes,
  frameColors,
  matSizes,
} from '@/lib/pricing';
import type { PrintSize, PrintFormat, FrameColor, MatSize } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { photoId, size, format, frameColor, matSize } = body as {
      photoId: string;
      size: PrintSize;
      format: PrintFormat;
      frameColor?: FrameColor;
      matSize?: MatSize;
    };

    if (!photoId || !size || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const VALID_FORMATS: PrintFormat[] = ['print', 'framed'];
    if (!VALID_FORMATS.includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    if (!printSizes.includes(size)) {
      return NextResponse.json({ error: 'Invalid size' }, { status: 400 });
    }

    if (frameColor !== undefined && !frameColors.includes(frameColor)) {
      return NextResponse.json({ error: 'Invalid frameColor' }, { status: 400 });
    }

    if (matSize !== undefined && !matSizes.includes(matSize)) {
      return NextResponse.json({ error: 'Invalid matSize' }, { status: 400 });
    }

    const photo = getPhotoById(photoId);
    if (!photo) {
      return NextResponse.json({ error: 'Invalid photoId' }, { status: 400 });
    }

    if (format === 'framed' && !frameColor) {
      return NextResponse.json({ error: 'frameColor is required for framed prints' }, { status: 400 });
    }

    // Server-side guard: only allow print sizes that Lumaprints will accept.
    const compatibleSizes = getCompatibleSizes(photo.aspectRatio);
    if (!compatibleSizes.includes(size)) {
      return NextResponse.json(
        {
          error: `Selected size ${size} is not compatible with this photo's aspect ratio`,
          compatibleSizes,
        },
        { status: 400 }
      );
    }

    const photoTitle = photo.title;
    const photoSrc = r2Url(photo.publicId);
    const photoAspectRatio = photo.aspectRatio;

    const printAmountCents = getPriceInCents(size, format, frameColor, matSize);
    const shippingCents = getShippingInCents();

    const sizeLabel = printSizeLabels[size];
    const frameLabel = format === 'framed' && frameColor ? ` — ${frameColorLabels[frameColor]} Frame` : '';
    const matLabel = format === 'framed' && matSize && matSize !== 'none' ? ` + ${matSizeLabels[matSize]}` : '';
    const productName = `${photoTitle} · ${sizeLabel} ${format === 'framed' ? 'Framed Print' : 'Print'}${frameLabel}${matLabel}`;

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
        photoAspectRatio: String(photoAspectRatio),
        size,
        format,
        frameColor: frameColor || '',
        matSize: matSize || 'none',
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
