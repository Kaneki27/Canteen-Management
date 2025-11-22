'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/lib/types';
import { useMemo, useState } from 'react';
import { format, getMonth, subDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

interface RevenueChartProps {
  orders: Order[];
  loading: boolean;
}

export function RevenueChart({ orders, loading }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Daily revenue (last 7 days)
  const dailyRevenue = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayOrders = orders.filter(order =>
        order.status === 'Ready' &&
        isSameDay(new Date(order.date), date)
      );
      data.push({
        name: format(date, 'EEE'),
        total: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length
      });
    }
    return data;
  }, [orders]);

  // Weekly revenue (last 4 weeks)
  const weeklyRevenue = useMemo(() => {
    const data = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7));
      const weekEnd = endOfWeek(weekStart);
      const weekOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return order.status === 'Ready' &&
          orderDate >= weekStart &&
          orderDate <= weekEnd;
      });
      data.push({
        name: `Week ${4 - i}`,
        total: weekOrders.reduce((sum, order) => sum + order.total, 0),
        orders: weekOrders.length
      });
    }
    return data;
  }, [orders]);

  // Monthly revenue (last 12 months)
  const monthlyRevenue = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = monthNames.map(name => ({ name, total: 0, orders: 0 }));

    if (!loading) {
      orders.forEach(order => {
        if (order.status === 'Ready') {
          const month = getMonth(new Date(order.date));
          data[month].total += order.total;
          data[month].orders += 1;
        }
      });
    }

    return data;
  }, [orders, loading]);

  const currentData = timeRange === 'daily' ? dailyRevenue : timeRange === 'weekly' ? weeklyRevenue : monthlyRevenue;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="flex justify-center items-center h-[350px]">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <>
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)} className="mb-4">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'total') return [`₹${value}`, 'Revenue'];
                    return [value, 'Orders'];
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
