import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MandiRateItem } from '../types';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Scale } from 'lucide-react';

export const MandiTicker: React.FC = () => {
  const { language, setActiveTab } = useApp();
  const [rates, setRates] = useState<MandiRateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/mandi-rates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch((err) => console.error('Failed to load mandi rates ticker:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading && rates.length === 0) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-300/30 py-2 px-4 flex items-center gap-2 text-xs text-amber-900">
        <Scale className="w-4 h-4 animate-spin text-amber-700" />
        <span>{language === 'ur' ? 'غلہ منڈی کے لائیو ریٹس لوڈ ہو رہے ہیں...' : 'Loading live grain market rates...'}</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-100/90 border-b border-amber-300 text-stone-900 py-1.5 px-3 overflow-hidden shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Label badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-amber-700 text-white px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-xs">
          <Scale className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'لائیو منڈی ریٹ' : 'Live Mandi'}</span>
        </div>

        {/* Scrolling or Flex items */}
        <div className="flex-1 overflow-x-auto flex items-center gap-4 py-0.5 text-xs scrollbar-none">
          {rates.map((item) => {
            const isUp = item.changeTrend === 'up';
            const isDown = item.changeTrend === 'down';

            return (
              <div
                key={item.id}
                onClick={() => setActiveTab('mandi')}
                className="flex items-center gap-2 bg-white/90 border border-amber-300/80 rounded-lg px-2.5 py-1 shrink-0 cursor-pointer hover:border-amber-500 hover:bg-white transition-all shadow-2xs"
                title={`${item.mandiName} - ${item.aartiName}`}
              >
                <span className="font-bold text-stone-900">
                  {language === 'ur' ? item.cropUrdu : `${item.crop} (${item.variety})`}
                </span>
                <span className="text-stone-500 text-[11px]">·</span>
                <span className="font-extrabold text-emerald-800 text-sm">
                  Rs. {item.avgPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-500">/ 40kg</span>

                <div
                  className={`flex items-center text-[11px] font-bold ${
                    isUp ? 'text-emerald-600' : isDown ? 'text-rose-600' : 'text-stone-500'
                  }`}
                >
                  {isUp && <TrendingUp className="w-3 h-3 mr-0.5" />}
                  {isDown && <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {!isUp && !isDown && <Minus className="w-3 h-3 mr-0.5" />}
                  <span>{item.changeAmount > 0 ? `+${item.changeAmount}` : item.changeAmount === 0 ? '=' : item.changeAmount}</span>
                </div>

                <span className="text-[10px] text-stone-500 hidden sm:inline">
                  ({item.mandiName.split(' ')[2] || item.mandiName.split(' ')[0]})
                </span>
              </div>
            );
          })}
        </div>

        {/* View Board Button */}
        <button
          onClick={() => setActiveTab('mandi')}
          className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 px-2 py-1 rounded hover:bg-amber-200/60 transition-colors"
        >
          <span>{language === 'ur' ? 'مکمل بورڈ' : 'All Mandis'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
