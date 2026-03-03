import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createLumaprintsOrder } from '@/lib/lumaprints';
import type { PrintSize, PrintFormat, FrameColor, MatSize } from '@/lib/pricing';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else if (process.env.NODE_ENV !== 'production') {
      // Local development fallback only
      event = JSON.parse(body) as Stripe.Event;
    } else {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET or stripe-signature header in production');
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const { photoTitle, photoSrc: rawPhotoSrc, photoAspectRatio: rawPhotoAspectRatio, size, format, frameColor, matSize } = session.metadata as {
        photoId: string;
        photoTitle: string;
        photoSrc: string; // may be bare R2 key (legacy) or full URL
        photoAspectRatio?: string;
        size: PrintSize;
        format: PrintFormat;
        frameColor: string;
        matSize: string;
      };

      if (!rawPhotoSrc) {
        throw new Error('Missing photoSrc in Stripe metadata');
      }

      // Normalise photoSrc — legacy orders stored bare R2 key; new orders store full URL
      const R2_BASE = 'https://pub-426ed2c6f024444c8b80fb544d13a890.r2.dev';
      const photoSrc = rawPhotoSrc.startsWith('https://') ? rawPhotoSrc : `${R2_BASE}/${rawPhotoSrc}`;
      const photoAspectRatio = rawPhotoAspectRatio ? Number(rawPhotoAspectRatio) : undefined;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionAny = session as any;
      // Stripe moved shipping to collected_information in newer API versions — check both
      const shipping = (sessionAny.collected_information?.shipping_details ?? sessionAny.shipping_details) as { name?: string; address?: Stripe.Address } | null;

      if (!shipping?.address) {
        console.error('No shipping address on completed session:', session.id);
        return NextResponse.json({ error: 'No shipping address' }, { status: 400 });
      }

      const shippingAddress = {
        name: shipping.name || photoTitle,
        line1: shipping.address.line1 || '',
        line2: shipping.address.line2 || undefined,
        city: shipping.address.city || '',
        state: shipping.address.state || '',
        postal_code: shipping.address.postal_code || '',
        country: shipping.address.country || 'US',
      };

      await createLumaprintsOrder(
        session.id,
        photoSrc,
        size,
        format,
        frameColor ? (frameColor as FrameColor) : undefined,
        (matSize && matSize !== 'none') ? (matSize as MatSize) : undefined,
        shippingAddress,
        Number.isFinite(photoAspectRatio) ? photoAspectRatio : undefined
      );

      console.log(`Lumaprints order created for session ${session.id}`);
    } catch (err) {
      console.error('Failed to create Lumaprints order:', err);
      // Return 5xx so Stripe retries automatically.
      return NextResponse.json({ error: 'Fulfillment failed', details: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// Note: App Router routes receive the raw body via req.text() by default.
// No bodyParser config needed (that's a Pages Router pattern).
