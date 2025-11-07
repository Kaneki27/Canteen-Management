"use server";

import { generateUniqueOrderId } from "@/ai/flows/generate-unique-order-id";
import type { CartItem, Discount } from "./types";
import { saveOrder } from "./firestore";

export async function placeOrder(
    cartItems: CartItem[], 
    total: number, 
    discount: Discount | null
): Promise<{ orderId: string }> {
  console.log("Placing order with:", { cartItems, total, discount });

  // Check if Google AI API key is available
  const hasGoogleAIKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (hasGoogleAIKey) {
    try {
      const { orderId: generatedId } = await generateUniqueOrderId({
        timestamp: Date.now(),
        userId: "user-servesmart-01", // Mock user ID
      });

      const orderToSave = {
        id: generatedId,
        items: cartItems,
        total: total,
        discountApplied: discount,
        date: Date.now(),
        status: 'Pending' as const
      }
      
      await saveOrder(orderToSave, generatedId);
      
      console.log("Saved Order with ID:", generatedId);
      return { orderId: generatedId };

    } catch (error) {
      console.error("Failed to generate unique order ID:", error);
      // Fall through to fallback
    }
  }

  // Fallback to a simpler ID generation
  const fallbackId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const orderToSave = {
    id: fallbackId,
    items: cartItems,
    total: total,
    discountApplied: discount,
    date: Date.now(),
    status: 'Pending' as const
  }
  
  try {
    await saveOrder(orderToSave, fallbackId);
    console.log("Saved Order with Fallback ID:", fallbackId);
    return { orderId: fallbackId };
  } catch (error) {
    console.error("Failed to save order to database:", error);
    // Even if database save fails, return the order ID for payment processing
    return { orderId: fallbackId };
  }
}
