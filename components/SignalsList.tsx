// components/SignalsList.tsx
import React from 'react';
// Assuming lucra types are in the main types file for the frontend
import { LucraSignal } from '../types'; 
import { translations } from '../utils/translations';

interface SignalsListProps {
  signals: LucraSignal[];
  title: string;
}

const SignalsList: React.FC<SignalsListProps> = ({ signals, title }) => {
  const t = translations.pt;

  const getSignalColor = (type: LucraSignal['signalType']) => {
    switch(type) {
      case 'COMPRA': return 'border-success';
      case 'VENDA': return 'border-danger';
      default: return 'border-border';
    }
  }

  return (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-4">{title}</h3>
      <div className="flex-grow space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
        {signals.length === 0 ? (
          <p className="text-center text-text-secondary text-sm py-8">Aguardando sinais...</p>
        ) : (
          signals.map((signal, index) => (
            <div key={index} className={`p-3 rounded-md border-l-4 ${getSignalColor(signal.signalType)} bg-surface/50`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{signal.symbol} - {signal.signalType}</span>
                <span className="text-xs text-text-secondary">{signal.horizon}</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{signal.rationale}</p>
              <div className="text-xs grid grid-cols-2 gap-x-4 mt-2">
                <span>{t.confidence}: <strong className="text-white">{signal.finalConfidenceScore * 100}%</strong></span>
                <span>{t.positionSize}: <strong className="text-white">{signal.recommendedPositionSize}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SignalsList;
