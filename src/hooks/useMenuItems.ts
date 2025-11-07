
'use client';

import { useState, useEffect } from 'react';
import type { MenuItem } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mockMenuItems: MenuItem[] = PlaceHolderImages.map((p, index) => {
    // Categorize items - 16 items per category
    let category: 'Main Course' | 'Sides' | 'Beverages' | 'Desserts' = 'Main Course';
    let dietaryType: 'veg' | 'non-veg' | 'vegan' = 'veg';
    
    // Main Course items (IDs 1-16)
    if (index >= 0 && index < 16) {
        category = 'Main Course';
        // Items with meat/fish are non-veg
        if (index === 0 || index === 1 || index === 5 || index === 6 || index === 7 || index === 8 || index === 10 || index === 13 || index === 14 || index === 15) {
            dietaryType = 'non-veg';
        }
    }
    // Sides items (IDs 17-32)  
    else if (index >= 16 && index < 32) {
        category = 'Sides';
        // Chicken wings are non-veg
        if (index === 21) {
            dietaryType = 'non-veg';
        }
    }
    // Beverages items (IDs 33-48)
    else if (index >= 32 && index < 48) {
        category = 'Beverages';
        dietaryType = 'vegan'; // All beverages are vegan
    }
    // Desserts items (IDs 49-64)
    else if (index >= 48 && index < 64) {
        category = 'Desserts';
    }

    // Mark some items as popular
    const popularItems = [0, 1, 2, 4, 16, 17, 32, 33, 48, 49];
    const isPopular = popularItems.includes(index);

    return {
        id: p.id,
        name: p.description.split(' with ')[0].split(' and ')[0].replace('A ', '').replace('a ', ''),
        description: p.description,
        price: Math.floor(Math.random() * 200) + 50,
        imageUrl: p.imageUrl,
        category: category,
        dietaryType: dietaryType,
        isPopular: isPopular,
        createdAt: Date.now() - (index * 86400000), // Older items have earlier dates
    };
});


export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are returning mock data for now.
    // To switch to firestore, replace the initial state of items with []
    // and uncomment the following useEffect block.
    setLoading(false);
    /*
    if (!db) {
        setLoading(false);
        return;
    }
    const q = query(collection(db, 'menuItems'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const menuItems: MenuItem[] = [];
      if (querySnapshot.empty) {
        setItems(mockMenuItems); // Show mock data if firestore is empty
      } else {
        querySnapshot.forEach((doc) => {
            menuItems.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        setItems(menuItems);
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching menu items:", error);
        setItems(mockMenuItems); // Fallback to mock data on error
        setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  return { items, loading };
}
