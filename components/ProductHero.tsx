import Image from 'next/image';
import { ProductData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';



interface ProductHeroProps {
  productA: ProductData;
  productB: ProductData;
}

export function ProductHero({ productA, productB }: ProductHeroProps) {
  const shortTitle = (title: string) => {
    // Keep it concise but allow up to 2 lines visual equivalence
    return title.length > 60 ? title.substring(0, 60) + '...' : title;
  };

  const renderRating = (product: ProductData, colorClass: string) => {
    if (product.ratingValue) {
      return (
        <div className={`flex items-center justify-center gap-1 ${colorClass}`}>
          <span className="text-2xl leading-none">★</span>
          <span className="text-xl font-bold text-slate-800">
            {product.ratingValue}
          </span>
          <span className="text-xs text-slate-500 ml-1">
            ({product.reviewCount?.toLocaleString() ?? 0}件)
          </span>
        </div>
      );
    }

    // Fallback for legacy string format
    if (product.rating && product.rating !== '不明' && product.rating !== '取得不可') {
      return (
        <div className={`flex items-center justify-center gap-1 ${colorClass}`}>
          <span className="text-2xl leading-none">★</span>
          <span className="text-xl font-bold text-slate-800">
            {product.rating}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1">
        <span className="text-sm font-medium text-slate-400">評価なし</span>
      </div>
    );
  };

  return (
    <div className="relative mb-8">
      {/* VS Badge - Absolute Center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md border border-slate-200 font-black text-slate-300 italic text-xl">
        VS
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

        {/* Product A Card */}
        <div className="bg-white rounded-xl shadow-sm border-t-4 border-blue-500 p-6 pt-12 flex flex-col items-center relative overflow-hidden h-full">
          {/* Label */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
              <span className="mr-1">🟦</span> PRODUCT A
            </span>
          </div>

          {/* Image - Fixed height container */}
          <div className="relative w-full h-48 mb-4">
            {productA.imageUrl ? (
              <Image
                src={productA.imageUrl}
                alt={productA.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg text-slate-400">
                画像なし
              </div>
            )}
          </div>

          {/* Title - Max 2 lines */}
          <div className="w-full flex-grow-0 mb-3">
            <h2 className="text-lg font-bold text-slate-900 text-center line-clamp-2 overflow-hidden text-ellipsis leading-tight h-[3rem]">
              {productA.title}
            </h2>
          </div>

          {/* Spacer to push content down if needed, or just flex gap */}
          <div className="flex-grow"></div>

          {/* Rating */}
          <div className="mb-2 w-full text-center">
            {renderRating(productA, "text-blue-500")}
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-slate-900 mb-6 text-center">
            {productA.price}
          </p>

          {/* Button */}
          <div className="w-full flex justify-center mt-auto">
            <Button
              onClick={() => window.open(productA.url, '_blank')}
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-colors py-6"
            >
              Amazonで見る
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Product B Card */}
        <div className="bg-white rounded-xl shadow-sm border-t-4 border-orange-500 p-6 pt-12 flex flex-col items-center relative overflow-hidden h-full">
          {/* Label */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700">
              <span className="mr-1">🟧</span> PRODUCT B
            </span>
          </div>

          {/* Image */}
          <div className="relative w-full h-48 mb-4">
            {productB.imageUrl ? (
              <Image
                src={productB.imageUrl}
                alt={productB.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg text-slate-400">
                画像なし
              </div>
            )}
          </div>

          {/* Title */}
          <div className="w-full flex-grow-0 mb-3">
            <h2 className="text-lg font-bold text-slate-900 text-center line-clamp-2 overflow-hidden text-ellipsis leading-tight h-[3rem]">
              {productB.title}
            </h2>
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Rating */}
          <div className="mb-2 w-full text-center">
            {renderRating(productB, "text-orange-500")}
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-slate-900 mb-6 text-center">
            {productB.price}
          </p>

          {/* Button */}
          <div className="w-full flex justify-center mt-auto">
            <Button
              onClick={() => window.open(productB.url, '_blank')}
              className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm transition-colors py-6"
            >
              Amazonで見る
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
