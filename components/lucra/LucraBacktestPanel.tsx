// components/lucra/LucraBacktestPanel.tsx
import React from 'react';
import HistoryIcon from '../HistoryIcon';

const LucraBacktestPanel: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
             <div className="flex items-center gap-3 mb-2">
                <HistoryIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Backtest do Módulo LUCRA</h2>
            </div>
            <p className="text-sm text-text-secondary">
                Execute simulações históricas com a lógica do LUCRA para validar sua eficácia em diferentes períodos de mercado. (Funcionalidade em desenvolvimento)
            </p>
             <div className="mt-6 text-center text-text-secondary py-10 bg-background/30 rounded-lg">
                <p>O painel de simulação e resultados de backtest do LUCRA estará disponível aqui.</p>
            </div>
        </div>
    );
};

export default LucraBacktestPanel;
