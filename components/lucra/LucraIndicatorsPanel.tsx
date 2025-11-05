// components/lucra/LucraIndicatorsPanel.tsx
import React from 'react';
// FIX: Corrected import path for types
import { InternalIndicators } from '../../types';
import BarChartIcon from '../icons/BarChartIcon';
import TrendingUpIcon from '../icons/TrendingUpIcon';
import DollarSignIcon from '../icons/DollarSignIcon';
import { formatPercentage } from '../../utils/formatters';

const IndicatorCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, colorClass?: string }> = ({ title, value, icon, colorClass = 'text-primary' }) => (
     <div className="bg-background/50 p-4 rounded-lg border border-border/50 flex items-center gap-4">
        <div className={`flex-shrink-0 text-2xl ${colorClass}`}>{icon}</div>
        <div>
            <p className="text-sm text-text-secondary font-bold uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

interface LucraIndicatorsPanelProps {
    indicators: InternalIndicators | null;
}

const LucraIndicatorsPanel: React.FC<LucraIndicatorsPanelProps> = ({ indicators }) => {
    if (!indicators) {
        return (
            <div className="bg-surface/30 rounded-lg p-6 text-center text-text-secondary">
                Calculando indicadores...
            </div>
        );
    }
    
    const oiColor = indicators.oiTrend === 'up' ? 'text-success' : indicators.oiTrend === 'down' ? 'text-danger' : 'text-yellow-400';

    return (
        <div>
            <h3 className="text-lg font-bold text-text mb-4">Indicadores Internos (Tempo Real)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <IndicatorCard 
                    title="Imbalance (Book)" 
                    value={indicators.orderBookImbalance.toFixed(3)}
                    icon={<BarChartIcon />}
                    colorClass={indicators.orderBookImbalance > 1 ? 'text-success' : 'text-danger'}
                />
                 <IndicatorCard 
                    title="Tendência (OI)" 
                    value={`${indicators.oiTrend.toUpperCase()} (${formatPercentage(indicators.oiDeltaPercent, true)})`}
                    icon={<TrendingUpIcon />}
                    colorClass={oiColor}
                />
                 <IndicatorCard 
                    title="Funding Rate" 
                    value={formatPercentage(indicators.fundingRate * 100)}
                    icon={<DollarSignIcon />}
                    colorClass={indicators.fundingRate > 0 ? 'text-danger' : 'text-success'}
                />
            </div>
        </div>
    );
};

export default LucraIndicatorsPanel;
