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
1. 2つの製品が大きく異なるジャンル（例：冷蔵庫とイヤホン）か判定してください (isDivergent)。その際、ワイヤレスイヤホンと有線イヤホンなどの似た商品は同じジャンルと判断してください。
2. 比較すべき項目（価格、サイズ、重量、スペック上の重要項目など）を抽出してください。
   -ジャンルが乖離している場合はどんな商品でも比較できる項目を抽出しなさい。（価格、商品のメーカーやブランド、商品のレビュー数、レビュー評価は乖離していても比較可能だと思います。）
   -ジャンルが似ている場合、価格、サイズ、重量、スペックなどの項目を「購入者が何に注目して購入するか」を考慮して抽出してください。
   
3. 比較表のデータを作成してください。
   - 必須項目としてどんな商品にも存在する「価格」「レビュー評価」を表の先頭に優先表記して比較する
   - 表記順序は価格>レビュー評価>メーカー（比較している商品のメーカーが異なる場合）>サイズやスペックなどの抽出した重要項目
   - 数値比較できるものは優劣を判定してください (superiority: 'a' | 'b' | 'equal' | 'none')。
   - 数値が良い方が優れているとは限らない場合（例：サイズ）は文脈のみで判断せず、一般論に従ってください（コンパクトさが売りの場合は小さい方が勝ち、など）。不明なら 'none'。
4. 片方に「不明」の項目が存在する場合は再度、比較するべき項目を抽出できるように検索を行い、該当データを探してください。（例：製品Aの最大駆動時間が判明しているのに製品Bの最大駆動時間データが不明の場合）再検索を行っても不明な場合は「不明」として優劣（色付け）をつけないでください。
5. 比較表の「レビュー評価」項目とは別に、正確な数値として「星の数（ratingValue）」と「レビュー件数（reviewCount）」を抽出してください。製品ページのテキスト情報から探してください。不明な場合は null セットしてください。
6. どちらがおすすめか、理由とともにアドバイスを作成してください。

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
  "structuredRatings": {
      "productA": { "ratingValue": number | null, "reviewCount": number | null },
      "productB": { "ratingValue": number | null, "reviewCount": number | null }
  },
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
