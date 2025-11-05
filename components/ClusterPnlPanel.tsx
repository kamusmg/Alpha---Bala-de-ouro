// components/ClusterPnlPanel.tsx
import React from 'react';
import { ClusterPnl, LivePosition, MinimalAssetInfo, AssetCategory } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import CalculatorIcon from './icons/CalculatorIcon';

interface ClusterPnlPanelProps {
    livePositions: LivePosition[];
    allAssets: MinimalAssetInfo[];
}

const ClusterPnlPanel: React.FC<ClusterPnlPanelProps> = ({ livePositions, allAssets }) => {
    
    const assetCategoryMap = new Map(allAssets.map(asset => [asset.ticker, asset.category]));

    // FIX: Corrected accumulator type definition to align with the `AssetCategory` type.
    type ClusterAccumulator = Record<string, {
        category: AssetCategory;
        tradeCount: number;
        pnl: number;
        totalInvestment: number;
    }>;

    // FIX: Replaced the `reduce` function with a `for...of` loop to fix multiple TypeScript errors. The type checker was incorrectly inferring the accumulator as 'unknown', leading to indexing errors. This more explicit approach ensures correct typing for both the `clusters` object and its values.
    const clusters: ClusterAccumulator = {};
    for (const position of livePositions) {
        const category: AssetCategory = assetCategoryMap.get(position.asset) || 'Other';
        if (!clusters[category]) {
            clusters[category] = { category, tradeCount: 0, pnl: 0, totalInvestment: 0 };
        }
        clusters[category].tradeCount++;
        clusters[category].pnl += position.pnl;
        clusters[category].totalInvestment += position.entryPrice * position.size;
    }

    const clusterArray: ClusterPnl[] = Object.values(clusters).map(c => ({
        category: c.category,
        tradeCount: c.tradeCount,
        pnl: c.pnl,
        pnlPercentage: c.totalInvestment > 0 ? (c.pnl / c.totalInvestment) * 100 : 0,
    }));


    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CalculatorIcon className="h-6 w-6 text-primary" />
                P&amp;L por Cluster de Ativos (Aberto)
            </h3>
            <div className="space-y-3">
                {clusterArray.length > 0 ? clusterArray.map(cluster => {
                    const isProfit = cluster.pnl > 0;
                    return (
                        <div key={cluster.category} className="bg-background/50 p-3 rounded-md border-l-4" style={{ borderColor: isProfit ? '#22C55E' : '#EF4444' }}>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white">{cluster.category}</span>
                                <span className={`font-semibold font-mono ${isProfit ? 'text-success' : 'text-danger'}`}>
                                    {formatCurrency(cluster.pnl)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-1">
                                <span className="text-text-secondary">{cluster.tradeCount} trades</span>
                                <span className={`font-semibold font-mono ${isProfit ? 'text-success' : 'text-danger'}`}>
                                    {formatPercentage(cluster.pnlPercentage, true)}
                                </span>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-center text-text-secondary text-sm py-8">Nenhum cluster de P&amp;L para exibir.</p>
                )}
            </div>
        </div>
    );
};

export default ClusterPnlPanel;