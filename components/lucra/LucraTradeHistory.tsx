// components/lucra/LucraTradeHistory.tsx
import React from 'react';

const LucraTradeHistory: React.FC = () => {
  return (
    <div className="bg-surface/50 border border-border/50 rounded-lg p-6 text-center">
      <h3 className="text-xl font-bold text-white">Histórico de Trades LUCRA</h3>
      <p className="text-text-secondary mt-2">
        O histórico de trades executados pelo módulo LUCRA será exibido aqui.
      </p>
    </div>
  );
};

export default LucraTradeHistory;
