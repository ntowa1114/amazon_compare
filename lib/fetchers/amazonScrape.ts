import { ProductData } from '../types';

export async function scrapeAmazonProduct(url: string): Promise<ProductData> {
  const response = await fetch('/api/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '商品情報の取得に失敗しました');
  }

  return response.json();
}
