export interface ProductData {
  title: string;
  price: string;
  priceValue: number | null;
  imageUrl: string;
  brand: string;
  asin: string;
  specifications: Record<string, string>;
  features: string[];
  category: string;
  rating: string;
}

export interface NormalizedSpec {
  rawValue: string;
  normalizedValue: number | null;
  unit: string;
}

export interface ComparisonItem {
  label: string;
  valueA: string;
  valueB: string;
  superiority: 'a' | 'b' | 'equal' | 'none';
  icon?: 'up' | 'down' | 'equal';
}

export interface Advice {
  winner: 'a' | 'b' | 'tie' | 'none';
  reason: string;
  tips: string;
}

export interface ComparisonResult {
  productA: ProductData;
  productB: ProductData;
  comparisonItems: ComparisonItem[];
  isDivergent: boolean;
  commentary: {
    productA: string;
    productB: string;
  };
  advice?: Advice;
}
