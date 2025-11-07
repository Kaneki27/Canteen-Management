
'use client';

import { useState, useEffect } from 'react';
import type { Discount } from '@/lib/types';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
        console.log('Firebase not configured, using empty discounts list');
        setDiscounts([]);
        setLoading(false);
        return;
    }
    
    const q = query(collection(db, 'discounts'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const discountsData: Discount[] = [];
      querySnapshot.forEach((doc) => {
        discountsData.push({ id: doc.id, ...doc.data() } as Discount);
      });
      setDiscounts(discountsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching discounts:", error);
        setDiscounts([]);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { discounts, loading };
}
