'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ShoppingCart } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAmazonUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return /amazon\.(com|co\.jp|co\.uk|de|fr|it|es|ca|com\.au|in|com\.br|com\.mx|nl|se|pl|sg|ae|sa)/.test(urlObj.hostname);
    } catch {
      return false;
    }
  };

  const handleCompare = async () => {
    setError('');

    if (!url1 || !url2) {
      setError('両方のURLを入力してください');
      return;
    }

    if (!validateAmazonUrl(url1)) {
      setError('URL1が有効なAmazon URLではありません');
      return;
    }

    if (!validateAmazonUrl(url2)) {
      setError('URL2が有効なAmazon URLではありません');
      return;
    }

    setIsLoading(true);
    const params = new URLSearchParams({
      url1: encodeURIComponent(url1),
      url2: encodeURIComponent(url2),
    });
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="w-12 h-12 text-slate-700 mr-3" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Amazon 類似商品 比較
          </h1>
          <p className="text-slate-600 text-lg">
            2つの商品URLを入力して、スペックを比較しましょう
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="url1" className="text-base font-semibold text-slate-700">
                商品URL 1
              </Label>
              <Input
                id="url1"
                type="url"
                placeholder="https://www.amazon.co.jp/..."
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
                className="mt-2 h-12 text-base"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="url2" className="text-base font-semibold text-slate-700">
                商品URL 2
              </Label>
              <Input
                id="url2"
                type="url"
                placeholder="https://www.amazon.co.jp/..."
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
                className="mt-2 h-12 text-base"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleCompare}
              className="w-full h-12 text-lg font-semibold bg-slate-900 hover:bg-slate-800 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '処理中...' : '比較開始'}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              対応ドメイン：amazon.com、amazon.co.jp、その他Amazonドメイン
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>※ Amazon Product Advertising API利用規約に準拠しています</p>
        </div>
      </div>
    </div>
  );
}
