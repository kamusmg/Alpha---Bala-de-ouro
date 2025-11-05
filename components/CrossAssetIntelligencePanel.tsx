// components/CrossAssetIntelligencePanel.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import CrossAssetIntelligencePanelSkeleton from './skeletons/CrossAssetIntelligencePanelSkeleton';
import BarChartHorizontalIcon from './icons/BarChartHorizontalIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';
import TrendingSidewaysIcon from './icons/TrendingSidewaysIcon';

const CorrelationBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const isPositive = value >= 0;
    const width = Math.abs(value) * 100;

    return (
        <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-text-secondary text-right">{label}</span>
            <div className="flex-1 bg-background/50 rounded-full h-6 p-1 flex items-center">
                <div 
                    className={`h-full rounded-full ${isPositive ? 'bg-success' : 'bg-danger'}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
             <span className={`w-12 text-sm font-mono font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>{value.toFixed(2)}</span>
        </div>
    );
};

const SectorFlow: React.FC<{ sector: string; flow: 'Inflow' | 'Outflow' | 'Neutral' }> = ({ sector, flow }) => {
    const config = {
        Inflow: { icon: <TrendingUpIcon className="h-5 w-5 text-success" />, text: 'text-success' },
        Outflow: { icon: <TrendingDownIcon className="h-5 w-5 text-danger" />, text: 'text-danger' },
        Neutral: { icon: <TrendingSidewaysIcon className="h-5 w-5 text-yellow-400" />, text: 'text-yellow-400' }
    };
    return (
        <div className="bg-background/50 border border-border/50 rounded-lg p-4 text-center">
             <h4 className="text-sm font-bold text-white uppercase tracking-wider">{sector}</h4>
             <div className={`flex items-center justify-center gap-2 mt-2 font-bold ${config[flow].text}`}>
                {config[flow].icon}
                <span>{flow}</span>
             </div>
        </div>
    );
};

const CrossAssetIntelligencePanel: React.FC = () => {
    const { isInitialLoading } = useData();

    if (isInitialLoading) {
        return <CrossAssetIntelligencePanelSkeleton />;
    }

    // This is mock data as it's not provided by the context yet.
    const correlations = {
        'BTC vs ETH': 0.85,
        'BTC vs SOL': 0.72,
        'BTC vs SPX': 0.45,
        'BTC vs GOLD': -0.21
    };

    const flows = {
        'L1/L2': 'Inflow',
        'DeFi': 'Outflow',
        'Gaming': 'Inflow',
        'Infra': 'Neutral'
    } as const;

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
                <BarChartHorizontalIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Inteligência Cross-Asset</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-white mb-3">Correlação de 30 Dias com BTC</h3>
                     <div className="space-y-3">
                        {Object.entries(correlations).map(([label, value]) => (
                            <CorrelationBar key={label} label={label} value={value} />
                        ))}
                    </div>
                </div>
                 <div>
                     <h3 className="font-bold text-white mb-3">Fluxo de Capital Setorial (7 Dias)</h3>
                     <div className="grid grid-cols-2 gap-4">
                        {Object.entries(flows).map(([sector, flow]) => (
                            <SectorFlow key={sector} sector={sector} flow={flow} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossAssetIntelligencePanel;
