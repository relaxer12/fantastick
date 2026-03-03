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
    const raw = await req.text();

    // Lumaprints webhook URL verification may send an empty/non-JSON body.
    // Return 200 so endpoint verification succeeds.
    if (!raw || raw.trim() === '') {
      return NextResponse.json({ received: true, verification: true });
    }

    let body: Partial<LumaprintsShippingEvent>;
    try {
      body = JSON.parse(raw) as Partial<LumaprintsShippingEvent>;
    } catch {
      // Be permissive during provider verification probes.
      return NextResponse.json({ received: true, verification: true });
    }

    const { orderNumber, externalId, shipments } = body;

    // If this isn't a full shipping payload, acknowledge anyway.
    if (!orderNumber || !externalId) {
      return NextResponse.json({ received: true, verification: true });
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
    // Keep 200 on unexpected errors so Lumaprints endpoint checks don't fail.
    return NextResponse.json({ received: true, error: 'Webhook processing failed' });
  }
}
