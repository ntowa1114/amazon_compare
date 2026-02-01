interface ReviewSummaryProps {
    summaryA: string;
    summaryB: string;
    productAName: string;
    productBName: string;
}

export function ReviewSummary({ summaryA, summaryB, productAName, productBName }: ReviewSummaryProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 mb-6">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-800">お客様の声（AI要約）</h3>
            </div>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Product A */}
                <div className="flex-1 p-6 bg-blue-50/10">
                    <div className="mb-3 font-semibold text-blue-900 border-b border-blue-100 pb-2 flex items-center">
                        <span className="mr-2">🟦</span>
                        <span className="line-clamp-1">{productAName}</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 min-h-[100px] text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {summaryA || "レビュー要約情報なし"}
                    </div>
                </div>

                {/* Product B */}
                <div className="flex-1 p-6 bg-orange-50/10">
                    <div className="mb-3 font-semibold text-orange-900 border-b border-orange-100 pb-2 flex items-center">
                        <span className="mr-2">🟧</span>
                        <span className="line-clamp-1">{productBName}</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 min-h-[100px] text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {summaryB || "レビュー要約情報なし"}
                    </div>
                </div>
            </div>
        </div>
    );
}
