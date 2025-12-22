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
  url: string;
  aiReviewSummary?: string | null;
  ratingValue?: number | null;
  reviewCount?: number | null;
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
  reviewSummaries?: {
    summaryA: string;
    summaryB: string;
  };
  advice?: Advice;
  structuredRatings?: {
    productA: { ratingValue: number | null; reviewCount: number | null };
    productB: { ratingValue: number | null; reviewCount: number | null };
  };
}
