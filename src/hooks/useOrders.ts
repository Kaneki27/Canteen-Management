
'use client';

import { useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getOrdersFromLocalStorage } from '@/lib/localStorage';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      console.log('Firebase not configured, using localStorage for orders');

      // Load orders from localStorage
      const loadOrders = () => {
        const localOrders = getOrdersFromLocalStorage();
        // Sort by date descending (newest first)
        const sortedOrders = localOrders.sort((a, b) => b.date - a.date);
        setOrders(sortedOrders);
        setLoading(false);
      };

      // Initial load
      loadOrders();

      // Listen for storage updates (cross-tab sync)
      const handleStorageUpdate = () => {
        console.log('Orders updated in localStorage, reloading...');
        loadOrders();
      };

      window.addEventListener('ordersUpdated', handleStorageUpdate);
      window.addEventListener('storage', handleStorageUpdate);

      return () => {
        window.removeEventListener('ordersUpdated', handleStorageUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    }

    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { orders, loading };
}
