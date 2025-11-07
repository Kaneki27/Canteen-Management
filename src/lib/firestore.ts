
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import type { MenuItem, Discount, Order } from './types';


// Firestore data management functions

// Menu Items
export async function saveMenuItem(menuItem: Omit<MenuItem, 'id'>, id?: string) {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, skipping menu item save');
    return;
  }
  const docRef = id ? doc(db, 'menuItems', id) : doc(collection(db, 'menuItems'));
  await setDoc(docRef, menuItem);
}

export async function deleteMenuItem(id: string) {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, skipping menu item delete');
    return;
  }
  await deleteDoc(doc(db, 'menuItems', id));
}

// Image Upload
export async function uploadImage(file: File): Promise<string> {
    if (!isFirebaseConfigured() || !storage) {
        console.log('Firebase not configured, using placeholder image URL');
        return 'https://placehold.co/400x300?text=Image+Upload+Disabled';
    }
    const storageRef = ref(storage, `menu_images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

// Discounts
export async function saveDiscount(discount: Omit<Discount, 'id'>, id?: string) {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, skipping discount save');
    return;
  }
  const docRef = id ? doc(db, 'discounts', id) : doc(collection(db, 'discounts'));
  await setDoc(docRef, { ...discount, code: discount.code.toUpperCase() });
}

export async function deleteDiscount(id: string) {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, skipping discount delete');
    return;
  }
  await deleteDoc(doc(db, 'discounts', id));
}

export async function updateDiscountStatus(id: string, isActive: boolean) {
    if (!isFirebaseConfigured() || !db) {
      console.log('Firebase not configured, skipping discount status update');
      return;
    }
    const docRef = doc(db, 'discounts', id);
    await updateDoc(docRef, { isActive });
}

// Orders
export async function saveOrder(order: Order, id: string) {
    if (!isFirebaseConfigured() || !db) {
        console.log('Firebase not configured, skipping order save');
        return;
    }
    const docRef = doc(db, 'orders', id);
    await setDoc(docRef, order);
    console.log('Order saved to Firebase:', id);
}

export async function updateOrderStatus(id: string, status: Order['status']) {
    if (!isFirebaseConfigured() || !db) {
        console.log('Firebase not configured, skipping order status update');
        return;
    }
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
}
