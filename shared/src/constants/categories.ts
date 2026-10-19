export interface DefaultCategorySeed {
  name: string;
  displayOrder: number;
  active: boolean;
}

export const DEFAULT_CATEGORIES: readonly DefaultCategorySeed[] = [
  { name: 'Sabziyan', displayOrder: 1, active: true },
  { name: 'Phal', displayOrder: 2, active: true },
  { name: 'Pooja Samagri', displayOrder: 3, active: true },
  { name: 'Dairy Products', displayOrder: 4, active: true },
  { name: 'Seasonal Phal', displayOrder: 5, active: true },
  { name: 'Seasonal Sabziyan', displayOrder: 6, active: true },
] as const;
