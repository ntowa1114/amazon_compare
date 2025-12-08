import { Lightbulb } from 'lucide-react';

interface CommentaryProps {
  productAName: string;
  productBName: string;
  commentaryA: string;
  commentaryB: string;
}

export function Commentary({ productAName, productBName, commentaryA, commentaryB }: CommentaryProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-8 mb-6">
      <div className="flex items-center mb-6">
        <Lightbulb className="w-6 h-6 text-slate-700 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">AIによる講評</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2 text-lg">
            {productAName.length > 50 ? productAName.substring(0, 50) + '...' : productAName}
          </h3>
          <p className="text-slate-700 leading-relaxed">{commentaryA}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2 text-lg">
            {productBName.length > 50 ? productBName.substring(0, 50) + '...' : productBName}
          </h3>
          <p className="text-slate-700 leading-relaxed">{commentaryB}</p>
        </div>
      </div>
    </div>
  );
}
