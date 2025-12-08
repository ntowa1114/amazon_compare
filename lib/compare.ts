import { ProductData, ComparisonItem, ComparisonResult } from './types';
import {
  normalizeSize,
  normalizeWeight,
  normalizePower,
  normalizeCapacity,
  normalizeResolution,
  normalizeRefreshRate,
  normalizeSpeed,
  extractNumericValue,
} from './normalize';

function detectDivergence(productA: ProductData, productB: ProductData): boolean {
  const categoryA = productA.category.toLowerCase();
  const categoryB = productB.category.toLowerCase();

  if (categoryA === '取得不可' || categoryB === '取得不可') {
    return false;
  }

  const topLevelCategoryA = categoryA.split('>')[0].trim();
  const topLevelCategoryB = categoryB.split('>')[0].trim();

  if (topLevelCategoryA !== topLevelCategoryB) {
    return true;
  }

  const titleWordsA = new Set(productA.title.toLowerCase().split(/\s+/));
  const titleWordsB = new Set(productB.title.toLowerCase().split(/\s+/));

  const commonWords = Array.from(titleWordsA).filter(word => titleWordsB.has(word) && word.length > 2);

  if (commonWords.length < 2) {
    return true;
  }

  return false;
}

function compareNumericValues(
  valueA: number | null,
  valueB: number | null,
  higherIsBetter: boolean
): 'a' | 'b' | 'equal' | 'none' {
  if (valueA === null || valueB === null) {
    return 'none';
  }

  const diff = Math.abs(valueA - valueB);
  const avg = (valueA + valueB) / 2;
  const percentDiff = (diff / avg) * 100;

  if (percentDiff < 5) {
    return 'equal';
  }

  if (higherIsBetter) {
    return valueA > valueB ? 'a' : 'b';
  } else {
    return valueA < valueB ? 'a' : 'b';
  }
}

function compareSpecification(
  label: string,
  valueA: string,
  valueB: string
): ComparisonItem {
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes('サイズ') || lowerLabel.includes('寸法') || lowerLabel.includes('size') || lowerLabel.includes('dimensions')) {
    const normA = normalizeSize(valueA);
    const normB = normalizeSize(valueB);
    const superiority = compareNumericValues(normA.normalizedValue, normB.normalizedValue, false);
    return { label, valueA, valueB, superiority, icon: superiority === 'a' ? 'up' : superiority === 'b' ? 'down' : undefined };
  }

  if (lowerLabel.includes('重量') || lowerLabel.includes('重さ') || lowerLabel.includes('weight')) {
    const normA = normalizeWeight(valueA);
    const normB = normalizeWeight(valueB);
    const superiority = compareNumericValues(normA.normalizedValue, normB.normalizedValue, false);
    return { label, valueA, valueB, superiority, icon: superiority === 'a' ? 'up' : superiority === 'b' ? 'down' : undefined };
  }

  if (lowerLabel.includes('消費電力') || lowerLabel.includes('電力') || lowerLabel.includes('power consumption')) {
    const normA = normalizePower(valueA);
    const normB = normalizePower(valueB);
    const superiority = compareNumericValues(normA.normalizedValue, normB.normalizedValue, false);
    return { label, valueA, valueB, superiority, icon: superiority === 'a' ? 'up' : superiority === 'b' ? 'down' : undefined };
  }

  if (lowerLabel.includes('容量') || lowerLabel.includes('ストレージ') || lowerLabel.includes('storage') || lowerLabel.includes('capacity')) {
    const normA = normalizeCapacity(valueA);
    const normB = normalizeCapacity(valueB);
    const superiority = compareNumericValues(normA.normalizedValue, normB.normalizedValue, true);
    return { label, valueA, valueB, superiority, icon: superiority === 'a' ? 'up' : superiority === 'b' ? 'down' : undefined };
  }

  if (lowerLabel.includes('解像度') || lowerLabel.includes('resolution')) {
    const normA = normalizeResolution(valueA);
    const normB = normalizeResolution(valueB);
    const superiority = compareNumericValues(normA.normalizedValue, normB.normalizedValue, true);
    return { label, valueA, valueB, superiority, icon: superiority === 'a' ? 'up' : superiority === 'b' ? 'down' : undefined };
  }

  if (lowerLabel.includes('リフレッシュレート') || lowerLabel.includes('refresh rate') || lowerLabel.includes('hz')) {
    const normA = normalizeRefreshRate(valueA);
    const normB = normalizeRefreshRate(valueB);
    const superiority = compareNumericValues(normA.normalizedValue, normB.normalizedValue, true);
    return { label, valueA, valueB, superiority, icon: superiority === 'a' ? 'up' : superiority === 'b' ? 'down' : undefined };
  }

  if (lowerLabel.includes('転送速度') || lowerLabel.includes('速度') || lowerLabel.includes('speed') || lowerLabel.includes('転送レート')) {
    const normA = normalizeSpeed(valueA);
    const normB = normalizeSpeed(valueB);
    const superiority = compareNumericValues(normA.normalizedValue, normB.normalizedValue, true);
    return { label, valueA, valueB, superiority, icon: superiority === 'a' ? 'up' : superiority === 'b' ? 'down' : undefined };
  }

  return { label, valueA, valueB, superiority: 'none' };
}

