import { ComparisonItem } from '@/lib/types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ComparisonTableProps {
  items: ComparisonItem[];
}

export function ComparisonTable({ items }: ComparisonTableProps) {
  const getColorClass = (superiority: 'a' | 'b' | 'equal' | 'none', side: 'a' | 'b') => {
    if (superiority === 'none' || superiority === 'equal') {
      return '';
    }
    if (superiority === side) {
      return 'bg-green-50 text-green-800 font-semibold';
    } else {
      return 'bg-red-50 text-red-800';
    }
  };

  const renderIcon = (superiority: 'a' | 'b' | 'equal' | 'none', side: 'a' | 'b') => {
    if (superiority === 'none' || superiority === 'equal') {
      return null;
    }
    if (superiority === side) {
      return <ArrowUp className="inline-block w-4 h-4 ml-1 text-green-600" />;
    } else {
      return <ArrowDown className="inline-block w-4 h-4 ml-1 text-red-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-1/3">
                商品A
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 w-1/3">
                比較項目
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 w-1/3">
                商品B
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <td className={`px-6 py-4 text-left ${getColorClass(item.superiority, 'a')}`}>
                  <div className="flex items-center justify-start">
                    <span>{item.valueA}</span>
                    {renderIcon(item.superiority, 'a')}
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-medium text-slate-700 bg-slate-50">
                  {item.label}
                </td>
                <td className={`px-6 py-4 text-right ${getColorClass(item.superiority, 'b')}`}>
                  <div className="flex items-center justify-end">
                    {renderIcon(item.superiority, 'b')}
                    <span>{item.valueB}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
