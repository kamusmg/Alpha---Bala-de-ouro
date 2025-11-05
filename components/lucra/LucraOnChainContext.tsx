// components/lucra/LucraOnChainContext.tsx
import React from 'react';
// FIX: Corrected import path for types.
import { InternalIndicators, DeepOnChainAnalysis } from '../../types';
import InfoTooltip from '../InfoTooltip';

interface LucraOnChainContextProps {
    lucraIndicators: InternalIndicators | null;
    onChainAnalysis: DeepOnChainAnalysis | null;
}

const LucraOnChainContext: React.FC<LucraOnChainContextProps> = ({ lucraIndicators, onChainAnalysis }) => {
    if (!lucraIndicators || !onChainAnalysis) {
        return (
            <div className="bg-background/50 p-4 rounded-lg border border-border/50 animate-pulse">
                <div className="h-4 w-1/3 bg-border rounded-md mb-2"></div>
                <div className="h-3 w-full bg-border rounded-md"></div>
                <div className="h-3 w-5/6 bg-border rounded-md mt-1"></div>
            </div>
        );
    }

    const imbalanceDirection = lucraIndicators.orderBookImbalance > 1.05 ? 'BUY' : lucraIndicators.orderBookImbalance < 0.95 ? 'SELL' : 'NEUTRAL';
    const whaleDirection = onChainAnalysis.whaleWatch.last24hNetFlow > 0 ? 'BUY' : 'SELL';

    const isConfluent = imbalanceDirection !== 'NEUTRAL' && imbalanceDirection === whaleDirection;
    // FIX: Removed redundant 'whaleDirection !== 'NEUTRAL'' check, as 'whaleDirection' can never be 'NEUTRAL'.
    const isDivergent = imbalanceDirection !== 'NEUTRAL' && imbalanceDirection !== whaleDirection;

    let title = 'Contexto On-Chain: Neutro';
    let description = 'O fluxo tático não apresenta viés claro em relação à atividade on-chain.';
    let config = {
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/50',
        textColor: 'text-yellow-300'
    };

    if (isConfluent) {
        title = 'Contexto On-Chain: Confluência Alta';
        description = 'Fluxo de ordens alinhado com a atividade de baleias, aumentando a convicção do sinal.';
        config = {
            bg: 'bg-success/10',
            border: 'border-success/50',
            textColor: 'text-green-300'
        };
    } else if (isDivergent) {
        title = 'Contexto On-Chain: Divergência';
        description = 'Fluxo de ordens diverge da atividade de baleias. Cautela recomendada.';
         config = {
            bg: 'bg-danger/10',
            border: 'border-danger/50',
            textColor: 'text-red-300'
        };
    }


    return (
        <div className={`p-4 rounded-lg border ${config.border} ${config.bg}`}>
            <h4 className={`font-bold text-sm ${config.textColor} flex items-center`}>
                {title}
                <InfoTooltip text="Correlação entre o imbalance do livro de ordens (curto prazo) e a movimentação de baleias (médio prazo)." />
            </h4>
            <p className="text-xs text-text-secondary mt-1">{description}</p>
        </div>
    );
};

export default LucraOnChainContext;
