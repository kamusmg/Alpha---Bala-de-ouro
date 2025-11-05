// components/AdvancedMarketRegimePanel.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import AdvancedMarketRegimePanelSkeleton from './skeletons/AdvancedMarketRegimePanelSkeleton';
import { MarketRegime } from '../types';
import RegimeHeatmap from './RegimeHeatmap';
import CompassIcon from './icons/CompassIcon';
import InfoTooltip from './InfoTooltip';

const RegimeDisplay: React.FC<{ regime: MarketRegime, transition?: MarketRegime | null }> = ({ regime, transition }) => {
    const config: Record<MarketRegime, { text: string; bg: string; border: string; }> = {
        Bull: { text: 'text-success', bg: 'bg-success/10', border: 'border-success' },
        Bear: { text: 'text-danger', bg: 'bg-danger/10', border: 'border-danger' },
        Sideways: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400' },
        Stress: { text: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary' }
    };
    const currentConfig = config[regime];

    return (
        <div className={`p-6 rounded-lg border-2 ${currentConfig.border} ${currentConfig.bg} text-center h-full flex flex-col justify-center`}>
            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Regime Atual</p>
            <p className={`text-5xl font-bold my-1 ${currentConfig.text}`}>{regime.toUpperCase()}</p>
            {transition && <p className="text-xs text-text-secondary">Transição detectada de <span className="font-bold">{transition}</span></p>}
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value?: string | number; tooltip: string; children?: React.ReactNode }> = ({ title, value, tooltip, children }) => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4 h-full">
        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center">
            {title}
            <InfoTooltip text={tooltip} />
        </h4>
        {children || <p className="text-2xl font-bold text-white mt-1">{value}</p>}
    </div>
);

const ScoreIndicator: React.FC<{ score: number, colorClass?: string }> = ({ score, colorClass = 'bg-primary' }) => {
    return (
        <div className="flex items-center gap-3 mt-2">
            <div className="w-full bg-border h-2 rounded-full">
                <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="font-bold text-white text-xl">{score}%</span>
        </div>
    );
}

const AdvancedMarketRegimePanel: React.FC = () => {
    const { presentDayData, isInitialLoading } = useData();

    if (isInitialLoading || !presentDayData?.advancedMarketRegime) {
        return <AdvancedMarketRegimePanelSkeleton />;
    }

    const {
        currentRegime,
        regimeTransitionDetected,
        transitionFrom,
        accelerationScore,
        exhaustionScore,
        interclassDominance,
        heatmap90d,
        strategyRecommendation,
        recommendationRationale
    } = presentDayData.advancedMarketRegime;

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
                <CompassIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Painel de Regimes de Mercado Avançado</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <RegimeDisplay regime={currentRegime} transition={regimeTransitionDetected ? transitionFrom : undefined} />
                </div>
                <div className="lg:col-span-2">
                     <MetricCard title="Recomendação Estratégica" tooltip={recommendationRationale}>
                         <p className="text-2xl font-bold text-primary mt-1">{strategyRecommendation}</p>
                         <p className="text-xs text-text-secondary mt-1">{recommendationRationale}</p>
                    </MetricCard>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
                 <MetricCard title="Aceleração" tooltip="Mede a força e a velocidade da tendência atual.">
                     <ScoreIndicator score={accelerationScore} colorClass="bg-success" />
                 </MetricCard>
                 <MetricCard title="Exaustão" tooltip="Indica o risco da tendência atual estar perdendo força.">
                    <ScoreIndicator score={exhaustionScore} colorClass="bg-danger" />
                 </MetricCard>
                 <MetricCard title="Dominância" value={interclassDominance.btcVsAlts} tooltip="Qual classe de ativo está liderando: Bitcoin ou Altcoins?" />
                 <MetricCard title="Fluxo" value={interclassDominance.spotVsDerivatives} tooltip="O volume dominante vem de compras à vista (spot) ou de derivativos?" />
                 <MetricCard title="Narrativa Quente" value={interclassDominance.strongestNarrative} tooltip="O setor ou tema com maior momentum no mercado." />
            </div>

            <div>
                <h4 className="font-bold text-text mb-2">Mapa de Calor dos Últimos 90 Dias</h4>
                <RegimeHeatmap data={heatmap90d} />
            </div>
        </div>
    );
};

export default AdvancedMarketRegimePanel;
