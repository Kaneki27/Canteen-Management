import { NextResponse } from 'next/server';
import { saveOrder } from '@/lib/firestore';
import type { Order } from '@/lib/types';

// Simple order ID generation without AI dependency
function generateOrderId(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `ORD-${timestamp}-${randomString}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartItems, total, discount } = body;

    console.log('API: Placing order with:', { cartItems, total, discount });

    // Generate order ID
    const orderId = generateOrderId();
    console.log('API: Generated order ID:', orderId);

    // Create order object
    const order: Order = {
      id: orderId,
      items: cartItems,
      total: total,
      discountApplied: discount,
      date: Date.now(),
      status: 'Pending' as const
    };

    console.log('API: Order created successfully:', orderId);

    // Try to save to Firebase (will gracefully handle if not configured)
    try {
      await saveOrder(order, orderId);
    } catch (dbError) {
      console.error('API: Failed to save order to database:', dbError);
      // Continue anyway - payment can still proceed
    }

    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      order: order
    });

  } catch (error) {
    console.error('API: Order placement failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to place order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
