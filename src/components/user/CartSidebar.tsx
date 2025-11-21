'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2, X, TicketPercent, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { PaymentDialog } from './PaymentDialog';

export function CartSidebar() {
  const {
    items,
    updateQuantity,
    removeItem,
    totalItems,
    subtotal,
    total,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
  } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleApplyDiscount = () => {
    const result = applyDiscount(discountCode);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
    if (result.success) {
      setDiscountCode('');
    }
  };

  const handleCheckout = () => {
    setPaymentDialogOpen(true);
  }

  const handlePayAtCounter = async () => {
    try {
      // Create order with "Pay at Counter" payment method
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: items,
          total: total,
          discount: appliedDiscount,
          paymentMethod: 'Pay at Counter'
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      const token = orderData.token;
      const order = orderData.order;

      // Save order to localStorage
      const { saveOrderToLocalStorage } = await import('@/lib/localStorage');
      saveOrderToLocalStorage(order);

      toast({
        title: 'Order Placed!',
        description: `Your order token is ${token}. Please pay at the counter when picking up.`,
      });

      // Clear cart and redirect
      router.push(`/order/${encodeURIComponent(token)}/success`);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast({
        title: 'Order Failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentDialogOpen(false);
    // The cart is cleared in the payment dialog upon success
    router.push(`/order/${encodeURIComponent(orderId)}/success`);
  }

  return (
    <>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-xl">
        <SheetHeader className="px-6">
          <SheetTitle>Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <Separator />
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-4 py-4">
                {items.map((item) => {
                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full">
                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="px-6 py-4 border-t space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedDiscount.code} - {appliedDiscount.percentage}%)</span>
                    <span>- ₹{(subtotal - total).toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <SheetFooter className="mt-auto flex flex-col gap-4 border-t bg-background px-6 py-4">
              {!appliedDiscount ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="bg-muted border-none"
                  />
                  <Button onClick={handleApplyDiscount} disabled={!discountCode} variant="outline" className="shrink-0">Apply</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-md bg-green-100/50 text-green-700 p-2 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <TicketPercent className="h-4 w-4" />
                    <span>Code "{appliedDiscount.code}" applied</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-green-700" onClick={removeDiscount}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button size="lg" variant="outline" className="w-full" onClick={handlePayAtCounter}>
                  Pay at Counter
                </Button>
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  Pay Online
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-24 w-24 text-muted-foreground/30" strokeWidth={1} />
            <h3 className="font-semibold text-xl">Your cart is empty</h3>
            <p className="text-muted-foreground">Add items to your cart to get started.</p>
            <SheetClose asChild>
              <Button>Start Ordering</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
      {isPaymentDialogOpen && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
