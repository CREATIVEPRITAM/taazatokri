export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
  parentId?: string | null; // Optional subcategories supported
  createdAt: string;
  updatedAt: string;
}
