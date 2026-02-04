'use client';

import { useEffect, useState } from 'react';
import { ComparisonItem } from '@/lib/types';
import { Loader2, Lightbulb } from 'lucide-react';

interface TermExplanationTableProps {
    items: ComparisonItem[];
}

interface ExplanationItem {
    term: string;
    explanation: string;
}

export function TermExplanationTable({ items }: TermExplanationTableProps) {
    const [explanations, setExplanations] = useState<ExplanationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        // Prevent duplicate fetching if items haven't changed substantially or already fetched
        if (hasFetched || items.length === 0) return;

        const fetchExplanations = async () => {
            setLoading(true);
            try {
                const payload = items.map(item => ({
                    term: item.label,
                    valueA: item.valueA,
                    valueB: item.valueB,
                }));

                const response = await fetch('/api/explain-term', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: payload }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setExplanations(data.explanations || []);
                }
            } catch (error) {
                console.error('Failed to fetch explanations', error);
            } finally {
                setLoading(false);
                setHasFetched(true);
            }
        };

        fetchExplanations();
    }, [items, hasFetched]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
                <p className="text-slate-500 text-sm">専門用語の説明を生成中...</p>
            </div>
        );
    }

    if (explanations.length === 0) {
        return null; // Don't show anything if no explanations were generated (e.g. all terms were simple)
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="font-bold text-slate-800">用語解説</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 w-1/4">用語</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 w-3/4">説明</th>
                        </tr>
                    </thead>
                    <tbody>
                        {explanations.map((item, index) => (
                            <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 bg-white">
                                    {item.term}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 leading-relaxed bg-white">
                                    {item.explanation}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
