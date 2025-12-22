'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductHero } from '@/components/ProductHero';
import { ComparisonTable } from '@/components/ComparisonTable';
import { AdviceSection } from '@/components/AdviceSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { scrapeAmazonProduct } from '@/lib/fetchers/amazonScrape';
import { ComparisonResult, ProductData } from '@/lib/types';
import { ReviewComparisonTable } from '@/components/ReviewComparisonTable';

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('初期化中...');

  useEffect(() => {
    const url1 = searchParams.get('url1');
    const url2 = searchParams.get('url2');

    if (!url1 || !url2) {
      setError('URLパラメータが不足しています');
      setIsLoading(false);
      return;
    }

    const fetchAndCompare = async () => {
      try {
        setIsLoading(true);
        setError('');

        // 1. Scrape Products
        setStatusMessage('商品情報を取得中...');
        const decodedUrl1 = decodeURIComponent(url1);
        const decodedUrl2 = decodeURIComponent(url2);

        const [productA, productB] = await Promise.all([
          scrapeAmazonProduct(decodedUrl1),
          scrapeAmazonProduct(decodedUrl2),
        ]);

        // 2. Analyze with OpenAI
        setStatusMessage('AIが商品を比較・分析中...');
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productA, productB }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '分析に失敗しました');
        }

        const analysisData = await response.json();

        // 3. Construct Result
        // Merge structured ratings into product data if available
        const enhancedProductA = { ...productA };
        const enhancedProductB = { ...productB };

        if (analysisData.structuredRatings) {
          if (analysisData.structuredRatings.productA) {
            enhancedProductA.ratingValue = analysisData.structuredRatings.productA.ratingValue;
            enhancedProductA.reviewCount = analysisData.structuredRatings.productA.reviewCount;
          }
          if (analysisData.structuredRatings.productB) {
            enhancedProductB.ratingValue = analysisData.structuredRatings.productB.ratingValue;
            enhancedProductB.reviewCount = analysisData.structuredRatings.productB.reviewCount;
          }
        }

        const fullResult: ComparisonResult = {
          productA: enhancedProductA,
          productB: enhancedProductB,
          comparisonItems: analysisData.comparisonItems,
          isDivergent: analysisData.isDivergent,
          reviewSummaries: analysisData.reviewSummaries,
          structuredRatings: analysisData.structuredRatings,
          advice: analysisData.advice,
          commentary: { productA: '', productB: '' } // Legacy field kept empty
        };

        setResult(fullResult);
      } catch (err) {
        console.error('Comparison error:', err);
        setError(err instanceof Error ? err.message : '商品の比較に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCompare();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-slate-700 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-700 font-medium">{statusMessage}</p>
          <p className="text-sm text-slate-500 mt-2">しばらくお待ちください</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={() => router.push('/')}
            className="bg-slate-900 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            トップページに戻る
          </Button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="mb-6 text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          新しい比較を開始
        </Button>

        <ProductHero productA={result.productA} productB={result.productB} />

        {result.advice && (
          <AdviceSection
            advice={result.advice}
            productAName={result.productA.title}
            productBName={result.productB.title}
          />
        )}

        {/* Fallback for legacy commentary if advice is missing (should verify if needed) */}
        {!result.advice && (result.commentary.productA || result.commentary.productB) && (
          <div className="mb-6">LEGACY COMMENTARY HIDDEN</div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">各項目比較</h2>
          <ComparisonTable items={result.comparisonItems} />
        </div>

        {result.reviewSummaries && (
          <div className="mb-6">
            <ReviewComparisonTable
              reviewSummaries={result.reviewSummaries}
              productAName={result.productA.title}
              productBName={result.productB.title}
            />
          </div>
        )}

        {result.isDivergent && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              商品のジャンルが大きく異なるため、比較項目が限定されている可能性があります。
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => router.push('/')}
            className="bg-slate-900 hover:bg-slate-800 px-8"
          >
            別の商品を比較する
          </Button>
        </div>
      </div>
    </div>
  );
}
