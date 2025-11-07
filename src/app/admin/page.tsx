'use client';

import { ClipboardList, TicketPercent, Utensils, TrendingUp, Users, Clock } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useDiscounts } from '@/hooks/useDiscounts';
import { useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import chart components for code splitting
const RevenueChart = dynamic(() => import('@/components/admin/RevenueChart').then(mod => ({ default: mod.RevenueChart })), {
  loading: () => <Card className="lg:col-span-4"><CardContent className="flex items-center justify-center h-[400px]">Loading chart...</CardContent></Card>,
  ssr: false
});

const PopularItemsChart = dynamic(() => import('@/components/admin/PopularItemsChart').then(mod => ({ default: mod.PopularItemsChart })), {
  loading: () => <Card className="lg:col-span-3"><CardContent className="flex items-center justify-center h-[300px]">Loading chart...</CardContent></Card>,
  ssr: false
});

const PeakHoursChart = dynamic(() => import('@/components/admin/PeakHoursChart').then(mod => ({ default: mod.PeakHoursChart })), {
  loading: () => <Card className="lg:col-span-4"><CardContent className="flex items-center justify-center h-[300px]">Loading chart...</CardContent></Card>,
  ssr: false
});

export default function AdminDashboardPage() {
    const { orders, loading: ordersLoading } = useOrders();
    const { items: menuItems, loading: menuLoading } = useMenuItems();
    const { discounts, loading: discountsLoading } = useDiscounts();

    const completedOrders = useMemo(() => 
      orders.filter(o => o.status === 'Completed'),
      [orders]
    );

    const totalRevenue = useMemo(() => 
      completedOrders.reduce((sum, order) => sum + order.total, 0),
      [completedOrders]
    );

    const averageOrderValue = useMemo(() => 
      completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
      [totalRevenue, completedOrders.length]
    );

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Analytics Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          <Clock className="h-3 w-3 mr-1" />
          Real-time
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value={ordersLoading ? "..." : `₹${totalRevenue.toFixed(2)}`}
          description={`${completedOrders.length} completed orders`}
          icon={() => <span className="font-bold text-muted-foreground">₹</span>}
        />
        <StatCard 
          title="Total Orders" 
          value={ordersLoading ? "..." : `${totalOrders}`}
          description={`${pendingOrders} pending orders`}
          icon={ClipboardList}
        />
        <StatCard 
          title="Avg Order Value" 
          value={ordersLoading ? "..." : `₹${averageOrderValue.toFixed(2)}`}
          description="Per completed order"
          icon={TrendingUp}
        />
        <StatCard 
          title="Menu Items" 
          value={menuLoading ? "..." : `${menuItems.length}`}
          description={`${menuItems.filter(i => i.isPopular).length} bestsellers`}
          icon={Utensils}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <RevenueChart orders={orders} loading={ordersLoading} />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p>Loading recent orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{order.id}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.items.map(i => i.name).join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={order.status === 'Completed' ? 'default' : order.status === 'Pending' ? 'secondary' : 'destructive'}
                      >
                        {order.status}
                      </Badge>
                      <div className="font-medium">₹{order.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Popular Items & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <PopularItemsChart orders={orders} loading={ordersLoading} />
        <PeakHoursChart orders={orders} loading={ordersLoading} />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discountsLoading ? "..." : discounts.filter(d => d.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {discounts.length} total discount codes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Order Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordersLoading ? "..." : totalOrders > 0 
                ? `${((completedOrders.length / totalOrders) * 100).toFixed(1)}%`
                : "0%"
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedOrders.length} of {totalOrders} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Discount Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordersLoading ? "..." : 
                `${orders.filter(o => o.discountApplied).length}`
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Orders with discounts applied
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
