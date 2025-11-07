import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderStatus } from '@/lib/firestore';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  try {
    // Skip signature verification if no webhook secret is configured (for testing)
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    } else {
      console.log('Webhook secret not configured, skipping signature verification');
    }

    const webhookBody = JSON.parse(body);
    const { order_id, status } = webhookBody.payload.payment.entity;

    // Update order status in Firestore
    try {
      await updateOrderStatus(order_id, status === 'captured' ? 'Completed' : 'Failed');
      console.log(`Order ${order_id} status updated to: ${status === 'captured' ? 'Completed' : 'Failed'}`);
    } catch (dbError) {
      console.error('Failed to update order status in database:', dbError);
      // Don't fail the webhook if database update fails
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}