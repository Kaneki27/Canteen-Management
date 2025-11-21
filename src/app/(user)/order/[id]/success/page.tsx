'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle, PartyPopper, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getOrderByIdFromLocalStorage } from '@/lib/localStorage';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const orderId = decodeURIComponent(params.id);

  useEffect(() => {
    // Try to find order by token or ID
    const orders = JSON.parse(localStorage.getItem('servesmart_orders') || '[]');
    const foundOrder = orders.find((o: Order) =>
      o.token === orderId || o.id === orderId
    );
    setOrder(foundOrder || null);
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow && receiptRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${orderId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
              h1 { text-align: center; color: #16a34a; }
              .receipt-header { text-align: center; margin-bottom: 20px; }
              .receipt-section { margin: 20px 0; }
              .receipt-row { display: flex; justify-between; padding: 8px 0; }
              .receipt-total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
              th { background-color: #f3f4f6; }
            </style>
          </head>
          <body>
            ${receiptRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!order) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Card className="w-full max-w-lg text-center">
          <CardHeader className="items-center">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-3xl font-headline">Order Placed Successfully!</CardTitle>
            <CardDescription className="text-lg">Thank you for your purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your order token is:</p>
            <div className="mt-2 p-3 bg-secondary rounded-md">
              <p className="text-lg font-mono font-bold text-primary tracking-wider">{orderId}</p>
            </div>
            <p className="mt-4 text-muted-foreground">You can use this token for pickup or any future inquiries.</p>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <p className="flex items-center gap-2 text-muted-foreground"><PartyPopper className="h-5 w-5" />Enjoy your meal!</p>
            <Button asChild size="lg" className="w-full">
              <Link href="/menu">Continue</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Success Message Card */}
        <Card className="text-center md:col-span-2">
          <CardHeader className="items-center">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-headline">Order Placed Successfully!</CardTitle>
            <CardDescription>Thank you for your purchase.</CardDescription>
          </CardHeader>
        </Card>

        {/* Receipt Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-headline">Receipt</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={receiptRef} className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">ServeSmart Canteen</h2>
                <p className="text-sm text-muted-foreground">Official Receipt</p>
                <p className="text-xs text-muted-foreground">{format(new Date(order.date), 'PPpp')}</p>
              </div>

              <Separator />

              {/* Order Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Token:</span>
                  <span className="font-bold text-lg">{order.token}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-orange-600">{order.status}</span>
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                {order.discountApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({order.discountApplied.code} - {order.discountApplied.percentage}%):</span>
                    <span>- ₹{(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) - order.total).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                <p>Thank you for your order!</p>
                <p className="mt-1">Please show this receipt when collecting your order.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex gap-4">
          <Button asChild size="lg" className="flex-1">
            <Link href="/menu">Continue Shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1">
            <Link href="/admin/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
