'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentDialog({ isOpen, onClose, onPaymentSuccess }: PaymentDialogProps) {
  const { total, items, appliedDiscount, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializeRazorpayPayment = async () => {
    setIsLoading(true);
    try {
      console.log('Starting payment initialization...');
      console.log('Cart items:', items);
      console.log('Total amount:', total);
      console.log('Applied discount:', appliedDiscount);
      
      // Call the orders API instead of server action
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: items,
          total: total,
          discount: appliedDiscount,
        }),
      });

      const orderData = await orderResponse.json();
      console.log('Order API response:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      const orderId = orderData.orderId;
      console.log('Order placed with ID:', orderId);
      
      console.log('Calling Razorpay API...');
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          orderId: orderId,
        }),
      });

      console.log('Razorpay API response status:', response.status);
      const data = await response.json();
      console.log('Razorpay API response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      console.log('Creating Razorpay options...');
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'ServeSmart',
        description: 'Food Order Payment',
        order_id: data.id,
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '',
        },
        handler: function (response: any) {
          console.log('Payment success handler called:', response);
          handlePaymentSuccess(response, orderId);
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal dismissed');
            setIsLoading(false);
          },
          backdropclose: false,
        },
        theme: {
          color: '#A7D1AB', // Using the project's primary color
        },
      };

      console.log('Opening Razorpay checkout...');
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded');
      }
      
      console.log('Razorpay script is loaded, creating instance...');
      const razorpay = new window.Razorpay(options);
      console.log('Razorpay instance created, opening checkout...');
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: 'Payment Failed',
        description: `Failed to initialize payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      // Verify payment on server
      const verifyResponse = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        toast({
          title: 'Payment Successful!',
          description: `Your order #${orderId} has been placed.`,
        });
        
        clearCart();
        onPaymentSuccess(orderId);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast({
        title: 'Payment Verification Failed',
        description: 'Failed to verify payment. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log('Razorpay script loaded successfully');
        }}
        onError={() => {
          console.error('Failed to load Razorpay script');
        }}
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-center">Complete Payment</DialogTitle>
            <DialogDescription className="text-center">
              Secure payment powered by Razorpay
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-muted-foreground">Total Amount</p>
              <p className="text-4xl font-bold font-headline">₹{total.toFixed(2)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              className="w-full" 
              size="lg" 
              onClick={initializeRazorpayPayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
