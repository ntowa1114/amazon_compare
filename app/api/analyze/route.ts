import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ProductData, ComparisonItem, Advice } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set');
            return NextResponse.json(
                { message: 'Server configuration error: API Key missing' },
                { status: 500 }
            );
        }

        // Initialize OpenAI client inside handler
        const openai = new OpenAI({ apiKey });

        const { productA, productB } = await request.json();

        if (!productA || !productB) {
            return NextResponse.json(
                { message: '比較する2つの商品データが必要です' },
                { status: 400 }
            );
        }

        const prompt = `
あなたはAmazon製品比較の専門家です。以下の2つの製品データを分析し、比較表のデータと購入アドバイスをJSON形式で出力してください。

【製品A】
タイトル: ${productA.title}
価格: ${productA.price}
ブランド: ${productA.brand}
スペック: ${JSON.stringify(productA.specifications)}
特徴: ${JSON.stringify(productA.features)}
カテゴリー: ${productA.category}

【製品B】
タイトル: ${productB.title}
価格: ${productB.price}
ブランド: ${productB.brand}
スペック: ${JSON.stringify(productB.specifications)}
特徴: ${JSON.stringify(productB.features)}
カテゴリー: ${productB.category}

【タスク】
1. 2つの製品が大きく異なるジャンル（例：冷蔵庫とイヤホン）か判定してください (isDivergent)。
2. 比較すべき項目（価格、サイズ、重量、スペック上の重要項目など）を抽出し、比較表のデータを作成してください。
   - 数値比較できるものは優劣を判定してください (superiority: 'a' | 'b' | 'equal' | 'none')。
   - 数値が良い方が優れているとは限らない場合（例：サイズ）は文脈のみで判断せず、一般論に従ってください（コンパクトさが売りの場合は小さい方が勝ち、など）。不明なら 'none'。
3. どちらがおすすめか、理由とともにアドバイスを作成してください。

【出力フォーマット】
以下のJSONのみを返してください。Markdownブロックは不要です。

{
  "isDivergent": boolean,
  "comparisonItems": [
    {
      "label": "項目名",
      "valueA": "製品Aの値",
      "valueB": "製品Bの値",
      "superiority": "a" | "b" | "equal" | "none"
    }
  ],
  "advice": {
    "winner": "a" | "b" | "tie",
    "reason": "勝者の理由（簡潔に）",
    "tips": "ユーザーのニーズに応じたアドバイス（例：コスパ重視ならA、性能重視ならB）"
  }
}
`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that responses in JSON format.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        const result = JSON.parse(content);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { message: '製品詳細の分析に失敗しました' },
            { status: 500 }
        );
    }
}
