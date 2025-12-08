import { Advice } from '@/lib/types';
import { Lightbulb, Trophy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdviceSectionProps {
    advice: Advice;
    productAName: string;
    productBName: string;
}

export function AdviceSection({ advice, productAName, productBName }: AdviceSectionProps) {
    const getWinnerName = () => {
        if (advice.winner === 'a') return productAName;
        if (advice.winner === 'b') return productBName;
        if (advice.winner === 'tie') return '引き分け';
        return '判定なし';
    };

    const getWinnerColor = () => {
        if (advice.winner === 'tie' || advice.winner === 'none') return 'text-slate-700';
        return 'text-amber-600';
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center mb-6">
                <Lightbulb className="w-6 h-6 text-slate-700 mr-3" />
                <h2 className="text-2xl font-bold text-slate-900">AIによるアドバイス</h2>
            </div>

            <div className="space-y-6">
                {/* Winner Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-amber-400">
                    <div className="flex items-center mb-3">
                        <Trophy className="w-5 h-5 text-amber-500 mr-2" />
                        <h3 className="font-bold text-lg text-slate-900">おすすめ: <span className={getWinnerColor()}>{getWinnerName()}</span></h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                        {advice.reason}
                    </p>
                </div>

                {/* Tips Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
                        <h3 className="font-bold text-lg text-slate-900">選び方のアドバイス</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        {advice.tips}
                    </p>
                </div>
            </div>
        </div>
    );
}
