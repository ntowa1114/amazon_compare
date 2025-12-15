import { ComparisonResult } from '@/lib/types';

interface ReviewComparisonTableProps {
    reviewSummaries: {
        summaryA: string;
        summaryB: string;
    };
    productAName: string;
    productBName: string;
}

export function ReviewComparisonTable({ reviewSummaries, productAName, productBName }: ReviewComparisonTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-800">レビュー内容比較</h3>
            </div>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Product A Review */}
                <div className="flex-1 p-6">
                    <div className="mb-3 font-semibold text-slate-700 border-b border-slate-100 pb-2">
                        {productAName}：お客様の声（要約）
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[150px] text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {reviewSummaries.summaryA || "レビュー要約情報なし"}
                    </div>
                </div>

                {/* Product B Review */}
                <div className="flex-1 p-6">
                    <div className="mb-3 font-semibold text-slate-700 border-b border-slate-100 pb-2">
                        {productBName}：お客様の声（要約）
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[150px] text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {reviewSummaries.summaryB || "レビュー要約情報なし"}
                    </div>
                </div>
            </div>
        </div>
    );
}
