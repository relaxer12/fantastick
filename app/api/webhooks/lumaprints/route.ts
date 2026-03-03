/**
 * Lumaprints shipping webhook
 * Docs: https://api-docs.lumaprints.com/doc-513534
 *
 * Triggered when Lumaprints ships an order.
 * Configure the webhook URL in the Lumaprints dashboard:
 *   https://dashboard.lumaprints.com/developer/webhook
 *
 * Future enhancement: look up the customer email from Stripe
 * via externalId (Stripe checkout session ID) and send a
 * shipping confirmation email with tracking details.
 */

import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as LumaprintsShippingEvent;

    const { orderNumber, externalId, shipments } = body;

    if (!orderNumber || !externalId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Log the shipping event for tracking/audit
    console.log('Lumaprints shipping event received:', JSON.stringify({
      orderNumber,
      externalId,
      shipments: shipments?.map((s) => ({
        carrier: s.carrier,
        trackingNumber: s.trackingNumber,
        shipmentDate: s.shipmentDate,
        itemCount: s.shipmentItems?.length,
      })),
    }));

    // TODO: Send shipping confirmation email to customer
    // 1. Retrieve Stripe checkout session by externalId to get customer email
    // 2. Send email with carrier, trackingNumber, and shipmentDate

    // Respond 200 immediately per Lumaprints best practices
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Lumaprints webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