export function compareProducts(
  productA: ProductData,
  productB: ProductData
): ComparisonResult {
  const isDivergent = detectDivergence(productA, productB);

  const comparisonItems: ComparisonItem[] = [];

  const priceSuperiority = compareNumericValues(productA.priceValue, productB.priceValue, false);
  comparisonItems.push({
    label: '価格',
    valueA: productA.price,
    valueB: productB.price,
    superiority: priceSuperiority,
    icon: priceSuperiority === 'a' ? 'up' : priceSuperiority === 'b' ? 'down' : undefined,
  });

  if (!isDivergent) {
    comparisonItems.push({
      label: 'ブランド',
      valueA: productA.brand,
      valueB: productB.brand,
      superiority: 'none',
    });

    comparisonItems.push({
      label: 'ASIN',
      valueA: productA.asin,
      valueB: productB.asin,
      superiority: 'none',
    });

    const allSpecKeys = new Set([
      ...Object.keys(productA.specifications),
      ...Object.keys(productB.specifications),
    ]);

    allSpecKeys.forEach(key => {
      const valueA = productA.specifications[key] || '－';
      const valueB = productB.specifications[key] || '－';
      const item = compareSpecification(key, valueA, valueB);
      comparisonItems.push(item);
    });
  }

  const commentary = generateCommentary(productA, productB, comparisonItems, isDivergent);

  return {
    productA,
    productB,
    comparisonItems,
    isDivergent,
    commentary,
  };
}

function generateCommentary(
  productA: ProductData,
  productB: ProductData,
  comparisonItems: ComparisonItem[],
  isDivergent: boolean
): { productA: string; productB: string } {
  if (isDivergent) {
    const priceItem = comparisonItems.find(item => item.label === '価格');
    if (priceItem?.superiority === 'a') {
      return {
        productA: '価格面で優位性があります（ジャンル乖離のため価格比較のみ）',
        productB: '価格が高めです（ジャンル乖離のため価格比較のみ）',
      };
    } else if (priceItem?.superiority === 'b') {
      return {
        productA: '価格が高めです（ジャンル乖離のため価格比較のみ）',
        productB: '価格面で優位性があります（ジャンル乖離のため価格比較のみ）',
      };
    } else {
      return {
        productA: '価格は同等です（ジャンル乖離のため価格比較のみ）',
        productB: '価格は同等です（ジャンル乖離のため価格比較のみ）',
      };
    }
  }

  const aStrengths: string[] = [];
  const aWeaknesses: string[] = [];
  const bStrengths: string[] = [];
  const bWeaknesses: string[] = [];

  comparisonItems.forEach(item => {
    if (item.superiority === 'a') {
      aStrengths.push(item.label);
      bWeaknesses.push(item.label);
    } else if (item.superiority === 'b') {
      bStrengths.push(item.label);
      aWeaknesses.push(item.label);
    }
  });

  const formatStrengthsWeaknesses = (strengths: string[], weaknesses: string[]) => {
    const parts: string[] = [];
    if (strengths.length > 0) {
      const topStrengths = strengths.slice(0, 3);
      parts.push(`${topStrengths.join('、')}の面が強く`);
    }
    if (weaknesses.length > 0) {
      const topWeaknesses = weaknesses.slice(0, 2);
      parts.push(`${topWeaknesses.join('、')}の面が弱い`);
    }
    return parts.join('、') || '特筆すべき差はありません';
  };

  return {
    productA: formatStrengthsWeaknesses(aStrengths, aWeaknesses),
    productB: formatStrengthsWeaknesses(bStrengths, bWeaknesses),
  };
}
