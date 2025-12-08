import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ProductData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ message: 'URLが必要です' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: '商品ページの取得に失敗しました' }, { status: 500 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('#productTitle').text().trim() ||
                  $('h1.product-title').text().trim() ||
                  $('span#productTitle').text().trim() ||
                  '取得不可';
    
    let price = '';
    let priceValue: number | null = null;

    const priceSelectors = [
      '.a-price .a-offscreen',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price-whole',
      '#corePrice_feature_div .a-price .a-offscreen',
      '.priceToPay .a-offscreen'
    ];

    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        price = priceText;
        const matches = priceText.match(/[\d,]+/);
        if (matches) {
          priceValue = parseFloat(matches[0].replace(/,/g, ''));
        }
        break;
      }
    }

    if (!price) {
      price = '取得不可';
    }

    let rating= '';

    const ratingSelectors =[
      'span[data-hook="rating- out-text"]',
      'i.a-icon-star span',
      'span.a-icon-alt'

    ];

    for(const selector of ratingSelectors){
      const ratingText = $(selector).first().text().trim();
      if(ratingText){
        rating = ratingText
          .replace(/5つ星のうち/i,"")
          .replace(/[_s★]+/g,'')
          .trim();
        break;
      }
    }

    const imageUrl = $('#landingImage').attr('src') ||
                     $('img[data-old-hires]').attr('data-old-hires') ||
                     $('#imgBlkFront').attr('src') ||
                     $('.a-dynamic-image').first().attr('src') ||
                     '';

    const asin = url.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ||
                 url.match(/\/gp\/product\/([A-Z0-9]{10})/)?.[1] ||
                 $('input[name="ASIN"]').val() as string ||
                 '';

    let brand = '';
    $('#bylineInfo').each((_, el) => {
      let text = $(el).text().trim();
      text=text
        .replace(/^(ブランド:|Brand:)\s*/i, '')
        .replace(/のストアを表示$/i, '')
        .replace(/^Visit the\s+/i, '')
        .replace(/\s+Store$/i, '');
        brand=text.trim();
    });

    if (!brand) {
      brand = $('.po-brand .po-break-word').text().trim() ||
              $('a#bylineInfo').text().trim() ||
              '取得不可';
    }

    const specifications: Record<string, string> = {};

    $('#productDetails_techSpec_section_1 tr, #productDetails_detailBullets_sections1 tr').each((_, row) => {
      const label = $(row).find('th').text().trim();
      const value = $(row).find('td').text().trim();
      if (label && value) {
        specifications[label] = value;
      }
    });

    $('#detailBullets_feature_div li').each((_, li) => {
      const text = $(li).text().trim();
      const [label, ...valueParts] = text.split(':');
      if (label && valueParts.length > 0) {
        const cleanLabel = label.trim().replace(/^\s*‎?\s*/, '');
        const cleanValue = valueParts.join(':').trim();
        if (cleanLabel && cleanValue) {
          specifications[cleanLabel] = cleanValue;
        }
      }
    });

    $('.a-keyvalue').each((_, div) => {
      const label = $(div).find('dt').text().trim();
      const value = $(div).find('dd').text().trim();
      if (label && value) {
        specifications[label] = value;
      }
    });

    const features: string[] = [];
    $('#feature-bullets li:not(.aok-hidden) .a-list-item').each((_, li) => {
      const text = $(li).text().trim();
      if (text && text.length > 0) {
        features.push(text);
      }
    });

    const categoryLinks = $('#wayfinding-breadcrumbs_feature_div a, .a-breadcrumb a');
    const categories: string[] = [];
    categoryLinks.each((_, link) => {
      const cat = $(link).text().trim();
      if (cat) {
        categories.push(cat);
      }
    });
    const category = categories.length > 0 ? categories.join(' > ') : '取得不可';

    const productData: ProductData = {
      title,
      price,
      priceValue,
      imageUrl,
      brand,
      asin,
      specifications,
      features,
      category,
      rating,
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { message: '商品情報の解析に失敗しました' },
      { status: 500 }
    );
  }
}
