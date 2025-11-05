// components/lucra/LucraControlDashboard.tsx
import React from 'react';
import SlidersIcon from '../icons/SlidersIcon';

const LucraControlDashboard: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-text mb-2 flex items-center gap-2">
                <SlidersIcon className="h-6 w-6 text-primary" />
                Painel de Controle LUCRA
            </h3>
            <p className="text-text-secondary text-sm">
                Ajuste os parâmetros de execução do módulo em tempo real. Esta funcionalidade está em desenvolvimento.
            </p>
            {/* Placeholder for future controls */}
            <div className="mt-6 text-center text-text-secondary py-8 bg-background/30 rounded-lg">
                <p>Controles de Risco, Agressividade e Seleção de Ativos aparecerão aqui.</p>
            </div>
        </div>
    );
};

export default LucraControlDashboard;
