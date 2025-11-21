import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { updateOrderStatus } from '@/lib/firestore';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    console.log('Verifying payment for order:', orderId);

    // Create signature verification string
    const signatureString = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(signatureString)
      .digest('hex');

    // Verify signature
    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      console.log('Payment signature verified successfully for order:', orderId);
      
      // Update order status to Completed
      try {
        await updateOrderStatus(orderId, 'Completed');
        console.log('Order status updated to Completed:', orderId);
      } catch (statusError) {
        console.error('Failed to update order status:', statusError);
        // Continue anyway - payment was successful
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully' 
      });
    } else {
      console.error('Invalid payment signature for order:', orderId);
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
