import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });


  try {
    const body = await request.json();
    console.log('Received body:', body);
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      console.error('Invalid items:', items);
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    // Limit the number of items to prevent excessive token usage
    const limitedItems = items.slice(0, 15);

    const prompt = `
あなたは家電やガジェットの専門用語を初心者に分かりやすく説明する専門家です。
以下の「仕様項目名」と「値」のリストについて、それぞれの用語の意味と、値が何を表しているかを1〜2文で説明してください。

# 入力データ
${JSON.stringify(limitedItems, null, 2)}

# ルール
1. **専門用語の説明**: 初心者が理解できるように、その用語が何に影響するか（例：充電回数、動作速度など）を含めて説明してください。
2. **値への言及**: 提供された値が具体的にどの程度の能力か（例：20000mAhならスマホ4-6回分）を例示してください。
3. **説明不要な場合**: 以下の場合はその項目を結果に含めないでください。
    - 「サイズ」「寸法」「重量」「重さ」「ブランド」「メーカー」「ASIN」「レビュー」「色」「カラー」「価格」「保証」などの一般的で簡単な用語
    - 値が「不明」「－」「N/A」などで説明が成り立たない場合
4. **出力形式**: 以下のJSON形式で返してください。
{
  "explanations": [
    {
      "term": "用語名",
      "explanation": "ここに説明文"
    }
  ]
}

# 説明の例
入力: [{ "term": "容量", "valueA": "20000mAh", "valueB": "10000mAh" }, { "term": "重量", "valueA": "200g", "valueB": "190g" }]
出力:
{
  "explanations": [
    {
      "term": "容量",
      "explanation": "そのバッテリーがどれくらいの電気をためておけて、スマホなどを何回くらい充電できるかの目安です。２００００ｍahの場合、スマホをおおよそ4～6回分充電できるくらいの容量です。"
    }
  ]
}
（※「重量」は一般的すぎるため除外されています）
`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that explains technical terms in Japanese JSON format." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || '{"explanations": []}');

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error generating explanation:', error);
    return NextResponse.json({
      error: 'Failed to generate explanation',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

