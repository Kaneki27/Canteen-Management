import type { Order } from './types';

const ORDERS_STORAGE_KEY = 'servesmart_orders';

/**
 * Local Storage utility for orders
 * Used as fallback when Firebase is not configured
 */

// Get all orders from localStorage
export function getOrdersFromLocalStorage(): Order[] {
    if (typeof window === 'undefined') return [];

    try {
        const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (!ordersJson) return [];

        const orders = JSON.parse(ordersJson);
        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error('Error reading orders from localStorage:', error);
        return [];
    }
}

// Save order to localStorage
export function saveOrderToLocalStorage(order: Order): void {
    if (typeof window === 'undefined') return;

    try {
        const orders = getOrdersFromLocalStorage();

        // Check if order already exists
        const existingIndex = orders.findIndex(o => o.id === order.id);

        if (existingIndex >= 0) {
            // Update existing order
            orders[existingIndex] = order;
        } else {
            // Add new order
            orders.push(order);
        }

        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

        // Trigger storage event for cross-tab sync
        window.dispatchEvent(new Event('ordersUpdated'));

        console.log('Order saved to localStorage:', order.id);
    } catch (error) {
        console.error('Error saving order to localStorage:', error);
    }
}

// Update order status in localStorage
export function updateOrderStatusInLocalStorage(orderId: string, status: Order['status']): void {
    if (typeof window === 'undefined') return;

    try {
        const orders = getOrdersFromLocalStorage();
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex >= 0) {
            orders[orderIndex].status = status;
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

            // Trigger storage event for cross-tab sync
            window.dispatchEvent(new Event('ordersUpdated'));

            console.log('Order status updated in localStorage:', orderId, status);
        } else {
            console.warn('Order not found in localStorage:', orderId);
        }
    } catch (error) {
        console.error('Error updating order status in localStorage:', error);
    }
}

// Clear all orders (useful for testing)
export function clearOrdersFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(ORDERS_STORAGE_KEY);
        window.dispatchEvent(new Event('ordersUpdated'));
        console.log('All orders cleared from localStorage');
    } catch (error) {
        console.error('Error clearing orders from localStorage:', error);
    }
}

// Get single order by ID
export function getOrderByIdFromLocalStorage(orderId: string): Order | null {
    const orders = getOrdersFromLocalStorage();
    return orders.find(o => o.id === orderId) || null;
}
