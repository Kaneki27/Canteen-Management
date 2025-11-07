
'use client';

import { useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
        console.log('Firebase not configured, using empty orders list');
        setOrders([]);
        setLoading(false);
        return;
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
