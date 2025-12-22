import Image from 'next/image';
import { ProductData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const shortTitle = (title: string) => title.split(' ').slice(0, 4).join(' ');

interface ProductHeroProps {
  productA: ProductData;
  productB: ProductData;
}

export function ProductHero({ productA, productB }: ProductHeroProps) {
  const renderRating = (product: ProductData) => {
    if (product.ratingValue) {
      return (
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-yellow-500 text-3xl leading-none">⭐</span>
          <span className="text-xl font-bold text-slate-800">
            {product.ratingValue}
          </span>
          <span className="text-sm text-slate-500 ml-1">
            ({product.reviewCount?.toLocaleString() ?? 0}件)
          </span>
        </div>
      );
    }

    // Fallback for legacy string format or unknown
    if (product.rating && product.rating !== '不明' && product.rating !== '取得不可') {
      return (
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-yellow-500 text-3xl leading-none">⭐</span>
          <span className="text-xl font-bold text-slate-800">
            {product.rating}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className="text-sm font-medium text-slate-400">不明</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-8">
        {shortTitle(productA.title)} vs {shortTitle(productB.title)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-sm mb-4 bg-slate-50 rounded-lg overflow-hidden">
            {productA.imageUrl ? (
              <Image
                src={productA.imageUrl}
                alt={productA.title}
                fill
                className="object-contain p-4"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                画像なし
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
            {productA.title}
          </h2>
          <p className="text-3xl font-bold text-slate-700">
            {productA.price}
          </p>
          <div className="text-center mt-2 text-slate-700">
            {renderRating(productA)}
          </div>
          <div className="mt-4">
            <Button
              onClick={() => window.open(productA.url, '_blank')}
              className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold"
            >
              <span className="mr-2">Amazonで開く</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-sm mb-4 bg-slate-50 rounded-lg overflow-hidden">
            {productB.imageUrl ? (
              <Image
                src={productB.imageUrl}
                alt={productB.title}
                fill
                className="object-contain p-4"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                画像なし
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
            {productB.title}
          </h2>
          <p className="text-3xl font-bold text-slate-700">
            {productB.price}
          </p>
          <div className="text-center mt-2 text-slate-700">
            {renderRating(productB)}
          </div>
          <div className="mt-4">
            <Button
              onClick={() => window.open(productB.url, '_blank')}
              className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold"
            >
              <span className="mr-2">Amazonで開く</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
