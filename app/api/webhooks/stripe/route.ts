import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createLumaprintsOrder } from '@/lib/lumaprints';
import type { PrintSize, PrintFormat, FrameColor } from '@/lib/pricing';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // During development without webhook secret — parse directly
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const { photoTitle, photoSrc, size, format, frameColor } = session.metadata as {
        photoId: string;
        photoTitle: string;
        photoSrc: string;
        size: PrintSize;
        format: PrintFormat;
        frameColor: string;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipping = (session as any).shipping_details as { name?: string; address?: Stripe.Address } | null;

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
        shippingAddress
      );

      console.log(`Lumaprints order created for session ${session.id}`);
    } catch (err) {
      console.error('Failed to create Lumaprints order:', err);
      // Return 200 so Stripe doesn't retry — log and handle manually
      return NextResponse.json({ error: 'Fulfillment failed', details: String(err) }, { status: 200 });
    }
  }

  return NextResponse.json({ received: true });
}

// Note: App Router routes receive the raw body via req.text() by default.
// No bodyParser config needed (that's a Pages Router pattern).
