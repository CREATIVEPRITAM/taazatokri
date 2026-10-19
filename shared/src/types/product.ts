export type ProductType = 'fresh' | 'inventory';

export interface NutritionPer100g {
  calories?: string;
  carbohydrates?: string;
  protein?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  minerals?: string;
  referenceNote?: string; // Standard reference-data notice per PRD C-PROD-03
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  productType: ProductType;
  unit: string; // e.g. "1 kg", "500 g", "1 bunch", "1 packet"
  price: number; // Selling price in ₹
  isAvailable: boolean; // Controls out-of-stock badge / disabled button
  active: boolean; // Controls whether product appears in catalog
  description: string;
  nutrition: NutritionPer100g;
  isSeasonal: boolean; // Displayed in "Is Mausam Mein Taaza" section
  sourceOrigin: string; // e.g. "Local Farmer / Mandi"
  stockQuantity?: number | null; // Tracked ONLY for inventory-based items; null for fresh
  createdAt: string;
  updatedAt: string;
}
