import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

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
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully' 
      });
    } else {
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
