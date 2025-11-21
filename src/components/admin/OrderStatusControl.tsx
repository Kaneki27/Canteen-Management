'use client';

import { Button } from '@/components/ui/button';
import { updateOrderStatusInLocalStorage } from '@/lib/localStorage';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OrderStatusControlProps {
    order: Order;
    onStatusChange?: (newStatus: Order['status']) => void;
}

export function OrderStatusControl({ order, onStatusChange }: OrderStatusControlProps) {
    const statuses: Order['status'][] = ['In Queue', 'Cooking', 'Ready'];

    const handleStatusChange = (newStatus: Order['status']) => {
        // Update in localStorage
        updateOrderStatusInLocalStorage(order.id, newStatus);

        // Call callback if provided
        if (onStatusChange) {
            onStatusChange(newStatus);
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'In Queue':
                return 'bg-orange-500 hover:bg-orange-600 text-white';
            case 'Cooking':
                return 'bg-blue-500 hover:bg-blue-600 text-white';
            case 'Ready':
                return 'bg-green-500 hover:bg-green-600 text-white';
            default:
                return 'bg-gray-500 hover:bg-gray-600 text-white';
        }
    };

    return (
        <div className="flex gap-2">
            {statuses.map((status) => (
                <Button
                    key={status}
                    size="sm"
                    variant={order.status === status ? 'default' : 'outline'}
                    className={cn(
                        order.status === status && getStatusColor(status),
                        'transition-all duration-200'
                    )}
                    onClick={() => handleStatusChange(status)}
                >
                    {status}
                </Button>
            ))}
        </div>
    );
}
