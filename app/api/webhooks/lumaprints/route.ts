/**
 * Lumaprints shipping webhook
 * Docs: https://api-docs.lumaprints.com/doc-513534
 *
 * Triggered when Lumaprints ships an order.
 * Configure in Lumaprints dashboard:
 *   https://dashboard.lumaprints.com/developer/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { stripe } from '@/lib/stripe';

interface ShipmentItem {
  externalItemId: string;
  product: string;
  quantity: number;
}

interface Shipment {
  carrier: string;
  shippingMethod: string;
  trackingNumber: string;
  shipmentDate: string;
  shipmentItems: ShipmentItem[];
}

interface LumaprintsShippingEvent {
  orderNumber: string;
  externalId: string; // Stripe checkout session ID
  shipments: Shipment[];
}

function fmtDate(value?: string): string {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function trackingUrl(carrier?: string, trackingNumber?: string): string | null {
  if (!carrier || !trackingNumber) return null;
  const t = encodeURIComponent(trackingNumber);
  const c = carrier.toLowerCase();
  if (c.includes('fedex')) return `https://www.fedex.com/fedextrack/?tracknumbers=${t}`;
  if (c.includes('ups')) return `https://www.ups.com/track?tracknum=${t}`;
  if (c.includes('usps')) return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${t}`;
  if (c.includes('dhl')) return `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${t}`;
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();

    // Lumaprints endpoint verification may POST empty/non-JSON body.
    if (!raw || raw.trim() === '') {
      return NextResponse.json({ received: true, verification: true });
    }

    let body: Partial<LumaprintsShippingEvent>;
    try {
      body = JSON.parse(raw) as Partial<LumaprintsShippingEvent>;
    } catch {
      return NextResponse.json({ received: true, verification: true });
    }

    const { orderNumber, externalId, shipments } = body;

    // Not a full shipping payload — still acknowledge.
    if (!orderNumber || !externalId || !Array.isArray(shipments) || shipments.length === 0) {
      return NextResponse.json({ received: true, verification: true });
    }

    // Log shipping event for audit/debug
    console.log(
      'Lumaprints shipping event:',
      JSON.stringify({
        orderNumber,
        externalId,
        shipments: shipments.map((s) => ({
          carrier: s.carrier,
          shippingMethod: s.shippingMethod,
          trackingNumber: s.trackingNumber,
          shipmentDate: s.shipmentDate,
          itemCount: s.shipmentItems?.length ?? 0,
        })),
      })
    );

    // Best-effort shipping email notification
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const session = await stripe.checkout.sessions.retrieve(externalId);
        const toEmail =
          session.customer_details?.email ||
          session.customer_email ||
          undefined;

        if (toEmail) {
          const firstShipment = shipments[0];
          const firstTracking = firstShipment?.trackingNumber;
          const firstCarrier = firstShipment?.carrier;
          const firstTrackUrl = trackingUrl(firstCarrier, firstTracking);
          const shippedDate = fmtDate(firstShipment?.shipmentDate);

          const itemLines = shipments
            .flatMap((s) => s.shipmentItems ?? [])
            .map((i) => `• ${i.product} × ${i.quantity}`)
            .join('\n');

          const trackingLines = shipments
            .map((s) => {
              const url = trackingUrl(s.carrier, s.trackingNumber);
              return `• ${s.carrier} ${s.shippingMethod ? `(${s.shippingMethod})` : ''}: ${s.trackingNumber}${url ? `\n  ${url}` : ''}`;
            })
            .join('\n\n');

          const resend = new Resend(resendApiKey);
          const from = process.env.RESEND_FROM_EMAIL || 'orders@fantastick.work';

          await resend.emails.send({
            from,
            to: [toEmail],
            subject: `Your FantaStic_k.Work print has shipped (Order #${orderNumber})`,
            text: [
              `Great news — your print order has shipped.`,
              '',
              `Order Number: ${orderNumber}`,
              `Ship Date: ${shippedDate}`,
              firstTracking ? `Primary Tracking: ${firstTracking}${firstTrackUrl ? `\n${firstTrackUrl}` : ''}` : '',
              '',
              'Shipped items:',
              itemLines || '• (details unavailable)',
              '',
              'All tracking numbers:',
              trackingLines || '• (not provided)',
              '',
              'Thank you for your order.',
            ]
              .filter(Boolean)
              .join('\n'),
          });

          console.log(`Shipping email sent to ${toEmail} for Lumaprints order ${orderNumber}`);
        } else {
          console.warn(`No customer email found for Stripe session ${externalId}; skipping shipping email.`);
        }
      } catch (err) {
        // Never fail webhook ack due to email issues
        console.error('Failed sending shipping email:', err);
      }
    } else {
      console.warn('RESEND_API_KEY not set; skipping shipping email notification.');
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Lumaprints webhook error:', err);
    // Keep 200 so provider verification / delivery doesn't fail on our internal errors
    return NextResponse.json({ received: true, error: 'Webhook processing failed' });
  }
}
