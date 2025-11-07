export type Category = 'Main Course' | 'Sides' | 'Beverages' | 'Desserts';
export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  imageUrl: string;
  dietaryType?: DietaryType;
  isPopular?: boolean;
  createdAt?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Discount {
  id: string; // Use 'id' to match firestore document id
  code: string;
  percentage: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discountApplied: Discount | null;
  date: number; // Using timestamp for Firestore
  status: 'Pending' | 'Completed' | 'Cancelled';
}
