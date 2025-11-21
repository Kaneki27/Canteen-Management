'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatusControl } from './OrderStatusControl';

export function OrdersClient() {
  const { orders, loading } = useOrders();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Order Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading orders...</TableCell>
                </TableRow>
              )}
              {!loading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No orders yet
                  </TableCell>
                </TableRow>
              )}
              {!loading && orders.sort((a, b) => b.date - a.date).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-bold text-lg">{order.token}</TableCell>
                  <TableCell>{format(new Date(order.date), 'PPp')}</TableCell>
                  <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)} items</TableCell>
                  <TableCell>₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={order.paymentMethod === 'Online' ? 'default' : 'secondary'}>
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <OrderStatusControl order={order} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
