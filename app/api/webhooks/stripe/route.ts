import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createLumaprintsOrder } from '@/lib/lumaprints';
import { Resend } from 'resend';
import type { PrintSize, PrintFormat, FrameColor, MatSize } from '@/lib/pricing';
import type Stripe from 'stripe';

function getPaymentIntentId(session: Stripe.Checkout.Session): string | undefined {
  if (!session.payment_intent) return undefined;
  return typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent.id;
}

async function wasConfirmationEmailSent(session: Stripe.Checkout.Session): Promise<boolean> {
  const paymentIntentId = getPaymentIntentId(session);
  if (!paymentIntentId) return false;

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    return pi.metadata?.order_confirmation_email_sent === 'true';
  } catch (err) {
    console.warn('Unable to read payment intent metadata for email dedupe:', err);
    return false;
  }
}

async function markConfirmationEmailSent(session: Stripe.Checkout.Session, orderNumber?: string | number) {
  const paymentIntentId = getPaymentIntentId(session);
  if (!paymentIntentId) return;

  try {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        order_confirmation_email_sent: 'true',
        ...(orderNumber ? { lumaprints_order_number: String(orderNumber) } : {}),
      },
    });
  } catch (err) {
    console.warn('Unable to persist email sent marker on payment intent:', err);
  }
}

async function sendOrderConfirmationEmail(
  session: Stripe.Checkout.Session,
  details: {
    photoTitle: string;
    size: PrintSize;
    format: PrintFormat;
    cropMode?: string;
    frameColor?: string;
    matSize?: string;
    orderNumber?: string | number;
  }
) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not set; skipping order confirmation email.');
    return;
  }

  const toEmail = session.customer_details?.email || session.customer_email || undefined;
  if (!toEmail) {
    console.warn(`No customer email found for session ${session.id}; skipping order confirmation email.`);
    return;
  }

  if (await wasConfirmationEmailSent(session)) {
    console.log(`Order confirmation email already sent for session ${session.id}; skipping.`);
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || 'orders@fantastick.work';
  const resend = new Resend(resendApiKey);

  const formatLabel = details.format === 'framed' ? 'Framed Print' : 'Print';
  const cropLabel = details.cropMode === 'fit' ? 'Fit (with border if needed)' : 'Fill (cropped to fit)';

  const lines = [
    `Thanks for your order from FantaStic_k.Work.`,
    '',
    details.orderNumber ? `Lumaprints Order Number: ${details.orderNumber}` : '',
    `Reference ID: ${session.id}`,
    '',
    'Order details:',
    `• Photo: ${details.photoTitle}`,
    `• Product: ${details.size} ${formatLabel}`,
    details.format === 'framed' && details.frameColor ? `• Frame: ${details.frameColor}` : '',
    details.format === 'framed' && details.matSize ? `• Mat: ${details.matSize}` : '',
    `• Crop mode: ${cropLabel}`,
    '',
    'Your order has been sent to Lumaprints and is now in production queue.',
    'You will receive another email when it ships with tracking details.',
    '',
    'Questions? Reply to this email or contact hao.huang@hey.com.',
  ].filter(Boolean);

  await resend.emails.send({
    from,
    to: [toEmail],
    subject: `Order confirmed${details.orderNumber ? ` · #${details.orderNumber}` : ''}`,
    text: lines.join('\n'),
  });

  await markConfirmationEmailSent(session, details.orderNumber);
  console.log(`Order confirmation email sent to ${toEmail} for session ${session.id}`);
}

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
      const {
        photoTitle,
        photoSrc: rawPhotoSrc,
        size,
        format,
        cropMode,
        frameColor,
        matSize,
      } = session.metadata as {
        photoId: string;
        photoTitle: string;
        photoSrc: string; // may be bare R2 key (legacy) or full URL
        size: PrintSize;
        format: PrintFormat;
        cropMode?: string;
        frameColor: string;
        matSize: string;
      };

      if (!rawPhotoSrc) {
        throw new Error('Missing photoSrc in Stripe metadata');
      }

      // Normalise photoSrc — legacy orders stored bare R2 key; new orders store full URL
      const R2_BASE = 'https://pub-426ed2c6f024444c8b80fb544d13a890.r2.dev';
      const photoSrc = rawPhotoSrc.startsWith('https://') ? rawPhotoSrc : `${R2_BASE}/${rawPhotoSrc}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionAny = session as any;
      // Stripe moved shipping to collected_information in newer API versions — check both
      const shipping = (sessionAny.collected_information?.shipping_details ?? sessionAny.shipping_details) as { name?: string; address?: Stripe.Address } | null;

      if (!shipping?.address) {
        console.error('No shipping address on completed session:', session.id);
        // 5xx so Stripe retries instead of dropping fulfillment permanently.
        return NextResponse.json({ error: 'No shipping address' }, { status: 500 });
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

      let orderNumber: string | number | undefined;

      try {
        const orderRes = await createLumaprintsOrder(
          session.id,
          photoSrc,
          size,
          format,
          frameColor ? (frameColor as FrameColor) : undefined,
          (matSize && matSize !== 'none') ? (matSize as MatSize) : undefined,
          shippingAddress
        );
        orderNumber = orderRes.orderNumber;
        console.log(`Lumaprints order created for session ${session.id}: ${orderNumber}`);
      } catch (err) {
        const msg = String(err);

        // Idempotency: if order already exists in Lumaprints, treat as success.
        if (msg.toLowerCase().includes('already exists')) {
          console.warn('Lumaprints order already exists; acknowledging webhook as success.');
        } else {
          throw err;
        }
      }

      // Best-effort customer confirmation email (do not fail fulfillment if email fails)
      try {
        await sendOrderConfirmationEmail(session, {
          photoTitle,
          size,
          format,
          cropMode,
          frameColor: frameColor || undefined,
          matSize: (matSize && matSize !== 'none') ? matSize : undefined,
          orderNumber,
        });
      } catch (emailErr) {
        console.error('Order confirmation email send failed:', emailErr);
      }
    } catch (err) {
      const msg = String(err);
      console.error('Failed to create Lumaprints order:', err);
      // Return 5xx so Stripe retries automatically.
      return NextResponse.json({ error: 'Fulfillment failed', details: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// Note: App Router routes receive the raw body via req.text() by default.
// No bodyParser config needed (that's a Pages Router pattern).
