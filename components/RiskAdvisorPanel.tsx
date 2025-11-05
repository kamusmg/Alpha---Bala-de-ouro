// components/RiskAdvisorPanel.tsx
import React from 'react';
import { RiskSizingRecommendation } from '../types';
import ScaleIcon from './icons/ScaleIcon';
import InfoTooltip from './InfoTooltip';

interface RiskAdvisorPanelProps {
    recommendation: RiskSizingRecommendation | null;
    isLoading: boolean;
}

const Metric: React.FC<{ label: string; value: string; tooltip: string }> = ({ label, value, tooltip }) => (
    <div className="py-2 border-b border-border/50 last:border-0">
        <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary flex items-center">{label} <InfoTooltip text={tooltip} /></span>
            <span className="font-bold text-white font-mono">{value}</span>
        </div>
    </div>
);


const RiskAdvisorPanel: React.FC<RiskAdvisorPanelProps> = ({ recommendation, isLoading }) => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ScaleIcon className="h-6 w-6 text-primary" />
                Consultor de Risco
            </h3>
            {isLoading && !recommendation ? (
                 <p className="text-sm text-text-secondary text-center py-8 animate-pulse">Analisando parâmetros de risco...</p>
            ) : recommendation ? (
                <div>
                    <div className="space-y-2">
                        <Metric label="Risco Máx. do Portfólio" value={`${recommendation.maxPortfolioRisk}%`} tooltip="Risco total máximo recomendado para todo o portfólio, com base na volatilidade atual." />
                        <Metric label="Tamanho da Posição" value={`${recommendation.idealPositionSize}%`} tooltip="Tamanho ideal para uma nova posição, como percentual do capital total." />
                        <Metric label="Alavancagem Máxima" value={`${recommendation.maxLeverage}x`} tooltip="Alavancagem máxima sugerida para trades em derivativos." />
                    </div>
                    {recommendation.rationale && (
                        <div className="mt-4 pt-3 border-t border-border/50">
                             <p className="text-xs text-text-secondary italic">
                                <strong className="text-primary not-italic">Racional da IA:</strong> {recommendation.rationale}
                             </p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-text-secondary text-center py-8">Não foi possível carregar a recomendação.</p>
            )}
        </div>
    );
};

export default RiskAdvisorPanel;