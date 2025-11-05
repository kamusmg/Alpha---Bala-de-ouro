// components/AlphaDivergenceRadar.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import AlphaDivergenceRadarSkeleton from './skeletons/AlphaDivergenceRadarSkeleton';
import { DivergentAlpha } from '../types';
import { formatPercentage } from '../utils/formatters';
import RadarIcon from './icons/RadarIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';

const StrengthBar: React.FC<{ score: number }> = ({ score }) => {
    const getColor = (s: number) => {
        if (s > 85) return 'bg-success';
        if (s > 70) return 'bg-yellow-400';
        return 'bg-secondary';
    };
    return (
        <div>
            <p className="text-xs text-text-secondary font-bold mb-1">FORÇA RELATIVA</p>
            <div className="flex items-center gap-2">
                <div className="w-full bg-border h-2 rounded-full">
                    <div className={`${getColor(score)} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
                </div>
                <span className="font-bold text-white text-sm">{score}</span>
            </div>
        </div>
    );
};

const DivergenceCard: React.FC<{ asset: DivergentAlpha }> = ({ asset }) => {
    return (
        <div className="bg-background/50 border border-border/50 rounded-lg p-4 transition-all hover:border-primary/50">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold text-white">{asset.name} ({asset.ticker})</h4>
                    <p className="text-xs text-text-secondary -mt-1">Ativo Divergente</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-success">{formatPercentage(asset.performanceVsMarket.asset, true)}</p>
                    <p className="text-xs text-text-secondary">vs {formatPercentage(asset.performanceVsMarket.market, true)} (Mercado)</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
                 <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-secondary mt-1">
                        <LightbulbIcon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-text-secondary">
                        <strong className="text-white">Racional da IA:</strong> {asset.rationale}
                    </p>
                 </div>
            </div>
            <div className="mt-3">
                <StrengthBar score={asset.strengthScore} />
            </div>
        </div>
    );
};

const AlphaDivergenceRadar: React.FC = () => {
    const { presentDayData, isInitialLoading } = useData();
    
    if (isInitialLoading) {
        return <AlphaDivergenceRadarSkeleton />;
    }

    const divergentAssets = presentDayData?.alphaDivergence;

    if (!divergentAssets || divergentAssets.length === 0) {
        return null; // Don't render the component if there's no data
    }

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <RadarIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Radar de Divergência Alfa</h2>
            </div>
            <p className="text-sm text-text-secondary mb-6">
                Ativos que estão desafiando a tendência geral do mercado, com explicações geradas por IA para identificar os catalisadores.
            </p>
            <div className="space-y-4">
                {divergentAssets.map(asset => (
                    <DivergenceCard key={asset.ticker} asset={asset} />
                ))}
            </div>
        </div>
    );
};

export default AlphaDivergenceRadar;