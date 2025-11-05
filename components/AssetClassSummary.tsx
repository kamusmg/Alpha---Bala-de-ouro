import React from 'react';
import { AssetClassSummary as AssetClassSummaryType, AssetCategory } from '../types';
import VisualIndicator from './VisualIndicator';
import AssetClassSummarySkeleton from './skeletons/AssetClassSummarySkeleton';
import PieChartIcon from './icons/PieChartIcon';

interface AssetClassSummaryProps {
    summaries: AssetClassSummaryType[];
    selectedCategory: AssetCategory | 'All';
    onSelectCategory: (category: AssetCategory | 'All') => void;
}

const AssetClassSummary: React.FC<AssetClassSummaryProps> = ({ summaries, selectedCategory, onSelectCategory }) => {
    
    if (summaries.length === 0) {
        return <AssetClassSummarySkeleton />;
    }

    const CategoryButton: React.FC<{ category: AssetCategory | 'All'; count?: number; sentiment?: number }> = ({ category, count, sentiment }) => {
        const isActive = selectedCategory === category;
        return (
            <button
                onClick={() => onSelectCategory(category)}
                className={`w-full text-left p-3 rounded-lg transition-all border-2 ${isActive ? 'bg-primary/20 border-primary' : 'bg-background/50 border-border/50 hover:border-border'}`}
            >
                <div className="flex justify-between items-center">
                    <span className={`font-bold ${isActive ? 'text-primary' : 'text-white'}`}>{category}</span>
                    {count !== undefined && <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-primary text-white' : 'bg-border text-text-secondary'}`}>{count}</span>}
                </div>
                {sentiment !== undefined && (
                    <div className="mt-2">
                        <VisualIndicator percentage={sentiment} />
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <PieChartIcon className="h-6 w-6 text-primary" />
                Resumo Setorial
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <CategoryButton category="All" count={summaries.reduce((acc, s) => acc + s.assetCount, 0)} />
                {summaries.map(summary => (
                    <CategoryButton 
                        key={summary.category}
                        category={summary.category}
                        count={summary.assetCount}
                        sentiment={summary.sentiment}
                    />
                ))}
            </div>
        </div>
    );
};

export default AssetClassSummary;
