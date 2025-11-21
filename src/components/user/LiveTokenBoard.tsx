'use client';

import { useEffect, useState } from 'react';
import { getOrdersFromLocalStorage } from '@/lib/localStorage';
import type { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, ChefHat, CheckCircle } from 'lucide-react';

// Auto-remove ready orders after 5 minutes
const READY_ORDER_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export function LiveTokenBoard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [readyOrderTimers, setReadyOrderTimers] = useState<Map<string, number>>(new Map());

    const loadOrders = () => {
        const allOrders = getOrdersFromLocalStorage();

        // Filter out Ready orders that have expired
        const now = Date.now();
        const activeOrders = allOrders.filter(order => {
            if (order.status === 'Ready') {
                const readyTime = readyOrderTimers.get(order.id);
                if (readyTime && (now - readyTime) > READY_ORDER_TIMEOUT) {
                    return false; // Exclude expired ready orders
                }
                // Track when order became ready
                if (!readyTime) {
                    setReadyOrderTimers(prev => new Map(prev).set(order.id, now));
                }
            }
            return order.status === 'In Queue' || order.status === 'Cooking' || order.status === 'Ready';
        });

        // Sort by date (oldest first - FIFO)
        const sortedOrders = activeOrders.sort((a, b) => a.date - b.date);
        setOrders(sortedOrders);
    };

    useEffect(() => {
        // Initial load
        loadOrders();

        // Listen for storage updates (real-time sync)
        const handleStorageUpdate = () => {
            console.log('Orders updated, reloading live counter...');
            loadOrders();
        };

        window.addEventListener('ordersUpdated', handleStorageUpdate);
        window.addEventListener('storage', handleStorageUpdate);

        // Check every 10 seconds for expired ready orders
        const interval = setInterval(loadOrders, 10000);

        return () => {
            window.removeEventListener('ordersUpdated', handleStorageUpdate);
            window.removeEventListener('storage', handleStorageUpdate);
            clearInterval(interval);
        };
    }, [readyOrderTimers]);

    const getOrdersByStatus = (status: Order['status']) => {
        return orders.filter(order => order.status === status);
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'In Queue':
                return 'bg-gray-400 text-white border-gray-500';
            case 'Cooking':
                return 'bg-orange-500 text-white border-orange-600';
            case 'Ready':
                return 'bg-green-500 text-white border-green-600';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    if (orders.length === 0) {
        return null; // Don't show board if no active orders
    }

    const inQueueOrders = getOrdersByStatus('In Queue');
    const cookingOrders = getOrdersByStatus('Cooking');
    const readyOrders = getOrdersByStatus('Ready');

    return (
        <div className="w-full bg-gradient-to-r from-pink-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-b-2 border-border shadow-md">
            <div className="container py-6">
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-3xl font-bold font-headline text-center">
                        Live Counter
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* In Queue */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-300">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Clock className="w-6 h-6 text-gray-500" />
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">In Queue</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
                            {inQueueOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No orders</p>
                            ) : (
                                inQueueOrders.map((order) => (
                                    <Badge
                                        key={order.id}
                                        className={cn(
                                            'text-lg font-bold px-4 py-2',
                                            getStatusColor('In Queue')
                                        )}
                                    >
                                        {order.token}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Cooking */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-orange-300">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <ChefHat className="w-6 h-6 text-orange-500" />
                            <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400">Cooking Now</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
                            {cookingOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No orders</p>
                            ) : (
                                cookingOrders.map((order) => (
                                    <Badge
                                        key={order.id}
                                        className={cn(
                                            'text-lg font-bold px-4 py-2',
                                            getStatusColor('Cooking')
                                        )}
                                    >
                                        {order.token}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Ready */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-green-300">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            <h3 className="text-lg font-bold text-green-700 dark:text-green-400">Ready for Pickup</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
                            {readyOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No orders</p>
                            ) : (
                                readyOrders.map((order) => (
                                    <Badge
                                        key={order.id}
                                        className={cn(
                                            'text-lg font-bold px-4 py-2',
                                            getStatusColor('Ready')
                                        )}
                                    >
                                        {order.token}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6 italic">
                    Real-time order status • Updates automatically
                </p>
            </div>
        </div>
    );
}
