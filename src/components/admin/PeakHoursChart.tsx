'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Order } from '@/lib/types';
import { useMemo } from 'react';
import { getHours } from 'date-fns';

interface PeakHoursChartProps {
  orders: Order[];
  loading: boolean;
}

export function PeakHoursChart({ orders, loading }: PeakHoursChartProps) {
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
      orders: 0,
      revenue: 0
    }));

    orders.forEach(order => {
      if (order.status === 'Ready') {
        const hour = getHours(new Date(order.date));
        hours[hour].orders += 1;
        hours[hour].revenue += order.total;
      }
    });

    return hours;
  }, [orders]);

  const peakHour = useMemo(() => {
    return hourlyData.reduce((max, hour) =>
      hour.orders > max.orders ? hour : max
      , hourlyData[0]);
  }, [hourlyData]);

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Peak Hours Analysis</CardTitle>
        <CardDescription>Order volume by hour of day</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <p>Loading peak hours data...</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="label"
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'orders') return [value, 'Orders'];
                    if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                    return [value, name];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Peak Hour:</span>
                <span className="font-bold">{peakHour.label} ({peakHour.orders} orders)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Peak Hour Revenue:</span>
                <span className="font-bold">₹{peakHour.revenue.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

