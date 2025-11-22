'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Order } from '@/lib/types';
import { useMemo } from 'react';

interface PopularItemsChartProps {
  orders: Order[];
  loading: boolean;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export function PopularItemsChart({ orders, loading }: PopularItemsChartProps) {
  const popularItems = useMemo(() => {
    const itemCount: Record<string, { name: string, count: number, revenue: number }> = {};

    orders.forEach(order => {
      if (order.status === 'Ready') {
        order.items.forEach(item => {
          if (!itemCount[item.id]) {
            itemCount[item.id] = { name: item.name, count: 0, revenue: 0 };
          }
          itemCount[item.id].count += item.quantity;
          itemCount[item.id].revenue += item.price * item.quantity;
        });
      }
    });

    return Object.values(itemCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [orders]);

  const totalItemsSold = useMemo(() => {
    return popularItems.reduce((sum, item) => sum + item.count, 0);
  }, [popularItems]);

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Popular Items</CardTitle>
        <CardDescription>Top 10 bestselling items</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <p>Loading popular items...</p>
          </div>
        ) : popularItems.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No order data available</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularItems} layout="vertical">
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'count') return [value, 'Units Sold'];
                    if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {popularItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Items Sold:</span>
                <span className="font-bold">{totalItemsSold} units</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Top Item:</span>
                <span className="font-bold">{popularItems[0]?.name}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

